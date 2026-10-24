#!/usr/bin/env node
/**
 * Curates a fresh channel snapshot from the iptv-org API into public/channels.json.
 *
 * Why a build-time snapshot instead of runtime fetching: the full API is ~11 MB
 * across three files. We distill it to a few hundred kilobytes of browser-playable
 * HLS channels so first load stays fast and every link is fresh as of generation.
 *
 * Run manually:  npm run update:channels
 * Run weekly:    .github/workflows/refresh-channels.yml
 */
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const API = 'https://iptv-org.github.io/api';
const OUT_PATH = resolve(process.argv.find((a) => a.startsWith('--out='))?.slice(6) ?? 'public/channels.json');
const TOTAL_LIMIT = Number(process.argv.find((a) => a.startsWith('--limit='))?.slice(8) ?? 1500);
const PER_COUNTRY_LIMIT = Number(
  process.argv.find((a) => a.startsWith('--per-country='))?.slice(14) ?? 25,
);

const QUALITY_RANK = { '1080p': 6, '1080i': 6, '720p': 5, '576p': 4, '540p': 4, '480p': 3, '360p': 2 };

async function fetchJson(name) {
  const res = await fetch(`${API}/${name}`);
  if (!res.ok) throw new Error(`Failed to fetch ${name}: ${res.status}`);
  console.log(`fetched ${name}`);
  return res.json();
}

const countryName = (() => {
  const display = new Intl.DisplayNames(['en'], { type: 'region' });
  return (code) => {
    try {
      return display.of(code) ?? code;
    } catch {
      return code;
    }
  };
})();

function isPlayableInBrowser(stream) {
  // HLS only (hls.js), https only (the app is served over https), and no
  // custom headers (browsers cannot send arbitrary User-Agent/Referrer).
  return (
    stream.url.startsWith('https://') &&
    stream.url.includes('.m3u8') &&
    !stream.user_agent &&
    !stream.referrer
  );
}

function bestStream(streams) {
  return streams
    .map((stream) => ({
      stream,
      score: (stream.feed === null ? 2 : 0) + (QUALITY_RANK[stream.quality] ?? 1),
    }))
    .sort((a, b) => b.score - a.score)[0]?.stream;
}

function bestLogo(entries) {
  return entries
    .map((logo) => ({
      logo,
      score:
        (logo.in_use ? 2 : 0) +
        (logo.feed === null ? 1 : 0) +
        (logo.url.startsWith('https://') ? 1 : 0) +
        ((logo.width ?? 0) * (logo.height ?? 0)) / 1_000_000,
    }))
    .sort((a, b) => b.score - a.score)[0]?.logo;
}

async function main() {
  const [streams, channels, logos] = await Promise.all([
    fetchJson('streams.json'),
    fetchJson('channels.json'),
    fetchJson('logos.json'),
  ]);

  const channelById = new Map(channels.map((channel) => [channel.id, channel]));
  const logosByChannel = new Map();
  for (const logo of logos) {
    if (!logosByChannel.has(logo.channel)) logosByChannel.set(logo.channel, []);
    logosByChannel.get(logo.channel).push(logo);
  }

  const streamsByChannel = new Map();
  let skippedUnplayable = 0;
  for (const stream of streams) {
    if (!stream.channel || !channelById.has(stream.channel)) continue;
    if (!isPlayableInBrowser(stream)) {
      skippedUnplayable += 1;
      continue;
    }
    if (!streamsByChannel.has(stream.channel)) streamsByChannel.set(stream.channel, []);
    streamsByChannel.get(stream.channel).push(stream);
  }

  const byCountry = new Map();
  for (const [id, candidates] of streamsByChannel) {
    const channel = channelById.get(id);
    if (channel.is_nsfw || channel.closed || channel.replaced_by) continue;

    const stream = bestStream(candidates);
    const logo = bestLogo(logosByChannel.get(id) ?? []);
    const entry = {
      id,
      name: channel.name,
      url: stream.url,
      logo: logo?.url ?? null,
      quality: stream.quality,
      category: channel.categories?.[0] ?? null,
      country: { code: channel.country, name: countryName(channel.country) },
    };
    if (!byCountry.has(channel.country)) byCountry.set(channel.country, []);
    byCountry.get(channel.country).push(entry);
  }

  // Prefer channels with a logo and a known quality within each country.
  const rank = (entry) => (entry.logo ? 2 : 0) + (entry.quality ? 1 : 0);
  const trimmed = [];
  for (const [code, entries] of byCountry) {
    entries.sort((a, b) => rank(b) - rank(a) || a.name.localeCompare(b.name));
    trimmed.push({ code, entries: entries.slice(0, PER_COUNTRY_LIMIT) });
  }

  // Keep the total bounded by trimming the most over-represented countries first.
  let total = trimmed.reduce((sum, { entries }) => sum + entries.length, 0);
  while (total > TOTAL_LIMIT) {
    trimmed.sort((a, b) => b.entries.length - a.entries.length);
    trimmed[0].entries.pop();
    total -= 1;
  }

  const finalChannels = trimmed
    .flatMap(({ entries }) => entries)
    .sort((a, b) => a.country.name.localeCompare(b.country.name) || a.name.localeCompare(b.name));

  const file = {
    generatedAt: new Date().toISOString(),
    source: `${API}/streams.json`,
    count: finalChannels.length,
    channels: finalChannels,
  };

  await mkdir(dirname(OUT_PATH), { recursive: true });
  await writeFile(OUT_PATH, `${JSON.stringify(file)}\n`);

  const countries = new Set(finalChannels.map((c) => c.country.code)).size;
  const withLogos = finalChannels.filter((c) => c.logo).length;
  console.log(
    `wrote ${OUT_PATH}: ${finalChannels.length} channels, ${countries} countries, ` +
      `${withLogos} with logos (${skippedUnplayable} unplayable streams skipped)`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

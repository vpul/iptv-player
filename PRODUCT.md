# Product

## Register

product

## Users

People who want to lean back and watch free, publicly available live television from around the world. Typical context: evening, couch, lights dimmed, laptop or TV browser. They are browsing, not working: the job is "find something worth watching in under a minute and start it full screen." Secondary users: the repo owner, refreshing the channel list with one script run.

## Product Purpose

Still is a calm IPTV player: a virtualized, searchable grid of live channels curated from the iptv-org community database, and a dependable HLS player. Success: the app opens fast, every visible channel plays (or fails gracefully with an alternative), and nothing on screen shouts. It replaces a 2020-era Create React App whose stream links had rotted.

## Brand Personality

Quiet, warm, unhurried. Three words: calm, deliberate, polished. The interface should feel like a dim reading room, not a sports bar: dark surfaces, one soft sage accent, generous space, typography that whispers. The wordmark is the only expressive moment; everything else recedes so channel logos and video glow.

## Anti-references

- Netflix-style urgency: red accents, autoplay carousels, "because you watched" noise.
- Pirate-streamer clutter: 7,000-channel walls, popups, density as a feature.
- The current UI: flat gray CRA default, spinner-centered loading, no states.
- Generic AI dark mode: near-black #0a0a0a with neon purple gradients.

## Design Principles

1. **Content is the brightest thing on screen.** Surfaces stay darker and quieter than channel logos and video.
2. **Never strand the viewer.** Every load, empty, and dead-stream moment resolves to a next action (retry, clear search, watch something else).
3. **One accent, earned.** Sage green marks selection and primary action only. Everything else is ink on neutral.
4. **Motion answers, it doesn't perform.** 150–250 ms state transitions; no page-load choreography.
5. **The list is the product.** Search, country, and category filters must feel instant and keyboard-friendly.

## Accessibility & Inclusion

WCAG 2.1 AA: body text ≥4.5:1 contrast on dark surfaces, focus-visible rings on all interactive elements, full keyboard reachability, `prefers-reduced-motion` honored everywhere, semantic landmarks and alt text for channel logos.

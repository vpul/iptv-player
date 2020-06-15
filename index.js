const Axios = require('axios');
const fs = require('fs');
const parser = require('iptv-playlist-parser');

const getUnsortedChannels = async () => {
  const unsortedPlaylist = 'https://raw.githubusercontent.com/iptv-org/iptv/master/channels/unsorted.m3u';
  const { data } = await Axios.get(unsortedPlaylist);
  const result = parser.parse(data);
  const formattedResult = result.items.map(channel => {
    const formattedChannel = {
      name: channel.name,
      logo: channel.tvg.logo,
      url: channel.url,
      category: channel.group.title,
      language: {
        name: channel.tvg.language
      },
      country: {
        name: channel.tvg.country 
      },
      tvg: channel.tvg 
    }
    return formattedChannel;
  });
  return formattedResult;
}

const getChannels = async () => {
  const source = 'https://iptv-org.github.io/iptv/channels.json';
  const { data } =  await Axios.get(source);
  const unsortedChannels = await getUnsortedChannels();
  const channels = [...data,...unsortedChannels];
  return channels;
};

const filterOutHttp = (channels) => {
  const filteredChannels = channels.filter((channel) => {
    return channel.url.substring(0,5) === 'https';
  }); 
  return filteredChannels;
};

const filterOutXXX = (channels) => {
  const filteredChannels = channels.filter((channel) => {
    return channel.category !== 'XXX';
  });
  return filteredChannels;
}

const filterOutSameAccessOrigin = async (channels) => {
  const filteredChannels = channels.filter(async (channel) => {
    try {
      const { headers } = await Axios.get(channel.url, {
        headers: {
          Origin: 'example.com',
        }
      });
      return headers['access-control-allow-origin'] === '*' || headers['access-control-allow-origin'] === 'example.com';
    } catch(error) {
      if (error.response) {
        console.error(`${error.config.url} - ${error.response.status}:${error.response.statusText}`);
      } else if (error.request) {
        console.error(`${error.config.url} - ${error.message}`);
      } else {
        console.error(error);
      }
    }
  });
  return filteredChannels;
};

const getBrowserFriendlyChannels = async (channels) => {
    const channelsWithOutXXX = filterOutXXX(channels);
    const channelsWithHttps = filterOutHttp(channelsWithOutXXX);
    const channelsWithCORS = await filterOutSameAccessOrigin(channelsWithHttps);
    return channelsWithCORS;
};

const main = async () => {
  try {
    const channels = await getChannels();
    const filteredChannels = await getBrowserFriendlyChannels(channels);  // with HTTPS and without same-origin policy
    fs.writeFileSync('channels.json', JSON.stringify(filteredChannels));
  } catch(error) {
    if (error.response) {
      console.error(`${error.config.url} - ${error.response.status}:${error.response.statusText}`);
    } else if (error.request) {
      console.error(`${error.config.url} - ${error.message}`);
    } else {
      console.error(error);
    }
  }
};

main();


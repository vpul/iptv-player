const Axios = require('axios');
const fs = require('fs');
const parser = require('iptv-playlist-parser');
const winston = require('winston');
const Promise = require('bluebird');

const logger = winston.createLogger({
  transports: [
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

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

const filterOutSameOrigin = async (channels) => {
  let index = 0;

  const filteredChannels = await Promise.map(channels, async (channel) => {
    try {
      const { headers } = await Axios.get(channel.url, {
        headers: {
          Origin: 'example.com',
        }
      });

      if (headers['access-control-allow-origin'] === '*' || headers['access-control-allow-origin'] === 'example.com'){
        return channel;
      }
      console.log(`Processing ${++index} of ${channels.length} channels`);

    } catch(error) {
      if (error.response) {
        logger.error(`${error.config.url} - ${error.response.status}:${error.response.statusText}`);
      } else if (error.request) {
        logger.error(`${error.config.url} - ${error.message}`);
      } else {
        logger.error(error);
      }
    }
  }, {concurrency: 10});

  console.log(filteredChannels.length);
  return filteredChannels;
};

const getBrowserFriendlyChannels = async (channels) => {
    let filteredChannels = filterOutXXX(channels);
    filteredChannels = filterOutHttp(filteredChannels);
    filteredChannels = await filterOutSameOrigin(filteredChannels);
    return filteredChannels;
};

const main = async () => {
  try {
    const channels = await getChannels();
    const filteredChannels = await getBrowserFriendlyChannels(channels);  // with HTTPS and without same-origin policy
    fs.writeFileSync('channels.json', JSON.stringify(filteredChannels));
  } catch(error) {
    if (error.response) {
      logger.error(`${error.config.url} - ${error.response.status}:${error.response.statusText}`);
    } else if (error.request) {
      logger.error(`${error.config.url} - ${error.message}`);
    } else {
      logger.error(error.message);
    }
  }
};

main();
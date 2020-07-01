import Axios from 'axios';

const getChannels = async (channelId) => {
  const endpoint = 'https://vpul.github.io/iptv-player/channels.json';

  const { data } = await Axios.get(endpoint);

  //add id to each array items
  const channelsArray = data.map((channel, index) => {
    return {
      id: index,
      ...channel,
    };
  });
  if (channelId) {
    return channelsArray[channelId];
  }
  return channelsArray;
}

export default getChannels;

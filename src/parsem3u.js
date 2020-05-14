import Axios from 'axios';

const getChannels = async () => {
  const source = 'https://iptv-org.github.io/iptv/channels.json';
  const { data } =  await Axios.get(source);
  const uniqChannels = getUniqChannels(data);
  return uniqChannels;
};

// remove channels with same video stream URL
const getUniqChannels = (data) => {
  const uniqChannels = [];
  data.forEach(channel => { 
    const index = uniqChannels.findIndex(uniq => uniq.url === channel.url);
    if (index === -1 && channel.url !== "") {
      uniqChannels.push(channel);
    }
  });
  return uniqChannels;
}

export default getChannels;
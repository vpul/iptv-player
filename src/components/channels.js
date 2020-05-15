import React from 'react';
import getChannels from '../parsem3u';
import ChannelCard from './channelCard';

const Channels = ({setSelectedChannel}) => {
  const [channels, setChannels] = React.useState([]);

  React.useEffect(() => {
    const fetchChannels = async () => {
      const channels = await getChannels();
      setChannels(channels);
    }
    fetchChannels();
  }, []);

  const clickHandler = (channel) => {
    setSelectedChannel(channel);
  }

  return (
    <div className="flex flex-wrap">
      {channels.map(channel => {
        return (
          <div  key={channel.url} className="h-56 w-1/2 sm:w-1/3 lg:w-1/6 p-3">
            <ChannelCard clickHandler={clickHandler} channel={channel} />
          </div>
        )
      })}
    </div>
  );
};

export default Channels;
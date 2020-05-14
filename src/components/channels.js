import React from 'react';
import getChannels from '../parsem3u';

const Channels = () => {
  const [channels, setChannels] = React.useState([]);

  React.useEffect(() => {
    const fetchChannels = async () => {
      const channels = await getChannels();
      setChannels(channels);
    }
    fetchChannels();
  }, []);

  return (
    channels.map(channel => {
      return <li key={channel.url}>
        {channel.name}
        </li>
    })
  );
};

export default Channels;
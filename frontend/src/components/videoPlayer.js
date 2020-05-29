import React from 'react';
import ReactPlayer from 'react-player';
import getChannel from '../fetchChannels';

const VideoPlayer = ({match}) => {
  const [channel, setChannel] = React.useState({url: null});
  React.useEffect(() => {
    const fetchChannels = async () => {
      const channelData = await getChannel(`(where: {id: {_eq: ${match.params.id}}})`);
      setChannel(channelData[0]);
    }
    fetchChannels();
  }, [match.params.id]);
  
  return (
    <div >
      <div className='relative h-screen'>
        <ReactPlayer 
          className='absolute' 
          url={channel.url} 
          playing 
          controls 
          width='100%' 
          height='100%'
          config={{
            file: {
              attributes: {
                crossOrigin: 'true'
              }
            }
          }}
        />
      </div>
    </div>
  );
};

export default VideoPlayer;

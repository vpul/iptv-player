import React from 'react';
import ReactPlayer from 'react-player';
import getChannel from '../fetchChannels';

const VideoPlayer = ({match}) => {
  const [channel, setChannel] = React.useState({url: null});
  const [error, setError] = React.useState({
    isError: false,
    details: {},
  });
  
  React.useEffect(() => {
    const fetchChannels = async () => {
      const channelData = await getChannel(match.params.id);
      setChannel(channelData);
    }
    fetchChannels();
  }, [match.params.id]);
  
  return (
    <>
    { error.isError && (<div className="absolute top-0 z-10 flex justify-center items-end w-screen h-64">
      <div>
        <div className="text-2xl text-gray-100 ">An error occurred requesting video stream</div>
        <div className="text-gray-400">Reason: {error.details.type} </div>
      </div>
    </div>)}
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
          onError = {(err, data) => {
            return setError({
              isError: true,
              details: data
            })
          }}
        />
      </div>
    </div>
    </>
  );
};

export default VideoPlayer;

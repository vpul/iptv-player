import React from 'react';
import ReactPlayer from 'react-player';
import Channels from './channels';

const App = () => {
  const [selectedChannel, setSelectedChannel] = React.useState('');

  return (
    <>
      <div className='player-wrapper'>
        <ReactPlayer url={selectedChannel.url} playing controls width='100%' height='100%'/>
      </div>
      <div className="container mx-auto">
        <Channels setSelectedChannel={setSelectedChannel} />
      </div>
    </>
  );
}

export default App;

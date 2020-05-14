import React from 'react';
import ReactPlayer from 'react-player';
import Channels from './channels';
import './App.css';

const App = () => {
  const [selectedChannel, setSelectedChannel] = React.useState('');

  return (
    <Channels setSelectedChannel={setSelectedChannel} />
    // <div className='player-wrapper'>
    //   <ReactPlayer url='https://d2ktlibtvvj8vp.cloudfront.net/trace_urbaninter/5/prog_index.m3u8' playing controls width='100%' height='100%'/>
    // </div>
  );
}

export default App;

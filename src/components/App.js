import React from 'react';
import ReactPlayer from 'react-player';
import './App.css';

const App = () => {
  return (
   <ReactPlayer url='https://d2ktlibtvvj8vp.cloudfront.net/trace_urbaninter/5/prog_index.m3u8' playing controls width='100%'
   height='100%'/>
  );
}

export default App;

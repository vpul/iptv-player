import React from 'react';
import ReactPlayer from 'react-player';
const Channels = React.lazy(() => import('./channels'));

const App = () => {
  const [selectedChannel, setSelectedChannel] = React.useState('');

  return (
    <>
      <div className="bg-gray-100 shadow-md h-12">
        Menu
      </div>
      <div className='player-wrapper'>
        <ReactPlayer url={selectedChannel.url} playing controls width='100%' height='100%'/>
      </div>
      <React.Suspense fallback={<p className='text-6xl'>Loading...</p>}>
        <Channels setSelectedChannel={setSelectedChannel} />
      </React.Suspense>
    </>
  );
}

export default App;

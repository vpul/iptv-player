import React from 'react';
import LoadingSpinner from './loadingSpinner';
const Channels = React.lazy(() => import('./channels'));

const App = () => {
  const [selectedChannel, setSelectedChannel] = React.useState('');

  return (
    <>
      <div className="bg-gray-100 shadow-md h-12">
        Menu
      </div>
      <React.Suspense fallback={<LoadingSpinner />}>
        <Channels setSelectedChannel={setSelectedChannel} />
      </React.Suspense>
    </>
  );
}

export default App;

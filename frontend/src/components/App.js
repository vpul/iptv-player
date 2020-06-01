import React from 'react';
import LoadingSpinner from './loadingSpinner';
const Channels = React.lazy(() => import('./channels'));

const App = () => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const searchChangeHandler = (event) => setSearchTerm(event.target.value);

  return (
  <>
    <div className="shadow-md h-12 flex justify-center items-center fixed top-0 w-screen z-10 bg-gray-300">
      <input 
        className="rounded p-2 h-8 w-64 shadow" 
        type="text" 
        placeholder="Search" 
        value={searchTerm}
        onChange={searchChangeHandler}
      />
    </div>
    <React.Suspense fallback={<LoadingSpinner />}>
      <Channels className="mt-12" searchTerm={searchTerm} />
    </React.Suspense>
  </>
)};

export default App;

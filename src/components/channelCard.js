import React from 'react';
import { useImage } from 'react-image';
import LoadingSpinner from './loadingSpinner';

const Img = ({className, alt, src, onError}) => {
  const res = useImage({
    srcList: [src, 'https://picsum.photos/600/400.jpg?blur=6&grayscale'],
  });
 
  return (
    <img 
      src={res.src}
      className = {className}
      alt = {alt}
      onError = {onError}
    />
  )
}

const ChannelCard = ({clickHandler, channel }) => {
  // backup image in case original img source fails
  const imgErrorHandler = (e) => {
    if (e.target.src !== "https://picsum.photos/600/400.jpg?blur=6&grayscale") { // this prevents infinite loop error in cases where the backup image itself is down
      e.target.src="https://picsum.photos/600/400.jpg?blur=6&grayscale";
    }
  };

  return (
    <div onClick={() => clickHandler(channel)} className="group cursor-pointer rounded shadow-md hover:shadow-2xl w-full h-full bg-gray-100">
      <div className='w-full h-32 p-3 flex items-center justify-center'>
      <React.Suspense fallback={<LoadingSpinner />}>
        <Img
          className = 'mx-auto max-h-full'
          alt = {channel.name+' logo'} 
          src = {channel.logo || "https://picsum.photos/500/400.jpg?blur=6&grayscale"}
          onError = {imgErrorHandler}
        />
      </React.Suspense>
      </div>
      <h5 className="group-hover:text-gray-900 text-gray-700 font-medium p-3">{channel.name}</h5>
    </div>
  );
};

export default ChannelCard;

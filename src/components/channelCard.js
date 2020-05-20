import React from 'react';

const ChannelCard = ({clickHandler, channel }) => {
  const imgErrorHandler = (e) => {  // backup image in case original img source fails
    if (e.target.src !== "https://picsum.photos/500/400.jpg?blur=6&grayscale") { // this prevents infinite loop error in cases where the backup image itself is down
      e.target.src="https://picsum.photos/500/400.jpg?blur=6&grayscale";
    }
  };

  return (
    <div onClick={() => clickHandler(channel)} className="shadow-md w-full h-full bg-gray-100">
      <img 
        className="mx-auto" 
        alt={channel.name+' logo'} 
        src={channel.logo || "https://picsum.photos/500/400.jpg?blur=6&grayscale" } 
        onError={imgErrorHandler} 
      />
      <h3 className="m-1">{channel.name}</h3>
    </div>
  );
};

export default ChannelCard;

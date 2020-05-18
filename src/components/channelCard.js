import React from 'react';

const ChannelCard = ({clickHandler, channel }) => {
  return (
    <div onClick={() => clickHandler(channel)} className="shadow-md w-full h-full bg-gray-100">
      {/* <img className="mx-auto" alt={channel.name+' logo'} src={channel.logo} /> */}
      <h3 className="m-1">{channel.name}</h3>
    </div>
  );
};

export default ChannelCard;

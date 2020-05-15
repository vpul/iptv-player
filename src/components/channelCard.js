import React from 'react';

const ChannelCard = ({clickHandler, channel }) => {
  return (
    <div onClick={() => clickHandler(channel)} className="shadow-md w-full h-full">
      {/* <img src={logo} /> */}
      <h3>{channel.name}</h3>
    </div>
  );
};

export default ChannelCard;

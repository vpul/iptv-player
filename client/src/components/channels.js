import React from 'react';
import { WindowScroller, AutoSizer, Grid } from 'react-virtualized';
import 'react-virtualized/styles.css';
import getChannels from '../fetchChannels';
import ChannelCard from './channelCard';

const Channels = ({className, searchTerm}) => {
  const [channels, setChannels] = React.useState([]);

  React.useEffect(() => {
    const fetchChannels = async () => {
      const channelsData = await getChannels();
      setChannels(channelsData);
    }
    fetchChannels();
  }, []);

  const searchedChannels = searchTerm ? channels.filter(channel => (
    channel.name.toLowerCase().includes(searchTerm.toLowerCase())
    )) : channels;

  const Cell = ({ columnIndex, key, rowIndex, style }) => {
    const channelIndex = (rowIndex * 6) + columnIndex; 
    if (!searchedChannels[channelIndex]) return; // exit if the channel on that index doesn't exist
    return (
    <li className="list-none" key={key} style={style}>
      <div className="p-3 h-full w-full">
      <ChannelCard channel={searchedChannels[channelIndex]} />
      </div>
    </li>
  )};

  // To choose a good number for height & width, go to https://nerdcave.com/tailwind-cheat-sheet and select a size as per Tailwind standards
  const columnWidth = 192; // This is the cell width. Card size will be smaller due to padding
  const rowHeight = 224; // This is the cell height. Card size will be smaller due to padding
  return (
    <div className={`${className} min-h-screen container mx-auto`}>
      <WindowScroller>
        {({ height, isScrolling, onChildScroll, scrollTop }) => (
          <AutoSizer disableHeight>
            {
              ({width}) => {
                const columnCount = Math.floor(width/columnWidth);
                return (
                  <Grid
                    autoHeight
                    cellRenderer={Cell}
                    columnCount={columnCount}
                    columnWidth={columnWidth}
                    height={height}
                    isScrolling={isScrolling}
                    onScroll={onChildScroll}
                    scrollTop={scrollTop}
                    rowCount={Math.ceil(searchedChannels.length/columnCount)}
                    rowHeight={rowHeight}
                    width={width}
                    className = "flex justify-center"
                  />
                )
              }
            }
          </AutoSizer>
        )}
      </WindowScroller>
    </div>
  );
};

export default Channels;
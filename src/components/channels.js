import React from 'react';
import { WindowScroller, AutoSizer, Grid } from 'react-virtualized';
import 'react-virtualized/styles.css';
import getChannels from '../parsem3u';
import ChannelCard from './channelCard';

// const Channels = ({setSelectedChannel}) => {
//   const [channels, setChannels] = React.useState([]);

//   React.useEffect(() => {
//     const fetchChannels = async () => {
//       const channels = await getChannels();
//       setChannels(channels);
//     }
//     fetchChannels();
//   }, []);

//   const clickHandler = (channel) => {
//     setSelectedChannel(channel);
//   }

//   return (
//     // <div className="flex flex-wrap justify-center">
//     //   {channels.map(channel => {
//     //     return (
//     //       <li key={channel.url} className="list-none h-56 w-48 p-3">
//     //         <ChannelCard clickHandler={clickHandler} channel={channel} />
//     //       </li>
//     //     )
//     //   })}
//     // </div>
//     <List 
//       height={650}
//       itemCount={channels.count}
//       itemSize={250}
//       width={900}
//     >
//       {
//         ({index, style}) => (
//           // <div style={style} className="flex flex-wrap justify-center">
//           //   {channels.map(channel => {
//           //     return (
//           //       <li key={channel.url} className="list-none h-56 w-48 p-3">
//           //         <ChannelCard clickHandler={clickHandler} channel={channel} />
//           //       </li>
//           //     )
//           //   })}
//           // </div>
//           <div style={style}>Row {index}</div>
//         )
//       }
//     </List>
//   );
// };

// const Row = ({ index, style }) => (
//   <div className={index % 2 ? "ListItemOdd" : "ListItemEven"} style={style}>
//     Row {index}
//   </div>
// );

// const Channels = ({setSelectedChannel}) => {
//   const [channels, setChannels] = React.useState([]);

//   React.useEffect(() => {
//     const fetchChannels = async () => {
//       const channels = await getChannels();
//       setChannels(channels);
//     }
//     fetchChannels();
//   }, []);

//   const clickHandler = (channel) => {
//     setSelectedChannel(channel);
//   }

//   const ITEM_SIZE = 100;

//   return (
//   <div className="h-screen">
//     <AutoSizer>
//     {
//       ({ height, width }) => {
//         const itemsPerRow = Math.floor(width / ITEM_SIZE);
//         const rowCount = Math.ceil(channels.length / itemsPerRow);
//         return (
//         <List
//           className="List"
//           height={height}
//           itemCount={rowCount}
//           itemSize={ITEM_SIZE}
//           width={width}
//         >
//           {Row}
//         </List>
//       )}
//     }
//     </AutoSizer>
//   </div>
// )};

const Cell = ({ columnIndex, key, rowIndex, style }) => (
    <div key={key} style={style}>
    <div  className="bg-red-100 m-5">
    Item {rowIndex},{columnIndex}
    </div>
  </div>
  
);
 
const Channels = () => {
  return (
    <div className="min-h-screen container mx-auto bg-red-300">
      <WindowScroller>
        {({ height, isScrolling, onChildScroll, scrollTop }) => (
          <AutoSizer disableHeight>
            {
              ({width}) => {
                return (
                  <Grid
                    autoHeight
                    cellRenderer={Cell}
                    columnCount={12}
                    columnWidth={100}
                    height={height}
                    isScrolling={isScrolling}
                    onScroll={onChildScroll}
                    scrollTop={scrollTop}
                    rowCount={1000}
                    rowHeight={55}
                    width={width}
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
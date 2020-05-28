const { GraphQLClient } = require('graphql-request');
const Axios = require('axios');

const getChannels = async () => {
  const source = 'https://iptv-org.github.io/iptv/channels.json';
  const { data } =  await Axios.get(source);
  const formattedData = data.map(channel => {
    if (channel.name === null || channel.url === null) console.log(channel)
    channel.language = channel.language.length > 0 ? channel.language[0].name : null;
    channel.country = channel.country.name || null;
    delete channel.tvg;
    return channel;
  });
  console.log(formattedData[0])
  return formattedData;
};

const client = new GraphQLClient('https://api.webtv.rocks/v1/graphql', { headers: {
  "content-type": "application/json",
  "x-hasura-admin-secret": "yAXjh4U8zeKydDHZT3QjVGX2v"
} });

const query = `mutation insert_multiple_channels($objects: [iptv_channels_insert_input!]!) {
  insert_iptv_channels(objects: $objects) {
    returning {
      id
    }
  }
}`;

const main = async () => {
  try {
    const channels = await getChannels();
    const variables = { 
      "objects": channels 
    };

    const data = await client.request(query, variables);
    console.log(data);
  } catch(err) {
    console.error(err.response.errors || err);
  }
};

main();
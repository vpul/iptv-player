import { request } from 'graphql-request'

const getChannels = async (condition) => {
  const endpoint = 'https://api.webtv.rocks/v1/graphql';

  const query = `query selectAllChannels {
    iptv_channels${condition || ''} {
      id
      country
      category
      language
      logo
      name
      url
      views
    }
  }
  `;

  const { iptv_channels} = await request(endpoint, query);
  return iptv_channels;
}

export default getChannels;

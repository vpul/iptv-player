import { request } from 'graphql-request'

const getAllChannels = async () => {
  const endpoint = 'https://api.webtv.rocks/v1/graphql';

  const query = `query selectAllChannels {
      iptv_channels {
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

export default getAllChannels;

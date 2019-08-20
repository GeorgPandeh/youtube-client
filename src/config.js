import key from './constants';

const config = {
  searchApiPath: (search, maxResult) => `https://www.googleapis.com/youtube/v3/search?key=${key}&part=snippet&maxResults=${maxResult}&q=${search}`,
  videoApiPath: id => `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${key}&part=snippet,contentDetails,statistics,status`,
  videoPath: 'https://www.youtube.com/watch?v=',
};

export default config;

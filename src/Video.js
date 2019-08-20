import config from './config';

export default class Video {
  constructor(content) {
    this.content = content;
    this.buttonSearchatNumber = num => num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,'); // puts commas after every 3 numbers
    this.count = 0;
  }

  videoLayout(result, viewCount) {
    result.items.forEach((video, index) => {
      const videoItem = document.createElement('div');
      const videoPreview = document.createElement('div');
      const videoInfo = document.createElement('div');
      const img = document.createElement('img');
      const author = document.createElement('p');
      const date = document.createElement('p');
      const watchNumber = document.createElement('p');
      const description = document.createElement('p');
      const title = document.createElement('div');
      const link = document.createElement('a');
      videoItem.classList.add('video-item');
      videoInfo.classList.add('video-info');
      author.classList.add('author');
      date.classList.add('date');
      watchNumber.classList.add('watch-number');
      description.classList.add('description');
      title.classList.add('title');
      img.classList.add('image-preview');
      link.href = config.videoPath + video.id;
      link.target = '_blank';
      link.classList.add('link');
      img.src = video.snippet.thumbnails.medium.url;

      author.innerHTML = `<i class='fas fa-male' id='person'>\t${video.snippet.channelTitle}</i>`;
      date.innerHTML = `<i class='far fa-calendar-alt' id='calendar'>\t${video.snippet.publishedAt.slice(0, 10)}</i>`;
      watchNumber.innerHTML = `<i class='far fa-eye' id='view'>\t${this.buttonSearchatNumber(viewCount[index].statistics.viewCount)}</i>`;
      description.innerHTML = video.snippet.description;
      this.content.appendChild(videoItem);
      videoItem.appendChild(link);
      link.appendChild(videoPreview);
      videoPreview.appendChild(title);
      videoPreview.appendChild(img);
      title.appendChild(document.createTextNode(video.snippet.title));
      videoItem.appendChild(videoInfo);
      videoInfo.appendChild(author);
      videoInfo.appendChild(date);
      videoInfo.appendChild(watchNumber);
      videoInfo.appendChild(description);
      this.count += result.items.length;
      this.content.style.width = `${300 * this.count}px`;
    });
  }
}

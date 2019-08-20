import config from './config';
import Video from './Video';

class YouTube {
  constructor() {
    this.container = document.querySelector('.container');
    this.content = document.querySelector('.content');
    this.search = document.querySelector('.search-input');
    this.pageToken = '';
    this.viewCount = [];
    this.maxResult = 15;
    this.videoCounter = 0; // video count which can be displayed
    this.videoSize = 300; // size of videoItem
    this.visibleVideoItems = 4; // videoItem which on the screen after first submit
    this.firstWheelRequest = false;
  }

  initialize() {
    const searchInput = document.createElement('input');
    searchInput.classList.add('search-input');
    const buttonSearch = document.createElement('button');
    buttonSearch.classList.add('submit');
    const content = document.createElement('div');
    content.classList.add('content');
    searchInput.setAttribute('type', 'text');
    searchInput.setAttribute('placeholder', 'Search');
    buttonSearch.innerHTML = 'submit';
    this.container.appendChild(searchInput);
    this.container.appendChild(buttonSearch);
    this.container.appendChild(content);
    this.search = searchInput;
    this.content = content;
    this.addListener(buttonSearch);
  }

  addListener(buttonSearch) {
    buttonSearch.addEventListener('click', this.buttonSearchEvent.bind(this));
    this.content.addEventListener('wheel', this.wheelEvent.bind(this));
  }

  resetTransformation(e) {
    if (e.deltaY > 0) {
      this.content.style.transform += 'translateX(-100px)';
    } else if (e.deltaY < 0) {
      this.content.style.transform += 'translateX(100px)';
    } else {
      this.content.style.transform = 'translateX(0px)';
    }
  }

  getStatistics(result) {
    const idArray = [];
    result.items.forEach((item) => {
      if (item.id.videoId) {
        idArray.push(item.id.videoId);
      }
    });
    this.videoCounter = idArray.length;
    return idArray.join(',');
  }

  statisticsRequest(submitResult, buttonEvent) {
    fetch(config.videoApiPath(this.getStatistics(submitResult)))
      .then(response => response.json())
      .then((videoStatistics) => {
        this.viewCount = videoStatistics.items;
        if (buttonEvent) {
          this.deleteContent();
        }
        const video = new Video(this.content);
        video.videoLayout(videoStatistics, this.viewCount);
      });
  }

  deleteContent() {
    while (this.content.firstChild) {
      this.content.removeChild(this.content.firstChild);
      this.videoCounter = 0;
      this.firstWheelRequest = false;
    }
  }

  buttonSearchEvent(e) {
    this.resetTransformation.bind(null, e);
    fetch(config.searchApiPath(this.search.value, this.maxResult))
      .then(response => response.json())
      .then((submitResult) => {
        if (submitResult.nextPageToken) {
          this.pageToken = submitResult.nextPageToken;
        }
        const buttonEvent = true;
        this.statisticsRequest(submitResult, buttonEvent);
      })
      .catch((error) => {
        throw new Error(error);
      });
  }

  wheelEvent(e) {
    if (this.content.firstChild) {
      const translate = window.getComputedStyle(this.content);
      const translateMatrix = translate.transform;
      const translateValue = translateMatrix.split(',')[4];
      // transform looks like [1, 0, 0, 1, value of transform event, 0]
      // so, the 5th number is a current transform event. example: -100 or 100
      if (e.deltaY > 0) {
        this.resetTransformation(e);
        let transformLimit = (this.videoSize * this.videoCounter
         - this.videoSize * this.visibleVideoItems * 2);
        // this counts so: size of video item(300px) *
        // video which can be displayed(some video, from video3Api don't have id)
        // minus size of 4 visible video items on the screen
        // and multiply on 2 to start fetch before the last 4 items are shown.
        if (this.firstWheelRequest) {
          transformLimit += this.videoSize * this.visibleVideoItems;
        }
        // before the first wheel request is done - we should plus size of 4 video items,
        // because the first 4 video item now take a part in formation transform.
        if (this.pageToken && translateValue
        % transformLimit === 0
        && translateValue < -100) {
        // start fetch, when it reaches the transformation limit.
        // transformation limit - this is the extreme size of the transform, for which,
        // at the next scrolling, the fetch will begins.
        // to be sure not to see this.
        // http://prntscr.com/nyxunj
          fetch(`${config.searchApiPath(this.search.value, this.maxResult)}&pageToken=${this.pageToken}`)
            .then(response => response.json())
            .then((wheelResult) => {
              this.pageToken = wheelResult.nextPageToken;
              this.firstWheelRequest = true;
              this.statisticsRequest(wheelResult);
            })
            .catch((error) => {
              throw new Error(error);
            });
        }
      } else if (e.deltaY < 0 && translateValue < 0) {
        this.resetTransformation(e);
      }
      return false;
    }
    return false;
  }
}

window.onload = () => {
  const youtube = new YouTube();
  youtube.initialize();
};

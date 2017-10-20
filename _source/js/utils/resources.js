export default class Resources { 
  constructor() {
    this.resourceCache = {};
    this.readyCallbacks = [];
  }

  load(urlOrArr) {
    if (urlOrArr instanceof Array) {
      urlOrArr.forEach((url) => {
        this.loadImage(url);
      });
    } else {
      this.loadImage(urlOrArr);
    }
  }

  loadImage(url) {
    if (!this.resourceCache[url]) {
      const img = new Image();

      img.onload = () => {
        this.resourceCache[url] = img;

        if (this.isReady()) {
          this.readyCallbacks.forEach((func) => {
            func();
          });
        }
      };
      this.resourceCache[url] = false;
      img.src = url;
    }

    return this.resourceCache[url];
  }

  get(url) {
    return this.resourceCache[url];
  }

  isReady() {
    let ready = true;

    for (const k in this.resourceCache) {
      if (this.resourceCache.hasOwnProperty(k) &&
         !this.resourceCache[k]) {
        ready = false;
      }
    }
    return ready;
  }

  onReady(func) {
    this.readyCallbacks.push(func);
  }
}

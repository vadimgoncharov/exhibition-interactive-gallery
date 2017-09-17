import Picture from './Picture';

import TGalleryUserOptions              from '../types/TGalleryUserOptions';
import TGalleryUserOptionsPicture       from '../types/TGalleryUserOptionsPicture';
import TGalleryUserOptionsPictureLoaded from '../types/TGalleryUserOptionsPictureLoaded';

export default class Gallery {
  private canvasEl: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private pictures: Picture[];

  constructor(options: TGalleryUserOptions) {
    this.initDom(options);
    this
      .loadImages(this.getPicturesSortedByZIndex(options.pictures))
      .then(this.createPictures, this.onImgNotLoaded)
      .catch((error) => console.error(`loadImages error ${error}`));
  }

  private getPicturesSortedByZIndex(pictures: TGalleryUserOptionsPicture[]): TGalleryUserOptionsPicture[] {
    return pictures.sort((a, b) => a.zIndex - b.zIndex);
  }

  private initDom(options: TGalleryUserOptions): void {
    const {canvasEl} = options;
    if (canvasEl instanceof HTMLCanvasElement) {
      this.canvasEl = canvasEl;
      this.ctx = canvasEl.getContext('2d');
    }
  }

  private loadImages(pictures: TGalleryUserOptionsPicture[]): Promise<TGalleryUserOptionsPictureLoaded[]> {
    const promises: Array<Promise<TGalleryUserOptionsPictureLoaded>> = pictures.map(data => new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute('crossOrigin', '');
      img.onload = () => {
        resolve({
          ...data,
          img,
        });
      };
      img.onerror = () => {
        reject(`Image "${data.path}" error`);
      };
      img.src = data.path;
    }));
    return Promise.all(promises);
  }

  private onImgNotLoaded(error): void {
    console.error(`Image not loaded (${error})`);
  }

  private createPictures = (imgs: TGalleryUserOptionsPictureLoaded[]) => {
    const {canvasEl} = this;
    this.pictures = imgs.map(data => {
      return new Picture({
        canvas: canvasEl,
        image: data.img,
        startX: data.startX,
        startY: data.startY,
        width: data.width,
        height: data.height,
        topRightOffset: data.topRightOffset,
        bottomRightOffset: data.bottomRightOffset,
        borderColor: data.borderColor,
      });
    });
    this.render();
  }

  private render() {
    const {ctx, canvasEl} = this;
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    if (this.pictures) {
      this.pictures.forEach(picture => {
        picture.draw();
      });
    }
  }
}

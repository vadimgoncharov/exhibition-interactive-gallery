import Picture from './Picture';

import img1 from './img/Alice Lin.jpg';
import img2 from './img/Andor Becskei.jpg';
import img3 from './img/Andres Agosin.jpg';
import img4 from './img/Andres Agosin 2.jpg';
import img5 from './img/baku maeda.jpg';
import img6 from './img/geoff mcfetridge.jpg';
import img7 from './img/geoff mcfetridge 2.jpg';
import img8 from './img/isabelle JOUBERT.jpg';
import img9 from './img/isabelle JOUBERT 2.jpg';
import img10 from './img/James Roper.jpg';

type TAppOptionsPicture = {
  path: string,
  startX: number,
  startY: number,
  width: number,
  height: number,
  topRightOffset: number,
  bottomRightOffset: number
  borderColor: string,
  zIndex: number,
};

type TAppPicture = TAppOptionsPicture & {
  img: HTMLImageElement,
};

type TAppOptions = {
  pictures: TAppOptionsPicture[],
};

class App {
  private canvasEl: HTMLCanvasElement;
  private canvasTmp: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private ctxTmp: CanvasRenderingContext2D;
  private pictures: Picture[];
  constructor(options: TAppOptions) {
    this.initDom();
    const {canvasEl} = this;
    this.loadImages(options.pictures.sort((a, b) => a.zIndex - b.zIndex)).then((imgs) => {
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
    });
  }

  private initDom(): void {
    const canvasEl = document.getElementById('canvas');
    if (canvasEl instanceof HTMLCanvasElement) {
      this.canvasEl = canvasEl;
      this.ctx = canvasEl.getContext('2d');
    }
    const canvasTmp = document.createElement('canvas');
    this.ctxTmp = canvasTmp.getContext('2d');
  }

  private loadImages(pictures: TAppOptionsPicture[]): Promise<Array<TAppPicture>> {
    const promises: Array<Promise<TAppPicture>> = pictures.map(data => new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute('crossOrigin', '');
      img.onload = () => {
        resolve({
          ...data,
          img,
        });
      };
      img.onerror = (error) => {
        reject(error);
      };
      img.src = data.path;
    }));
    return Promise.all(promises);
  }

  private render() {
    const {ctx} = this;
    ctx.clearRect(0, 0, 2000, 2000);
    this.pictures.forEach(picture => {
      picture.draw();
    });
  }
}

new App({
  pictures: [
    {
      path: img2,
      startX: 5,
      startY: 120,
      width: 155,
      height: 310,
      topRightOffset: -22,
      bottomRightOffset: -10,
      borderColor: '#640AD2',
      zIndex: 40,
    },
    {
      path: img3,
      startX: 160,
      startY: 245,
      width: 185,
      height: 128,
      topRightOffset: -20,
      bottomRightOffset: -5,
      borderColor: '#C800C8',
      zIndex: 10,
    },
    {
      path: img5,
      startX: 340,
      startY: 215,
      width: 20,
      height: 175,
      topRightOffset: -2,
      bottomRightOffset: -2,
      borderColor: '#640AD2',
      zIndex: 20,
    },
    {
      path: img7,
      startX: 360,
      startY: 105,
      width: 100,
      height: 305,
      topRightOffset: 5,
      bottomRightOffset: -2,
      borderColor: '#C800C8',
      zIndex: 50,
    },
    {
      path: img10,
      startX: 460,
      startY: 230,
      width: 195,
      height: 150,
      topRightOffset: 40,
      bottomRightOffset: 20,
      borderColor: '#640AD2',
      zIndex: 30,
    },
    {
      path: img9,
      startX: 650,
      startY: 105,
      width: 465,
      height: 310,
      topRightOffset: 100,
      bottomRightOffset: 50,
      borderColor: '#C800C8',
      zIndex: 60,
    },
  ]
});

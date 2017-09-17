import {ExhibitionInteractiveGallery} from '../lib/index';

const img1 = 'assets/img/Andor Becskei.jpg';
const img2 = 'assets/img/Andres Agosin.jpg';
const img3 = 'assets/img/baku maeda.jpg';
const img4 = 'assets/img/geoff mcfetridge 2.jpg';
const img5 = 'assets/img/isabelle JOUBERT 2.JPG';
const img6 = 'assets/img/James Roper.jpg';

new ExhibitionInteractiveGallery({
  canvasEl: document.getElementById('canvas') as HTMLCanvasElement,
  pictures: [
    {
      path: img1,
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
      path: img2,
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
      path: img3,
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
      path: img4,
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
      path: img6,
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
      path: img5,
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

export {ExhibitionInteractiveGallery};

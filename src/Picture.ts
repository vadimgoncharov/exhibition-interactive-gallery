import drawImageInPerspective from './drawImageInPerspective';
import Point from './Point';

import IPictureOptions from './IPictureOptions';

export default class Picture {
  private image: HTMLImageElement;
  private canvas: HTMLCanvasElement;
  private original: {
    topLeft: Point;
    topRight: Point;
    bottomLeft: Point;
    bottomRight: Point;
  };
  private reflection: {
    topLeft: Point;
    topRight: Point;
    bottomLeft: Point;
    bottomRight: Point;
  };
  private options: IPictureOptions;

  constructor(options: IPictureOptions) {
    this.options = options;
    this.calculateValuesFromOptions();
  }

  private calculateValuesFromOptions() {
    const {startX, startY, width, height, topRightOffset, bottomRightOffset} = this.options;

    this.original = {
      topLeft: new Point(startX, startY),
      topRight: new Point(startX + width, startY - topRightOffset),
      bottomRight: new Point(startX + width, startY + height + bottomRightOffset),
      bottomLeft: new Point(startX, startY + height),
    };
    this.reflection = {
      topLeft: new Point(startX, startY - bottomRightOffset + height + bottomRightOffset),
      topRight: new Point(startX + width, startY + height + bottomRightOffset),
      bottomRight: new Point(startX + width, startY + height + height + bottomRightOffset),
      bottomLeft: new Point(startX, startY + height + height - bottomRightOffset - topRightOffset),
    };
  }

  private drawOriginalImage() {
    const {image, canvas} = this.options;
    const data = this.original;
    drawImageInPerspective(
      image,
      canvas,
      data.topLeft.x, data.topLeft.y,
      data.bottomLeft.x, data.bottomLeft.y,
      data.topRight.x, data.topRight.y,
      data.bottomRight.x, data.bottomRight.y,
      false,
      false,
    );
  }

  private drawReflectionImage() {
    const {image, canvas} = this.options;
    const data = this.reflection;
    drawImageInPerspective(
      image,
      canvas,
      data.topLeft.x, data.topLeft.y,
      data.bottomLeft.x, data.bottomLeft.y,
      data.topRight.x, data.topRight.y,
      data.bottomRight.x, data.bottomRight.y,
      false,
      true,
    );
  }

  private drawReflectionImageGradient() {
    const {canvas} = this.options;
    const data = this.reflection;
    const ctx = canvas.getContext('2d');

    ctx.save();

    const gradient = ctx.createLinearGradient(
      data.topLeft.x, data.topLeft.y,
      data.topLeft.x, data.bottomRight.y,
    );

    gradient.addColorStop(0,'rgba(0,0,0,0.4)');
    gradient.addColorStop(0.2,'rgba(0,0,0,0.8)');
    gradient.addColorStop(0.8,'rgba(0,0,0,1)');

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(data.topLeft.x, data.topLeft.y); // top left
    ctx.lineTo(data.topRight.x, data.topRight.y); // top right
    ctx.lineTo(data.bottomRight.x, data.bottomRight.y + 1); // bottom right
    ctx.lineTo(data.bottomLeft.x, data.bottomLeft.y + 1); // bottom left
    ctx.lineTo(data.topLeft.x, data.topLeft.y); // top left
    ctx.fill();
    ctx.closePath();

    ctx.restore();
  }

  private drawOriginalImageBorder() {
    const {canvas, borderColor, borderWidth} = this.options;
    const data = this.original;
    const ctx = canvas.getContext('2d');

    ctx.save();

    ctx.strokeStyle = borderColor;
    ctx.lineWidth = typeof borderWidth === 'number' ? borderWidth : 5;

    ctx.beginPath();
    ctx.moveTo(data.topLeft.x, data.topLeft.y); // top left
    ctx.lineTo(data.topRight.x, data.topRight.y); // top right
    ctx.lineTo(data.bottomRight.x, data.bottomRight.y); // bottom right
    ctx.lineTo(data.bottomLeft.x, data.bottomLeft.y); // bottom left
    ctx.lineTo(data.topLeft.x, data.topLeft.y); // top left
    ctx.stroke();
    ctx.closePath();

    ctx.restore();
  }

  public draw() {
    this.drawOriginalImage();
    this.drawReflectionImage();
    this.drawReflectionImageGradient();
    this.drawOriginalImageBorder();
  }
}

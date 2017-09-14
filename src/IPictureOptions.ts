export default interface IPictureOptions {
  image: HTMLImageElement;
  canvas: HTMLCanvasElement;
  startX: number,
  startY: number,
  width: number,
  height: number,
  topRightOffset: number,
  bottomRightOffset: number,
  borderColor: string,
  borderWidth?: number,
};


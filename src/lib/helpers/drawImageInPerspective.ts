// @See https://stackoverflow.com/a/37236664/7605833

const tmpCanvas: HTMLCanvasElement = document.createElement('canvas');
const tmpContext = tmpCanvas.getContext('2d');

function drawImageInPerspective(
  srcImg: HTMLImageElement,
  targetCanvas: HTMLCanvasElement,
  //Define where on the canvas the image should be drawn:
  //coordinates of the 4 corners of the quadrilateral that the original rectangular image will be transformed onto:
  topLeftX: number,
  topLeftY: number,
  bottomLeftX: number,
  bottomLeftY: number,
  topRightX: number,
  topRightY: number,
  bottomRightX: number,
  bottomRightY: number,
  //optionally flip the original image horizontally or vertically *before* transforming the original rectangular image to the custom quadrilateral:
  flipHorizontally: boolean,
  flipVertically: boolean
): void {

  const srcWidth=srcImg.naturalWidth;
  const srcHeight=srcImg.naturalHeight;

  const targetMarginX=Math.min(topLeftX, bottomLeftX, topRightX, bottomRightX);
  const targetMarginY=Math.min(topLeftY, bottomLeftY, topRightY, bottomRightY);

  const targetTopWidth=(topRightX-topLeftX);
  const targetTopOffset=topLeftX-targetMarginX;
  const targetBottomWidth=(bottomRightX-bottomLeftX);
  const targetBottomOffset=bottomLeftX-targetMarginX;

  const targetLeftHeight=(bottomLeftY-topLeftY);
  const targetLeftOffset=topLeftY-targetMarginY;
  const targetRightHeight=(bottomRightY-topRightY);
  const targetRightOffset=topRightY-targetMarginY;

  const tmpWidth=Math.max(targetTopWidth+targetTopOffset, targetBottomWidth+targetBottomOffset);
  const tmpHeight=Math.max(targetLeftHeight+targetLeftOffset, targetRightHeight+targetRightOffset);

  tmpContext.clearRect(0, 0, tmpCanvas.width, tmpCanvas.height);
  tmpCanvas.width=tmpWidth;
  tmpCanvas.height=tmpHeight;

  tmpContext.translate(
    flipHorizontally ? tmpWidth : 0,
    flipVertically ? tmpHeight : 0
  );
  tmpContext.scale(
    (flipHorizontally ? -1 : 1)*(tmpWidth/srcWidth),
    (flipVertically? -1 : 1)*(tmpHeight/srcHeight)
  );

  tmpContext.drawImage(srcImg, 0, 0);

  const tmpMap=tmpContext.getImageData(0,0,tmpWidth,tmpHeight);
  const tmpImgData=tmpMap.data;

  const targetContext=targetCanvas.getContext('2d');
  const targetMap = targetContext.getImageData(targetMarginX,targetMarginY,tmpWidth,tmpHeight);
  const targetImgData = targetMap.data;

  let targetX,targetY, tmpPoint, targetPoint;

  for(let tmpY = 0; tmpY < tmpHeight; tmpY++) {
    for(let tmpX = 0;  tmpX < tmpWidth; tmpX++) {

      //Index in the context.getImageData(...).data array.
      //This array is a one-dimensional array which reserves 4 values for each pixel [red,green,blue,alpha) stores all points in a single dimension, pixel after pixel, row after row:
      tmpPoint=(tmpY*tmpWidth+tmpX)*4;

      //calculate the coordinates of the point on the skewed image.
      //
      //Take the X coordinate of the original point and translate it onto target (skewed) coordinate:
      //Calculate how big a % of srcWidth (unskewed x) tmpX is, then get the average this % of (skewed) targetTopWidth and targetBottomWidth, weighting the two using the point's Y coordinate, and taking the skewed offset into consideration (how far topLeft and bottomLeft of the transformation trapezium are from 0).
      targetX=(
          targetTopOffset
          +targetTopWidth * tmpX/tmpWidth
        )
        * (1- tmpY/tmpHeight)
        + (
          targetBottomOffset
          +targetBottomWidth * tmpX/tmpWidth
        )
        * (tmpY/tmpHeight)
      ;
      targetX=Math.round(targetX);

      //Take the Y coordinate of the original point and translate it onto target (skewed) coordinate:
      targetY=(
          targetLeftOffset
          +targetLeftHeight * tmpY/tmpHeight
        )
        * (1-tmpX/tmpWidth)
        + (
          targetRightOffset
          +targetRightHeight * tmpY/tmpHeight
        )
        * (tmpX/tmpWidth)
      ;
      targetY=Math.round(targetY);

      targetPoint=(targetY*tmpWidth+targetX)*4;

      targetImgData[targetPoint]=tmpImgData[tmpPoint];  //red
      targetImgData[targetPoint+1]=tmpImgData[tmpPoint+1]; //green
      targetImgData[targetPoint+2]=tmpImgData[tmpPoint+2]; //blue
      targetImgData[targetPoint+3]=tmpImgData[tmpPoint+3]; //alpha
    }
  }

  targetContext.putImageData(targetMap,targetMarginX,targetMarginY);
}

export default drawImageInPerspective;

interface Options {
  naturalWidth: number;
  naturalHeight: number;
  containerWidth?: number;
  containerHeight?: number;
  rotate: number; // 旋转的角度
}

interface SizeResult {
  width: number;
  height: number;
  x: number;
  y: number;
  scale: number;
}

export default function getImageSize(options: Options): SizeResult {
  const {
    naturalWidth,
    naturalHeight,
    containerWidth,
    containerHeight,
    rotate,
  } = options;

  let width;
  let height;
  let x = 0;
  let y = 0;
  let innerWidth = containerWidth || window.innerWidth
  let innerHeight = containerHeight || window.innerHeight
  const isVertical = rotate % 180 !== 0;

  // 若图片不是水平则调换宽高
  if (isVertical) {
    [innerHeight, innerWidth] = [innerWidth, innerHeight];
  }

  const autoWidth = innerHeight * naturalWidth / naturalHeight;
  const autoHeight = innerWidth * naturalHeight / naturalWidth;

  if (naturalWidth < innerWidth && naturalHeight < innerHeight) {
    width = naturalWidth;
    height = naturalHeight;
  } else if (naturalWidth < innerWidth && naturalHeight >= innerHeight) {
    width = autoWidth;
    height = innerHeight;
  } else if (naturalWidth >= innerWidth && naturalHeight < innerHeight) {
    width = innerWidth;
    height = autoHeight;
  } else if (naturalWidth / naturalHeight > innerWidth / innerHeight) {
    width = innerWidth;
    height = autoHeight;
  } else {
    width = autoWidth;
    height = autoWidth * naturalHeight / naturalWidth;;
  }

  x = (innerWidth - width) / 2
  y = (innerHeight - height) / 2

  if (isVertical) {
    [y, x] = [x, y];
    x += (height - width) / 2
    y += (width - height) / 2
  }

  return {
    width: Math.floor(width),
    height: Math.floor(height),
    // x: 0,
    // y,
    x,
    y,
    scale: 1,
  };
}

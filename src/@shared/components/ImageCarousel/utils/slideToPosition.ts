/**
 * 滑动加速度
 */
const slideAcceleration: number = 0.005;
const maxTouchTime: number = 200;

export enum CloseEdgeEnum {
  Normal, // 正常滑动
  Small, // 小于屏幕宽度
  Before, // 抵触左边/上边
  After, // 抵触右边/下边
}

/**
 * 接触左边/上边 或 右边/下边边缘
 * @param position - x/y
 * @param scale
 * @param size - width/height
 * @param innerSize - innerWidth/innerHeight
 * @return CloseEdgeEnum
 */
 export function getClosedEdge(position: number, scale: number, size: number, innerSize: number): CloseEdgeEnum {
  const currentWidth = size * scale;
  // 图片超出的宽度
  const outOffsetX = (currentWidth - innerSize) / 2;
  if (currentWidth <= innerSize) {
    return CloseEdgeEnum.Small;
  } else if (position > 0 && outOffsetX - position <= 0) {
    return CloseEdgeEnum.Before;
  } else if (position < 0 && outOffsetX + position <= 0) {
    return CloseEdgeEnum.After;
  }
  return CloseEdgeEnum.Normal;
}

/**
 * 适应到合适的图片偏移量
 */
export default function slideToPosition({
  x,
  y,
  lastX,
  lastY,
  width,
  height,
  containerWidth,
  containerHeight,
  scale,
  rotate,
  touchedTime,
}: {
  x: number;
  y: number;
  lastX: number;
  lastY: number;
  width: number;
  height: number;
  scale: number;
  rotate: number;
  touchedTime: number;
  containerWidth: number;
  containerHeight: number;
}): {
  x: number;
  y: number;
} {
  const moveTime = Date.now() - touchedTime;

  // 初始速度
  const speedX = (x - lastX) / moveTime;
  const speedY = (y - lastY) / moveTime;

  // 停下所消耗时间
  const slideTimeX = Math.abs(speedX / slideAcceleration);
  const slideTimeY = Math.abs(speedY / slideAcceleration);

  // 计划滑动位置
  let planX = Math.floor(x + speedX * slideTimeX);
  let planY = Math.floor(y + speedY * slideTimeY);

  // 若图片不是水平则调换属性
  if (rotate % 180 !== 0) {
    [width, height] = [height, width];
  }

  let currentX = planX;
  let currentY = planY;

  let innerWidth = containerWidth;
  let innerHeight = containerHeight;

  const isVertical = rotate % 180 !== 0;

  let offsetX = (width - innerWidth) / 2;
  let offsetY = (height - innerHeight) / 2;

  if (isVertical) {
    offsetX = (height - innerWidth) / 2;
    offsetY = (width - innerHeight) / 2;
  }

  // 图片超出的长度
  const outOffsetX = (width * scale - innerWidth) / 2;
  const outOffsetY = (height * scale - innerHeight) / 2;

  const horizontalCloseEdge = getClosedEdge(planX, scale, width, innerWidth);
  const verticalCloseEdge = getClosedEdge(planY, scale, height, innerHeight);

  // x
  if (horizontalCloseEdge === CloseEdgeEnum.Small) {
    currentX = (innerWidth - width) / 2;
    if (isVertical) {
      currentX = (innerWidth - height) / 2;
    }
  } else if (horizontalCloseEdge === CloseEdgeEnum.Before) {
    currentX = outOffsetX - offsetX;
  } else if (horizontalCloseEdge === CloseEdgeEnum.After) {
    currentX = -outOffsetX - offsetX;
  }

  // y
  if (verticalCloseEdge === CloseEdgeEnum.Small) {
    currentY = (innerHeight - height) / 2
    if (isVertical) {
      currentY = (innerHeight - width) / 2;
    }
  } else if (verticalCloseEdge === CloseEdgeEnum.Before) {
    currentY = outOffsetY - offsetY;
  } else if (verticalCloseEdge === CloseEdgeEnum.After) {
    currentY = -outOffsetY - offsetY;
  }

  // 时间过长
  if (
    moveTime >= maxTouchTime &&
    horizontalCloseEdge === CloseEdgeEnum.Normal &&
    verticalCloseEdge === CloseEdgeEnum.Normal
  ) {
    return {
      x,
      y,
    };
  }
  return {
    x: currentX,
    y: currentY,
  };
}

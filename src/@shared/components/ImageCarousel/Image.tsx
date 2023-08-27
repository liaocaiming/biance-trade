import * as React from 'react';
import classNames from 'classnames';
import throttle from 'lodash/throttle'
import getImageSize from './utils/getImageSize';
import slideToPosition from './utils/slideToPosition';
import getPositionOnMoveOrScale from './utils/getPositionOnMoveOrScale';

interface IProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  rotate: number;
  isActive: boolean;
  enableScale: boolean;
  enableDrag?: boolean;
  isEditMode?: boolean;
  isVertical?: boolean;

  containerWidth?: number;
  containerHeight?: number;
  container: any;

  setCanvasRef?: (canvas: HTMLCanvasElement) => void;
  onLoaded: () => void;
}

interface IState {
  loaded: boolean;

  naturalWidth: number;
  naturalHeight: number;
  width: number;
  height: number;
  x: number;
  y: number;
  scale: number;

  // 图片处于触摸的状态
  touched: boolean;
  clientX: number;
  clientY: number;
  lastMoveClientX: number;
  lastMoveClientY: number;
  lastX: number;
  lastY: number;
  touchedTime: number;
}

const MAX_SCALE = 3;
const MIN_SCALE = 1;

export default class Photo extends React.Component<IProps, IState> {

  static defaultProps = {
    enableDrag: true
  }

  imageRef: any;

  constructor(props: IProps) {
    super(props);

    // @ts-ignore
    this.onMove = throttle(this.onMove, 8);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleMouseUp);

    this.state = {
      loaded: false,

      naturalWidth: 0,
      naturalHeight: 0,
      scale: 1,
      width: 0,
      height: 0,
      x: 0,
      y: 0,
      touched: false,
      clientX: 0,
      clientY: 0,
      lastMoveClientX: 0,
      lastMoveClientY: 0,
      lastX: 0,
      lastY: 0,
      touchedTime: 0,
    }

    this.imageRef = React.createRef();
  }

  public UNSAFE_componentWillReceiveProps(nextProps: IProps) {
    const { containerWidth, containerHeight } = this.props;
    const { loaded, naturalWidth, naturalHeight, scale, x, y } = this.state;
    if (this.props.src !== nextProps.src) {
      this.setState({
        loaded: false
      })
    }

    if (this.props.rotate !== nextProps.rotate && loaded) {
      const sizeResult = getImageSize({
        naturalWidth,
        naturalHeight,
        containerWidth,
        containerHeight,
        rotate: nextProps.rotate
      });

      this.setState({
        ...sizeResult,
        scale,
      })
    }

    // 处理编辑模式的旋转
    // 编辑模式下，不会对 canvas 进行旋转操作，减少绘制的复杂性
    // 只需将 canvas 的宽高进行调换计算即可
    if (this.props.isEditMode !== nextProps.isEditMode && nextProps.isEditMode) {
      const isVertical = nextProps.isVertical;
      const sizeResult = getImageSize({
        naturalWidth: isVertical ? naturalHeight : naturalWidth,
        naturalHeight: isVertical ? naturalWidth : naturalHeight,
        containerWidth,
        containerHeight,
        rotate: isVertical ? 0 : nextProps.rotate
      });

      this.setState({
        ...sizeResult,
        x,
        y,
        scale,
      })
    }
  }

  handleImageLoaded = (e: any) => {
    console.log('handleImageLoaded')
    if (this.state.loaded) return;

    const { containerWidth, containerHeight, rotate, onLoaded } = this.props;
    const { naturalWidth, naturalHeight } = e.target;

    const sizeResult = getImageSize({
      naturalWidth,
      naturalHeight,
      containerWidth,
      containerHeight,
      rotate
    });

    const {
      width,
      height,
      x,
      y,
      scale,
    } = sizeResult


    this.setState({
      loaded: true,
      naturalWidth,
      naturalHeight,
      width,
      height,
      x,
      y,
      scale,
    })

    onLoaded && onLoaded();
  }

  initScaleAndPostition = () => {
    const { containerWidth, containerHeight, rotate } = this.props;
    const { naturalWidth, naturalHeight } = this.state;

    const { x, y } = getImageSize({
      naturalWidth,
      naturalHeight,
      containerWidth,
      containerHeight,
      rotate,
    });

    this.setState({
      x,
      y,
      scale: 1,
    })
  }

  getImageObj () {
    return this.imageRef.current;
  }


  handleWheel = (e: any) => {
    const { containerWidth, containerHeight, container } = this.props;
    const { x, y, naturalWidth, scale, width, height } = this.state;
    const { clientX, clientY, deltaY } = e;

    const endScale = scale - deltaY / 100 / 2;
    const toScale = Math.max(Math.min(endScale, Math.max(MAX_SCALE, naturalWidth / width)), MIN_SCALE);

    const { left, top } = container.getBoundingClientRect();
    const offestX = left - (containerWidth! - width) / 2
    const offestY = top - (containerHeight! - height) / 2

    const position = getPositionOnMoveOrScale({
      x,
      y,
      clientX: clientX - offestX,
      clientY: clientY - offestY,
      fromScale: scale,
      toScale,
      containerWidth,
      containerHeight
    });


    this.setState({
      scale: toScale,
      x: position.x,
      y: position.y,
      clientX,
      clientY,
    })
  }

  handleMouseMove = (e: any) => {
    e.preventDefault();
    this.onMove(e.clientX, e.clientY);
  };

  onMove = (newClientX: number, newClientY: number) => {
    const {
      touched,
      x,
      y,
      lastMoveClientX,
      lastMoveClientY,

      scale,
    } = this.state;

    const { rotate = 0 } = this.props;

    if (touched) {
      let { width, height } = this.state;

      if (rotate % 180 !== 0) {
        [width, height] = [height, width];
      }
      let offsetX = newClientX - lastMoveClientX;
      let offsetY = newClientY - lastMoveClientY;

      this.setState({
        ...getPositionOnMoveOrScale({
          x,
          y,
          clientX: newClientX,
          clientY: newClientY,
          offsetX,
          offsetY,
          fromScale: scale,
          toScale: scale,
        }),
      });
    }
  }

  handleMouseDown = (e: any) => {
    e.preventDefault();
    this.handleStart(e.clientX, e.clientY);
  };

  handleMouseUp = () => {
    this.handleUp();
  };

  handleUp = () => {
    const {
      touched,
      lastX,
      lastY,
      x,
      y,
      width,
      height,
      scale,
      touchedTime,
    } = this.state;
    const {
      containerWidth,
      containerHeight,
      rotate,
    } = this.props;

    if (touched) {
      this.setState({
        touched: false,
        ...slideToPosition({
          x,
          y,
          lastX,
          lastY,
          width,
          height,
          containerWidth: containerWidth!,
          containerHeight: containerHeight!,
          scale,
          rotate,
          touchedTime,
        })
      })
    }
  }

  handleStart = (clientX: number, clientY: number) => {
    this.setState(prevState => ({
      touched: true,
      clientX,
      clientY,
      lastMoveClientX: clientX,
      lastMoveClientY: clientY,
      lastX: prevState.x,
      lastY: prevState.y,
      touchedTime: Date.now(),
    }));
  };

  setCanvasRef = (element: any) => {
    const { setCanvasRef } = this.props;
    setCanvasRef && setCanvasRef(element)
  }

  public render() {
    const { x, y, scale, touched, width, height } = this.state;
    const { src, rotate, enableScale, isEditMode, enableDrag } = this.props;

    const transform = `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${rotate}deg)`;
    const imgClass = classNames({
      grabbing: enableScale  && scale > 1 && touched,
      grab: enableScale && scale > 1
    })

    const commonProps = {
      onWheel: enableScale ? this.handleWheel : undefined,
      onMouseDown: enableScale && enableDrag ? this.handleMouseDown : undefined,
      width,
      height,
      style: {
        transform,
        transition: touched ? undefined : 'transform 0.5s cubic-bezier(0.25, 0.8, 0.25, 1)',
      }
    }

    if (isEditMode) {
      return (
        <canvas
          ref={this.setCanvasRef}
          { ...commonProps }
        />
      )
    }

    return (
      <img
        { ...commonProps }

        ref={this.imageRef}
        className={imgClass}
        crossOrigin="anonymous"
        src={src}
        onLoad={this.handleImageLoaded}
        alt=""
      />
    );
  }
}

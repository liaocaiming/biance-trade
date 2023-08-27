import * as React from 'react';

import { LeftOutlined, RotateRightOutlined, RightOutlined, CloudDownloadOutlined, EditOutlined, LoadingOutlined } from '@ant-design/icons';

import { Carousel } from 'antd';

import isEqual from 'lodash/isEqual';

import Toggle from '../Toggle';

import Image from './Image';
import ImageDrawPane from '../ImageDrawPane';
import { ImageData } from "./index.d";

import './index.less';

/**
 * canvas to blob 的  polyfill
 * 解决低版本 Chrome 50 以下不能保存图片的 bug
 */
require('blueimp-canvas-to-blob');

interface IProps {
  /**
   * 图片 url 列表
   */
  images: string[];
  /**
   * 原始图片 url 列表，用于还原编辑前图片
   */
  originImages?: string[];
  /**
   * 容器宽度
   */
  width: number;
  /**
   * 容器高度
   */
  height: number;
  /**
   * 轮播顶部的自定义操作栏
   */
  toolBarAfterDom?: JSX.Element;
  /**
   * 允许旋转
   * @default true
   */
  enableRorate: boolean;
  /**
   * 允许进行图片缩放
   * @default false
   */
  enableScale: boolean;
  /**
   * 允许下载图片
   * @default false
   */
  enableDownload: boolean;
  /**
   * 允许编辑图片
   * @default false
   */
  enableDrawImage: boolean;
  /**
   * 是否展示上一张/下一张的切换箭头
   * @default true
   */
  showArrowIcon: boolean;
  /**
   * 编辑保存完成后的回调
   */
  onDrawFinish?: (options: { beforeUrl: string; afterUrl: string; beforeUrls: string[], afterUrls: string[], drawCount: number }) => void
  /**
   * 组件初始化后的回调
   * @param imageCarousel 轮播组件的实例对象
   */
  onReady?(imageCarousel: ImageCarousel): void;
}

interface IState {
  imageDataList: ImageData[];
  currentActiveIndex: number;
  isOpenImageDrawPane: boolean;
  currentRotateDeg: number;
  loading: boolean;
  enableReset: boolean;
  canvas: HTMLCanvasElement | null;
  drawType: string;
  updateFlag: number;
}

export default class ImageCarousel extends React.Component<IProps, IState> {

  public carousel: any = 'carousel';

  carouselRef: any;

  imageCarouselRef: any;

  imageObj: any;

  imageLoadMap: any = {};

  static defaultProps = {
    enableRorate: true,
    enableScale: false,
    enableDownload: false,
    enableDrawImage: false,
    showArrowIcon: true,
  }

  constructor(props: IProps) {
    super(props);
    this.state = {
      imageDataList: [],
      currentRotateDeg: 0,
      isOpenImageDrawPane: false,
      currentActiveIndex: 0,
      loading: false,
      enableReset: false,
      canvas: null,
      drawType: '',
      updateFlag: 0,
    };
    this.carouselRef = React.createRef();
    this.imageCarouselRef = React.createRef();
  }

  setupImageData(images: string[], originImages?: string[]) {
    const enableResetImage = originImages && originImages.length > 0;

    const imageDataList = images.map((img, index) => ({
      src: img,
      rotate: 0,
      ref: React.createRef(),
      originImage: enableResetImage ? originImages![index] || img : null
    }))
    this.setState({
      imageDataList,
      isOpenImageDrawPane: false,
      enableReset: !!enableResetImage,
    })
  }

  public componentDidMount() {
    this.setupImageData(this.props.images, this.props.originImages);
    this.initScrollEvent();

    const { onReady } = this.props;
    onReady && onReady(this);
  }

  public UNSAFE_componentWillReceiveProps(nextProps: IProps) {
    if (!isEqual(this.props.images, nextProps.images)) {
      this.setupImageData(nextProps.images, nextProps.originImages);
    }
    if (!isEqual(this.props.originImages, nextProps.originImages)) {
      this.setupImageData(nextProps.images, nextProps.originImages);
    }
  }

  reset() {
    this.setupImageData(this.props.images, this.props.originImages);
    if (this.carouselRef && this.carouselRef.current) {
      this.carouselRef.current.goTo(0);
    }
  }

  isEditMode() {
    return this.state.isOpenImageDrawPane;
  }

  initScrollEvent = () => {
    if (this.imageCarouselRef.current) {
      const wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
      let supportsPassive = false;
      try {
        // @ts-ignore
        window.addEventListener("test", null, Object.defineProperty({}, 'passive', {
          get () { supportsPassive = true; }
        }));
      } catch(e) {}

      const wheelOpt = supportsPassive ? { passive: false } : false;
      this.imageCarouselRef.current.addEventListener(wheelEvent, (e: any) => e.preventDefault(), wheelOpt);
    }
  }

  public prev = () => {
    if (this.carouselRef && this.carouselRef.current) {
      this.carouselRef.current.prev();
    }
  };

  public next = () => {
    if (this.carouselRef && this.carouselRef.current) {
      this.carouselRef.current.next();
    }
  };

  public goTo = (index: number) => {
    if (this.carouselRef && this.carouselRef.current) {
      this.carouselRef.current.goTo(index);
    }
  }

  public downloadImage = () => {
    const { currentActiveIndex, imageDataList } = this.state;
    imageDataList[currentActiveIndex].rotate += 90;
    const url = imageDataList[currentActiveIndex].src;
    const image = new window.Image();
    // 解决跨域 Canvas 污染问题
    image.setAttribute("crossOrigin", "anonymous");
    image.onload = function () {
      const canvas: HTMLCanvasElement = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext("2d");
      context && context.drawImage(image, 0, 0, image.width, image.height);
      const imgSrc = canvas.toDataURL("image/png"); // 得到图片的base64编码数据
      const a = document.createElement("a"); // 生成一个a元素
      const event = new MouseEvent("click"); // 创建一个单击事件
      a.download = "photo"; // 设置图片名称
      a.href = imgSrc; // 将生成的URL设置为a.href属性
      a.dispatchEvent(event); // 触发a的单击事件
      // a.click();
    };
    image.src = url;
  }

  renderImage(image: ImageData, index: number) {
    const { width, height, enableScale } = this.props;
    const { currentActiveIndex, drawType } = this.state;

    const isEditMode = this.isEditMode() && currentActiveIndex === index;
    const enableDrag = isEditMode ? !drawType : true;

    return <div className="image-carousel__image-container" style={{ width, height }}>
      <Image
        ref={image.ref}
        src={image.src}
        enableScale={enableScale}
        enableDrag={enableDrag}
        isActive={currentActiveIndex === index}
        isVertical={image.rotate % 180 !== 0}
        rotate={isEditMode ? 0 : image.rotate}
        containerWidth={width}
        containerHeight={height}
        container={this.imageCarouselRef.current}
        onLoaded={() => this.handleImageLoadFinish(image)}
        isEditMode={this.isEditMode() && currentActiveIndex === index}
        setCanvasRef={() => {
          this.setState({
            canvas: document.querySelector('.slick-current canvas')
          })
        }}
      />
    </div>
  }

  handleImageLoadFinish = (image: ImageData) => {
    this.imageLoadMap[image.src] = true;
    this.setState({
      updateFlag: Math.random(),
    })
  }

  handleChange = (current: number) => {
    this.setState({
      currentActiveIndex: current,
    })
  }

  rotateImage = () => {
    const { currentActiveIndex, imageDataList } = this.state;
    imageDataList[currentActiveIndex].rotate += 90;
    this.setState({
      imageDataList,
    })
  }

  openDrawPane = () => {
    const { imageDataList, currentActiveIndex } = this.state;
    const currentImageData = imageDataList[currentActiveIndex];

    if (currentImageData && currentImageData.ref && currentImageData.ref.current) {
      const currentImage = currentImageData.ref.current;
      currentImage.initScaleAndPostition();
      this.imageObj = currentImage.getImageObj();
    }

    this.setState({
      isOpenImageDrawPane: true,
    })
  }

  handleDrawFinish = (afterUrl: string, beforeUrl: string, drawCount: number) => {
    const { imageDataList, currentActiveIndex } = this.state;
    const { onDrawFinish } = this.props;
    const beforeUrls = imageDataList.map(image => image.src);
    const afterUrls = [...beforeUrls];
    afterUrls[currentActiveIndex] = afterUrl;
    onDrawFinish && onDrawFinish({
      beforeUrl,
      afterUrl,
      beforeUrls,
      afterUrls,
      drawCount,
    })
    imageDataList[currentActiveIndex].src = afterUrl;
    imageDataList[currentActiveIndex].rotate = 0
    this.setState({
      imageDataList,
    })
  }

  handleDrawTypeChange = (drawType: string) => {
    console.log('drawType', drawType)
    this.setState({
      drawType,
    })
  }

  public render() {
    const { toolBarAfterDom, width, height, enableRorate, enableDownload, enableDrawImage, showArrowIcon } = this.props;
    const { imageDataList, currentActiveIndex, isOpenImageDrawPane, loading, enableReset, canvas } = this.state;
    const currentImageData = imageDataList[currentActiveIndex];
    const url = currentImageData ? currentImageData.src : '';
    const rotate = currentImageData ? currentImageData.rotate : 0;
    const isLoaded = currentImageData ? this.imageLoadMap[currentImageData.src] : false;

    return (
      <div className='carousel-container image-carousel' style={{ width, height }} ref={this.imageCarouselRef}>

        <Toggle isShow={!isOpenImageDrawPane && imageDataList.length > 0 && isLoaded}>

          <Toggle isShow={isLoaded}>
            <div className="image-carousel__toolbar">
              {enableRorate && <RotateRightOutlined title="旋转" onClick={this.rotateImage} />}
              {enableDownload && <CloudDownloadOutlined title="下载" onClick={this.downloadImage} />}
              {enableDrawImage && <EditOutlined title="在图上标记" onClick={this.openDrawPane} />}
              {toolBarAfterDom}
            </div>
          </Toggle>

          <Toggle isShow={showArrowIcon && !isOpenImageDrawPane}>
            <div className="image-carousel__action">
              <LeftOutlined className="left" onClick={this.prev} />
              <RightOutlined className="right" onClick={this.next} />
            </div>
          </Toggle>

        </Toggle>

        <Carousel ref={this.carouselRef} {...this.props} afterChange={this.handleChange} dots={!isOpenImageDrawPane}>
          {
            imageDataList.map((image, index) => this.renderImage(image, index))
          }
        </Carousel>

        <ImageDrawPane
          isOpen={isOpenImageDrawPane}
          url={url}
          imageObj={this.imageObj}
          imageData={currentImageData}
          onClose={() => this.setState({ isOpenImageDrawPane: false })}
          containerWidth={width}
          containerHeight={height}
          rotate={rotate}
          onChange={this.handleDrawFinish}
          loadingChange={(loading) => this.setState({ loading })}
          enableResetImage={enableReset}
          canvas={canvas}
          onDrawTypeChange={this.handleDrawTypeChange}
        />

        {loading && <div className="loading-wrapper">
          <LoadingOutlined />
        </div>}

      </div>
    );
  }
}

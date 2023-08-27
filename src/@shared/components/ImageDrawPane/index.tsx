import * as React from 'react';

import { CarouselProps } from 'antd/lib/carousel';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { createFromIconfontCN } from '@ant-design/icons';
import {post} from '@utils/lib/fetch';
import { HistoryOutlined } from '@ant-design/icons';

import Toggle from '../Toggle';

import './index.less';

import CanvasDrawTools from './CanvasDrawTools';
import getImageSize from '../ImageCarousel/utils/getImageSize';
import { getQiniuUploadConfig } from './uploadUtils';
import { ImageData } from '../ImageCarousel/index.d';


const MyIcon = createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_2426346_h87hh5kgzoe.js'
});

interface IProps extends CarouselProps {
  url?: string;
  onChange?: (afterUrl: string, beforeUrl: string, drawCount: number) => void;
  onClose?: () => void;
  isOpen?: boolean;
  containerWidth: number;
  containerHeight: number;
  rotate: number;
  imageObj: any;
  loadingChange: (loading: boolean) => void;
  enableResetImage?: boolean;
  imageData: ImageData;
  canvas?: HTMLCanvasElement | null;
  onDrawTypeChange?: (drawType: string) => void;
}

interface IState {
  currentDrawType: string;
  loading: boolean;
}

export default class ImageDrawPane extends React.Component<IProps, IState> {

  canvasRef: any;

  canvasDrawTools: any;

  originPhoto: any = null;

  constructor(props: IProps) {
    super(props);
    this.state = {
      currentDrawType: '',
      loading: false,
    };
    this.canvasRef = React.createRef();

    this.setupCanvas();
  }

  public UNSAFE_componentWillReceiveProps(nextProps: IProps) {
    if (this.props.canvas !== nextProps.canvas && nextProps.canvas) {
      setTimeout(() => {
        this.setupCanvas();
        this.changeDrawType('ellipse')
        this.originPhoto = null;
      }, 200)
    }
  }

  setupCanvas () {
    const { containerWidth, containerHeight, rotate } = this.props;
    const canvas = this.props.canvas;
    if (!canvas) return;
    var ctx: any = canvas.getContext('2d')

    const imageObj = this.originPhoto || this.props.imageObj;
    const { naturalWidth, naturalHeight } = imageObj;

    let { width, height } = getImageSize({
      naturalWidth,
      naturalHeight,
      containerWidth,
      containerHeight,
      rotate
    });

    ctx.save();
    ctx.translate(canvas.width/2,canvas.height/2);
    ctx.rotate(rotate*Math.PI/180);
    ctx.drawImage(imageObj, 0, 0, naturalWidth, naturalHeight, -(width/2), -(height/2), width, height)

    ctx.restore();
    this.canvasDrawTools = new CanvasDrawTools(canvas, {
      width,
      height,
      containerWidth,
      containerHeight,
      rotate,
    });
  }

  handleSave = async () => {
    const { onClose, onChange, loadingChange } = this.props;
    const { canvas, drawCount } = await this.canvasDrawTools.finish();
    if (drawCount === 0 && !this.originPhoto) {
      onClose && onClose();
      return;
    }
    this.setState({
      loading: true
    })
    loadingChange && loadingChange(true)

    canvas.toBlob(async (blob: any) => {

      getQiniuUploadConfig().then(res => {
        if (!res.domain || !res.token) {
          return;
        }

        post('upload/img', {
          file: blob,
          ...res,
        }).then((data: any) => {
          const { url } = data;
          onChange && onChange(url || '', this.props.url || '', drawCount);
          onClose && onClose();
          this.originPhoto = null;
          this.setState({
            loading: false,
          })
          this.changeDrawType('')

          loadingChange && loadingChange(false);
        });
      });

    });

  }

  handleCancel = () => {
    this.canvasDrawTools.cancel();
    this.changeDrawType('')
    const { onClose } = this.props;
    onClose && onClose();
    this.originPhoto = null;
  }

  handleUndo = () => {
    this.canvasDrawTools.undo();
  }

  startPos: any;

  rect: any;

  getPos = (event: any, rect: any) => {
    let x = event.pageX - rect.left
    let y = event.pageY - rect.top
    if (x <= 0) x = 0
    if (x >= rect.width) x = rect.width
    if (y <= 0) y = 0
    if (y >= rect.height) y = rect.height

    return {
      x,
      y
    }
  }

  handleMouseDown = (e: any) => {
    this.startPos = this.getPos(e, this.rect)
  }

  changeDrawType = (drawType: string) => {
    this.setState({
      currentDrawType: drawType === this.state.currentDrawType ? '' : drawType,
    }, () => {
      const { currentDrawType } = this.state;
      this.canvasDrawTools.changeDrawType(currentDrawType);

      if (currentDrawType) {
        const imagePositionData = this.props.imageData.ref.current.state;
        this.canvasDrawTools.setupCanvasPositionData(imagePositionData);
      }

      const { onDrawTypeChange } = this.props;
      onDrawTypeChange && onDrawTypeChange(currentDrawType)
    })
  }

  resetImage = () => {
    const { loadingChange, imageData } = this.props;
    loadingChange && loadingChange(true);

    const handleImageLoaded = () => {
      loadingChange && loadingChange(false);
      this.setupCanvas();
    }

    const handleImageBroken = () => {
      loadingChange && loadingChange(false);
      this.setupCanvas();
    }

    if (imageData.originImage) {
      const currPhoto = new Image();
      currPhoto.setAttribute("crossOrigin", "anonymous");
      currPhoto.onload = handleImageLoaded;
      currPhoto.onerror = handleImageBroken;
      currPhoto.src = imageData.originImage;
      this.originPhoto = currPhoto;
    }
  }

  public render() {
    const { currentDrawType } = this.state;
    const { isOpen, enableResetImage } = this.props;
    return (
      <Toggle isShow={isOpen}>

        <div className="imageDrawPane">
          {/* <canvas ref={this.canvasRef}  /> */}

          <div className="imageDrawPane__toolbar">
            <MyIcon type="icon-tuoyuanxing" className={currentDrawType == 'ellipse' ? 'active' : ''} onClick={() => this.changeDrawType('ellipse')} />
            <MyIcon type="icon-juxing" className={currentDrawType == 'rect' ? 'active' : ''} onClick={() => this.changeDrawType('rect')} />
            <MyIcon type="icon-weibiaoti545" onClick={this.handleUndo} />
            { enableResetImage && <HistoryOutlined title="还原图片" onClick={this.resetImage} /> }
            <div className="line"></div>
            <CheckOutlined onClick={this.handleSave} />
            <CloseOutlined onClick={this.handleCancel} />
          </div>
        </div>

      </Toggle>
    );
  }
}

import React, { useState, useEffect } from 'react';
import * as ReactDOM from 'react-dom';

import {
  CloseOutlined,
  LeftCircleOutlined,
  VerticalAlignBottomOutlined,
  RightCircleOutlined,
  RetweetOutlined,
  LinkOutlined,
  MinusCircleOutlined,
  PlusCircleOutlined
} from '@ant-design/icons';

import { Toggle } from '../index';

import { reactClassNameJoin } from '@utils/lib/helpers';

import { showImgOnNewTab, getUrl, downImg, getLen, getDom } from './util';

import './index.less';
interface UrlObj {
  url: string;
}

type Urls = string | string[] | UrlObj[];
interface IProps {
  urls: Urls;
  index?: number;
  goNext?: (url: string, index: number) => void;
  goPrev?: (url: string, index: number) => void;
  isShowDownloadButton?: boolean; // 是否显示下载按钮

}

let deg = 0;

let num = 0;

let  scale = 1;

const scaleStep = 0.05;

const clientHeight = document.body.clientHeight;

const rotateFn = () => {
  const imgDom: any = getDom();
  deg = deg + 90;
  imgDom.style.transform = `rotate(${deg}deg) scale(${scale})`;
  imgDom.style.transformOrigin = '50% 50%';
};

const scaleFn = (options: { type: 'large' | 'small',  setRandom: (num: number) => void; }) => {
  const { type, setRandom } = options;
  const imgDom: any = getDom();
  return () => {
    if (type === 'large') {
      if (scale >= 2) {
        return;
      }
      scale += scaleStep;
    }
    if (type === 'small') {
      if (scale <= scaleStep * 2) {
        return
      }
      scale -= scaleStep;
    }

    setRandom(Date.now());
    imgDom.style.transform = `rotate(${deg}deg) scale(${scale})`;
    imgDom.style.transformOrigin = '50% 50%';
  }

}

const resetRote = () => {
  deg = 0;
  scale = 1;
  const imgDom: any = document.getElementById('fe-img');
  imgDom.style.transform = `rotate(${0}deg) scale(${scale})`;
};

const goPrev = (options: { setImgSrc: (url: string) => void; setIdx: (idx: number) => void; props: IProps }) => {
  const { props, setImgSrc, setIdx } = options;
  const { goPrev, urls } = props;

  return () => {
    if (num <= 0) {
      return;
    }
    resetRote();
    setTimeout(() => {
      num = num - 1;
      setIdx(num);
      const url = getUrl(urls, num);
      setImgSrc(url);
      goPrev && goPrev(url, num);
    }, 0);
  };
};

const goNext = (options: { setImgSrc: (url: string) => void; setIdx: (idx: number) => void; props: IProps }) => {
  const { props, setImgSrc, setIdx } = options;
  const { goNext, urls } = props;
  return () => {
    if (num >= urls.length - 1) {
      return;
    }
    resetRote();
    setTimeout(() => {
      num = num + 1;
      setIdx(num);
      const url = getUrl(urls, num);
      setImgSrc(url);
      goNext && goNext(url, num);
    }, 0);
  };
};

export default (props: IProps) => {
  const mountNode: HTMLElement = document.createElement('div');
  document.body.appendChild(mountNode);

  const onClose = () => {
    if (mountNode) {
      ReactDOM.unmountComponentAtNode(mountNode);
    }
    document.body.removeChild(mountNode);
  };

  const App = (props: IProps) => {
    const { urls, index = 0, isShowDownloadButton } = props;
    const [imgSrc, setImgSrc] = useState('');
    const [idx, setIdx] = useState(0); // 记录选了第几张
    const [random, setRandom] = useState(0); // 用了更新页面, 判断是否要静止放大或者缩小;

    useEffect(() => {
      const url = getUrl(urls, index);
      num = index;
      setIdx(index);
      setImgSrc(url);
      console.log(random);
    }, [urls, index]);

    const header = () => {
      return (
        <div className="fe-image-header cursor">
          <CloseOutlined onClick={onClose} />
        </div>
      );
    };

    const footer = () => {
      return (
        <div className="fe-image-footer">
          <Toggle isShow={Array.isArray(urls) && urls.length > 1}>
            <LeftCircleOutlined
              className={reactClassNameJoin(['margin_right_20 cursor', idx <= 0 ? 'disabled' : ''])}
              onClick={goPrev({ setImgSrc, props, setIdx })}
            />
          </Toggle>
          <Toggle isShow={isShowDownloadButton}>
            <VerticalAlignBottomOutlined className="margin_right_20 cursor" onClick={downImg(imgSrc)} />
          </Toggle>
          <RetweetOutlined className="margin_right_20 cursor" onClick={rotateFn} />
          <LinkOutlined className="margin_right_20 cursor" onClick={showImgOnNewTab(imgSrc)} />

          <MinusCircleOutlined className={reactClassNameJoin(["margin_right_20 cursor", scale <= scaleStep * 2 ? 'disabled' : ''])}  onClick={scaleFn({ type: 'small', setRandom})}/>
          <PlusCircleOutlined className={reactClassNameJoin(["margin_right_20 cursor", scale >= 2 ? 'disabled' : ''])} onClick={scaleFn({ type: 'large', setRandom})}/>

          <Toggle isShow={Array.isArray(urls) && urls.length > 1}>
            <RightCircleOutlined
              className={reactClassNameJoin(['cursor margin_right_20', idx >= urls.length - 1 ? 'disabled' : ''])}
              onClick={goNext({ setImgSrc, props, setIdx })}
            />
          </Toggle>
          <span className ='fe-total'>{idx + 1}/ {getLen(urls)}</span>
        </div>
      );
    };

    return (
      <div className="fe-image-mask">
        {header()}
        <div className="fe-image-img">
          <img id="fe-img" src={imgSrc} style={{ maxHeight: clientHeight - 10, height: 'auto'}}/>
        </div>
        {footer()}
      </div>
    );
  };

  ReactDOM.render(<App {...props} />, mountNode);
};

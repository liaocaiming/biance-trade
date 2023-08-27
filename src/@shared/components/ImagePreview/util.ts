import { imgSrcFilter } from 'fezs-js';

interface UrlObj {
  url: string;
}

type Urls = string | string[] | UrlObj[];

const getUrl = (urls: Urls, index: number = 0): string => {
  if (Array.isArray(urls)) {
    const item = urls[index % urls.length];
    if (typeof item === 'string') {
      return item;
    }
    if (typeof item === 'object' && item.url) {
      return item.url;
    }
  }

  if (typeof urls === 'string') {
    return urls;
  }
  return '';
};


const downImg = (url: string, fileName?: string) => {
  return () => {
    const image = new Image();
    // 解决跨域 Canvas 污染问题
    image.setAttribute('crossOrigin', 'anonymous');
    image.onload = function() {
      const canvas: HTMLCanvasElement = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const context = canvas.getContext('2d');
      context && context.drawImage(image, 0, 0, image.width, image.height);
      const imgSrc = canvas.toDataURL('image/png'); //得到图片的base64编码数据
      const a = document.createElement('a'); // 生成一个a元素
      const event = new MouseEvent('click'); // 创建一个单击事件
      a.download = fileName || 'photo'; // 设置图片名称
      a.href = imgSrc; // 将生成的URL设置为a.href属性
      a.dispatchEvent(event); // 触发a的单击事件
      // a.click();
    };
    image.src = url;
  };
};

const showImgOnNewTab = (url:string) => {
  return () => {
    const a = document.createElement('a');
    a.target = '_blank',
    a.href = imgSrcFilter(url, 10000);
    a.click();
  }
}


const getLen = (url: Urls): number => {
  let len = 0
  if (typeof url === 'string') {
    len = 1
  }

  if (Array.isArray(url)) {
    len = url.length
  }
  return len
}


const getDom = () => {
  return document.getElementById('fe-img')
}


export {
  showImgOnNewTab,
  getUrl,
  downImg,
  getLen,
  getDom
}

---
title: ImageCarousel
group:
  path: /
nav:
  path: /racoon-pro
---

# ImageCarousel

支持放大缩小、旋转、下载、编辑、还原的图片轮播组件。

## 代码演示

### 经典例子
```jsx
import React, { useState } from 'react';
import { ImageCarousel } from 'racoon-pro';

export default () => {

  const [imageList, setImageList] = useState([
    'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    'https://pic3.zhimg.com/v2-53f365acc16201ef0248646a3caf55e1_1440w.jpg?source=172ae18b',
    'https://dss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3922290090,3177876335&fm=26&gp=0.jpg',
    'https://qn-cdn-pic.feng1.com/sign_order-20201210-55a25f4403054a720a3420a7ccd5b2c1?imageView2/2/w/10000',
  ]);

  const handleDrawFinish = (data) => {
    const { beforeUrls, afterUrls, drawCount } = data;
    console.log({
      beforeUrls,
      afterUrls,
      drawCount,
    });
    // 注意：需要重新设置图片数组的值
    setImageList(afterUrls)
  };

  return (
    <div>
      <ImageCarousel
        images={imageList}
        width={500}
        height={300}
        enableScale
        enableDrawImage
        onDrawFinish={handleDrawFinish}
      />
    </div>
  );
};
```

### 不允许编辑、缩放
```jsx
import React, { useState } from 'react';
import { ImageCarousel } from 'racoon-pro';

export default () => {

  const [imageList, setImageList] = useState([
    'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    'https://pic3.zhimg.com/v2-53f365acc16201ef0248646a3caf55e1_1440w.jpg?source=172ae18b',
  ]);

  const handleDrawFinish = (data) => {
    const { beforeUrls, afterUrls, drawCount } = data;
    console.log({
      beforeUrls,
      afterUrls,
      drawCount,
    });
    // 注意：需要重新设置图片数组的值
    setImageList(afterUrls)
  };

  return (
    <div>
      <ImageCarousel
        images={imageList}
        width={500}
        height={300}
        enableScale={false}
        onDrawFinish={handleDrawFinish}
      />
    </div>
  );
};
```

<API />

### onDrawFinish
回调参数说明
``` js | pure
{
  beforeUrl: '', // 绘画前的图片 URL
  afterUrl: '', // 绘画保存后的图片 URL
  beforeUrls: [], // 绘画前的图片 URL 数组
  afterUrls: [], // 绘画后的图片 URL 数组
  drawCount: 1, // 当前图片编辑绘画的次数，不会累加
}
```

## 方法
| 名称 | 描述 |
| --- | --- |
| reset() | 重新加载图片数据，且将轮播跳转至第一张 |
| isEditMode() | 是否处于编辑状态 |
| next() | 切换到下一面板 |
| prev() | 切换到上一面板 |

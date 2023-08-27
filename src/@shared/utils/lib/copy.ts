/**
 * 一键粘贴
 * @param  {String} id [需要粘贴的内容]
 * @param  {String} attr [需要 copy 的属性，默认是 innerText，主要用途例如赋值 a 标签上的 href 链接]
 *
 * range + selection
 *
 * 1.创建一个 range
 * 2.把内容放入 range
 * 3.把 range 放入 selection
 *
 * 注意：参数 attr 不能是自定义属性
 * 注意：对于 user-select: none 的元素无效
 * 注意：当 id 为 false 且 attr 不会空，会直接复制 attr 的内容
 */
// export default  (id: string, attr: string = 'innerText') => {
//   let target: any = null;
//   let win: any = window;

//   if (attr) {
//       target = document.createElement('div');
//       target.id = 'tempTarget';
//       target.style.opacity = '0';
//       if (id) {
//           let curNode: any = document.querySelector('#' + id);
//           target.innerText = curNode[attr];
//       } else {
//           target.innerText = attr;
//       }
//       document.body.appendChild(target);
//   } else {
//       target = document.querySelector('#' + id);
//   }

//   console.log(target, 'target');
  
//   try {
//       let range = document.createRange();
//       range.selectNode(target);
//       win.getSelection().removeAllRanges();
//       win.getSelection().addRange(range);
//       win.execCommand('copy');
//       win.getSelection().removeAllRanges();
//       console.log('复制成功')
//   } catch (e) {
//       console.log('复制失败')
//   }

//   if (attr) {
//       // remove temp target
//       target.parentElement.removeChild(target);
//   }
// }

interface  Options {
    success?: () => void;
    failed?: () => void;
}

export default  (text: string, options?: Options) => {
    if(text.indexOf('-') !== -1) {
        let arr = text.split('-');
        text = arr[0] + arr[1];
    }
    const textArea = document.createElement("textarea");
      textArea.style.position = 'fixed';
      textArea.style.top = '0';
      textArea.style.left = '0';
      textArea.style.width = '2em';
      textArea.style.height = '2em';
      textArea.style.padding = '0';
      textArea.style.border = 'none';
      textArea.style.outline = 'none';
      textArea.style.boxShadow = 'none';
      textArea.style.background = 'transparent';
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();

      try {
        const successful = document.execCommand('copy');
        if (successful) {
            options?.success && options?.success()
        } else {
            options?.failed && options?.failed()
        }
      } catch (err) {
        options?.failed && options?.failed()
      }
 
      document.body.removeChild(textArea);
}

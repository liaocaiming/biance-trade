const loadedScripts: string[] = [];

interface ILoadScriptOption {
  timeout?: number;
  attrs?: {
    [key: string]: string
  }
}

export default function loadScript(url: string, option: ILoadScriptOption = {}) {
  return new Promise((resolve, reject) => {
    const { timeout = 6000, attrs } = option;
    const scriptElem: any = document.getElementsByTagName("script");
    const len = scriptElem.length;
    const script: any = document.createElement("script");
    let thisTimeout: any = null;
    let i;

    // 判断是否已加载了相同的 域名和端口的文件
    for (i = 0; i < len; i++) {
      if (url.split("?")[0] === scriptElem[i].src.split("?")[0]) {
        resolve();
        return null;
      }
    }

    // 防止重复加载同一URL
    if (loadedScripts.indexOf(url) !== -1) {
      resolve();
      return null;
    }

    script.type = "text/javascript";

    // 扩展 script 的属性
    if(attrs) {
      Object.keys(attrs).forEach((key) => {
        script.setAttribute(key, attrs[key])
      })
    }

    // IE
    if (script.readyState) {
      script.onreadystatechange = () => {
        if (script.readyState === "loaded" || script.readyStat === "complete") {
          script.onreadystatechange = null;
          resolve();
          loadedScripts.push(url);
          clearTimeout(thisTimeout);
        }
      };

      // Others: Firefox, Safari, Chrome, and Opera
    } else {
      script.onload = () => {
        resolve();
        loadedScripts.push(url);
        clearTimeout(thisTimeout);
      };
    }

    thisTimeout = setTimeout(() => {
      const urlIndex = loadedScripts.indexOf(url);

      resolve(`load script ${  url  } error!`);
      document.body.removeChild(script);

      if (urlIndex !== -1) {
        loadedScripts.splice(urlIndex, 1);
      }
    }, timeout);

    if (typeof script.onerror === "function") {
      script.onerror = (error: Error) => {
        resolve(error);
      };
    }

    script.src = url;
    document.body.appendChild(script);

    return script;
  });
}

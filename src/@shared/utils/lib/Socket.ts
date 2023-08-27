
const emptyFn = function () {

}

interface IProps {
  url: string;
  channel: string;
  message: (data: any) => void;
  close?: (e: CloseEvent) => void;
  error?: (e: Event) => void;
  open?: (e: Event) => void;
}

let wss: WebSocket | null;
let host = window.location.host;
const hostname = window.location.hostname;
if (hostname === 'localhost') {
  host = '47.74.177.128'
}

export default (props: IProps): WebSocket => {
  const { url, message, close = emptyFn, error = emptyFn, open = emptyFn, channel } = props;
  if (wss) {
    wss.close();
  }
  let src = `ws://${host}/${url}`

  wss = new WebSocket(src);
  // let send = wss.send;
  wss.addEventListener('close', (e) => {
    console.log('close');
    close(e)

    wss = null
  })
  wss.addEventListener('error', (e) => {
    console.log('error');
    error(e)
  })

  wss.addEventListener('open', (e) => {
    console.log('open');
    open(e)
  })

  wss.addEventListener('message', (e) => {
    let data = e.data
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch {
        data = e.data;
      }
    }

    if (data.type != 'ping') {
      message(data)
    }

  })

  wss.addEventListener(channel, (e) => {
    console.log(e, 'channel');

  })

  // wss.send = (data: Object) => {
  //   // let msg = queryToParamsStr(data);
  //   send('fff');
  // }

  return wss;
}
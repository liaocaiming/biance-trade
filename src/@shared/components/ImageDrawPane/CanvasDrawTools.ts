export default class CanvasDrawTools {
  canvas: any;
  context: any;
  rect: any = {};
  lastImageData: any;
  startPos: any;

  state: any = {};

  position: any = {}

  history: any[] = [];

  imageData: any = {};

  currentScale = 1;

  constructor(canvas: any, imageData: any) {
    this.canvas = canvas;
    this.imageData = imageData;

    this.context = canvas.getContext('2d');
    this.rect.width = canvas.width;
    this.rect.height = canvas.height;

    this.rect.offsetWidth = canvas.offsetWidth;
    this.rect.offsetHeight = canvas.offsetHeight;

    const rect = canvas.getBoundingClientRect();
    this.rect.top = rect.top;
    this.rect.left = rect.left;

    this.state.lastImageData = this.context.getImageData(0, 0, this.rect.width, this.rect.height);
    this.pushHistory();
    this.state = {
      strokeColor: '#fb3838',
      strokeWidth: 2,
      drawType: 'ellipse',
    };

    canvas.addEventListener('mousedown', this.handleMouseDown, false);
  }

  destory() {
    this.canvas.removeEventListener('mousedown', this.handleMouseDown);
    this.canvas = null;
    this.context = null;
    this.history.length = 0;
  }

  getPos = (event: any, rect2: any) => {
    let scale = 1;
    try {
      const match = this.canvas.style.transform.match(/translate3d\((.*?)px, (.*?)px, 0px\) scale\((.*?)\) rotate\((.*?)deg\)/)
      const [, , , scaleValue, ] = match;
      scale = Number(scaleValue)
    } catch(e) {
    }

    const rect = this.canvas.getBoundingClientRect();
    let x = (event.clientX - rect.left) / scale;
    let y = (event.clientY - rect.top) / scale;

    if (x <= 0) x = 0;
    if (x >= rect.width) x = rect.width;
    if (y <= 0) y = 0;
    if (y >= rect.height) y = rect.height;

    return {
      x,
      y,
    };
  };

  handleMouseDown = (e: any) => {
    const { rect, context, state } = this;
    this.startPos = this.getPos(e, rect);
    this.state.lastImageData = context.getImageData(0, 0, rect.width, rect.height);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.shadowBlur = 0;
    context.strokeStyle = state.strokeColor;
    context.lineWidth = state.strokeWidth;
    switch (state.drawType) {
      case 'rect':
        // __drawRect.call(self, e, startPos)
        this.drawRect(e, this.startPos);
        break;
      case 'ellipse':
        this.drawEllipse(e, this.startPos);
        break;
      case 'mosaic':
        // __drawMoasic.call(self, e)
        break;
      case 'brush':
      default:
        // __drawBrush.call(self, e, _startPos)
        break;
    }
    document.addEventListener('mousemove', this.handleMouseMove, false);
    document.addEventListener('mouseup', this.handleMouseUp, false);
  };

  drawEllipse = (event: MouseEvent, start: any) => {
    const { context, rect, state } = this;
    const pos = this.getPos(event, rect);
    let scaleX = 1 * ((pos.x - start.x) / 2);
    let scaleY = 1 * ((pos.y - start.y) / 2);
    let x = start.x / scaleX + 1;
    let y = start.y / scaleY + 1;
    context.clearRect(0, 0, rect.width, rect.height);
    context.putImageData(state.lastImageData, 0, 0, 0, 0, rect.width, rect.height);
    context.save();
    context.beginPath();
    context.scale(scaleX, scaleY);
    context.arc(x, y, 1, 0, 2 * Math.PI);
    context.restore();
    context.closePath();
    context.stroke();
  };

  drawRect = (event: MouseEvent, start: any) => {
    const { context, rect, state } = this;
    const pos = this.getPos(event, rect);
    let width = pos.x - start.x;
    let height = pos.y - start.y;
    context.clearRect(0, 0, rect.width, rect.height);
    context.putImageData(state.lastImageData, 0, 0, 0, 0, rect.width, rect.height);
    context.save();
    context.beginPath();
    context.strokeRect(start.x, start.y, width, height);
    context.restore();
    context.closePath();
  };

  handleMouseMove = (e: any) => {
    switch (this.state.drawType) {
      case 'rect':
        this.drawRect(e, this.startPos);
        break;
      case 'ellipse':
        this.drawEllipse(e, this.startPos);
        break;
      case 'mosaic':
        // __drawMoasic.call(self, event)
        break;
      case 'brush':
      default:
        // __drawBrush.call(self, event, null)
        break;
    }
  };

  handleMouseUp = () => {
    document.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('mouseup', this.handleMouseUp);
    this.pushHistory();
  };

  pushHistory = () => {
    this.history.push(this.context.getImageData(0, 0, this.rect.width, this.rect.height));
  };

  changeDrawType = (drawType: string) => {
    this.state.drawType = drawType;
  };

  undo = () => {
    const { history, rect } = this;
    if (history.length > 1) {
      history.pop();
      this.context.putImageData(history[history.length - 1], 0, 0, 0, 0, rect.width, rect.height);
    }
  };

  cancel = () => {
    this.destory();
  };

  finish = () => {
    return new Promise((resolve) => {
      resolve({
        canvas: this.canvas,
        drawCount: this.history.length - 1,
      });
      this.destory();
    });
  };

  setupCanvasPositionData(position: any) {
    this.position = position;
  }
}

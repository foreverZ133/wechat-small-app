import Sprite from './sprite.js';

import { fontFamily } from '../libs/config.js';
import { getTextWidth, watchValueChange } from '../libs/utils.js';

export default class Text extends Sprite {
  constructor(text = '', maxWidth = Infinity, textWrap = false) {
    /* 注：maxWidth 不可为 null */
    super();

    this.text = text || '';
    this.maxWidth = maxWidth; // 超出时使用 ... 
    this.textWrap = textWrap; // 超出是否换行，做不到很好的 justify 哟

    // 绑定数值联动
    watchValueChange(this, 'fontSize', (val) => {
      this.lineHeight = val * 1.2;
      this.resize();
    });
    ['maxWidth', 'text'].forEach(key => {
      watchValueChange(this, key, (val) => {
        this.resize();
      });
    });

    // 其他重要赋值
    this.color = '#000';
    this.fontSize = 16;
  }

  /**
   * 分三种文本绘制
   * 1. 普通
   * 2. 超出不换行的
   * 3. 超出换行的
   */
  customDrawToCanvas(ctx) {
    const { options: { json } } = this;
    const { x, y, maxWidth, fontSize, lineHeight, color, textAlign } = this;

    ctx.save();
    
    ctx.textBaseline = 'top';
    ctx.fillStyle = color;
    ctx.font = `${fontSize}px / ${lineHeight} ${fontFamily}`;

    json.forEach(({ text, width }, index) => {
      switch (textAlign) {
        case 'center': ctx.fillText(text, x + maxWidth / 2 - width / 2, y + index * lineHeight); break;
        case 'right': ctx.fillText(text, x + maxWidth - width, y + index * lineHeight); break;
        case 'left': default: ctx.fillText(text, x, y + index * lineHeight);
      }
    });

    ctx.restore();
  }

  /**
   * 根据 maxWidth 和 textWrap 获取文本显示的 json 结构
   */
  getTextWrapJson(text) {
    const { fontSize = 16, lineHeight, maxWidth, textWrap } = this;

    // 如果不定宽，则直接返回
    if (maxWidth === Infinity) {
      const realCharWidth = getTextWidth(text, fontSize);
      return { width: realCharWidth, height: lineHeight, json: [{ text: text, width: realCharWidth }] };
    }

    const json = []; // 每行文本的数据
    const dotWidth = getTextWidth('...', fontSize);

    for (let i in text) {
      let char = text[i];
      let item = json.slice(-1)[0];
      if (!item) item = { text: '', width: 0 }
      
      if (textWrap === true) { // 换行
        const realCharWidth = getTextWidth(item.text + char, fontSize);
        if (realCharWidth <= maxWidth) {
          item.text += char;
          item.width = realCharWidth;
          json.splice(-1, 1, item);
        } else {
          item = { text: char, width: realCharWidth };
          json.push(item);
        }
      } else {  // 不换行
        const realCharWidth = getTextWidth(item.text + char, fontSize);
        if (realCharWidth <= maxWidth + dotWidth) {
          item.text += char;
          item.width = realCharWidth;
          json.splice(-1, 1, item);
        } else {
          item.text += '...';
          item.width = maxWidth;
          json.splice(-1, 1, item);
          return { width: maxWidth, height: lineHeight, json };
        }
      }
    }

    return {
      width: maxWidth,
      height: lineHeight * json.length,
      json,
    };
  }

  /**
   * 重新计算盒子大小
   */
  resize() {
    const { text = '' } = this;
    this.options = this.getTextWrapJson(text);
    const { width, height } = this.options;
    this.width = width;
    this.height = height;
  }
}

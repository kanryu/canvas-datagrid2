/*jslint browser: true, unparam: true, todo: true*/
/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/

'use strict';

import { Point, Draw, Rect } from './draw';
import { Grid } from './grid';


interface TextType
{
  /** What to draw */
  text: string|undefined;
  /** Horizontal alignment(left/center/right) */
  hAlign: string;
  /** Vertical alignment(top/middle/bottom) */
  vAlign: string;
  /** Text wrapping(nowrap/wrap/shrink) */
  wrapping: string;
  /** How to render the value */
  formura: string;
}

class TextLine
{
  text:string;
  height:number
  tm:TextMetrics;
  constructor(text:string, height:number, tm:TextMetrics) {
    this.text = text
    this.height = height
    this.tm = tm
  }
}

/**
 * Draw the text in the cell.
 */
export class Text implements TextType
{
  /** What to draw */
  text: string|undefined;
  /** Horizontal alignment(left/center/right) */
  hAlign: string;
  /** Vertical alignment(top/middle/bottom) */
  vAlign: string;
  /** Text wrapping(nowrap/wrap/shrink) */
  wrapping: string;
  /** How to render the value */
  formura: string;
  constructor(text:string|TextType|undefined) {
    switch (typeof text) {
      case 'object':
        this.text = text.text;
        this.vAlign = text.vAlign || 'top';
        this.hAlign = text.hAlign || 'left';
        this.wrapping = text.wrapping || 'nowrap';
        this.formura = text.formura || 'default';
        break;
      case 'string':
        this.text = text;
        this.vAlign = 'top';
        this.hAlign = 'left';
        this.wrapping = 'nowrap';
        this.formura = 'default';
        break;
      default:
        this.text = undefined;
        this.vAlign = 'top';
        this.hAlign = 'left';
        this.wrapping = 'nowrap';
        this.formura = 'default';
        break;
    }
  }
  get isValid() {
    return !!this.text
  }
  willOverlap(ctx:Draw, rect:Rect) {
    let text:string = this.text!
    let tm = ctx.measureText(text)
    return this.wrapping == 'nowrap' && tm.width > rect.width-2
  }
  /**
   * Draw the text in the cell.
   * 
   * Measure the size of the text to accommodate line breaks, and split the line if it is too long.
   */
  draw(grid:Grid, ctx:Draw, rect:Rect, isForce=false):Rect|undefined {
    if (!this.isValid) {
      return;
    }
    let text:string = this.text!
    let textLines:Array<TextLine> = this.makeTextLines(text, ctx, rect, isForce)
    return this.drawTextLines(grid, ctx, rect, textLines)
  }
  /** Measure the size of the text to accommodate line breaks, and split the line if it is too long. */
  makeTextLines(text:string, ctx:Draw, rect:Rect, isForce:boolean):Array<TextLine> {
    // ToDo: Since measureText () is a heavy process, the number of executions should be reduced.
    let tm = ctx.measureText(text)
    let height = tm.actualBoundingBoxAscent+tm.actualBoundingBoxDescent+1
    let wrapping = isForce ? 'wrap' : this.wrapping
    if (tm.width <= rect.width-2 || wrapping == 'nowrap') {
      return [new TextLine(text, height, tm)]
    }
    let textLines:Array<TextLine> = []
    let lineCount = 0
    for(let i = text.length;i > 0; i--) {
      let subtext = text.substring(0, i);
      tm = ctx.measureText(subtext)
      if (tm.width > rect.width-2) {
        continue;
      }
      textLines.push(new TextLine(subtext, height, tm))
      if (text==subtext) {
        break;;
      }
      text = text.substring(subtext.length)
      lineCount++
      i = text.length+1
    }
    return textLines
  }
  /** Draw text split on multiple lines */
  drawTextLines(grid:Grid, ctx:Draw, rect:Rect, textLines:Array<TextLine>):Rect {
    let drawnRect = new Rect(new Point(), 0, 0)
    for (let i = 0; i < textLines.length; i++) {
      let line = textLines[i]
      let tm = line.tm
      let height = line.height
      let text = line.text
      let left = rect.left+tm.actualBoundingBoxLeft+1
      let top = rect.top+tm.fontBoundingBoxAscent+height*i
      switch(this.vAlign) {
        case 'middle':
          top = rect.top+height*i+Math.ceil((rect.height+tm.fontBoundingBoxAscent-tm.fontBoundingBoxDescent-height*(textLines.length-1))/2)
          break;
        case 'bottom':
          top = rect.bottom-tm.fontBoundingBoxDescent-height*(textLines.length-i-1)
          break;
        default:
          break;
      }
      switch(this.hAlign) {
        case 'center':
          left = rect.left+Math.ceil((rect.width-tm.width)/2)-1
          break;
        case 'right':
          left = rect.right-tm.width-1
          break;
        default:
          break;
      }
      ctx.fillText(text, {x:left, y:top})
      let rectLine = new Rect({x:left-tm.actualBoundingBoxLeft, y:top-tm.actualBoundingBoxAscent}, tm.width, tm.actualBoundingBoxAscent+tm.actualBoundingBoxDescent)
      drawnRect = drawnRect.union(rectLine)
    }
    return drawnRect
  }
}


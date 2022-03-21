/*jslint browser: true, unparam: true, todo: true*/
/*globals define: true, MutationObserver: false, requestAnimationFrame: false, performance: false, btoa: false*/

'use strict';

type PointType = {
  x:number,
  y:number
}
/** Holds the xy coordinates on the Canvas and the matrix coordinates of the cell */
export class Point
{
  x: number;
  y: number;
  constructor();
  constructor(point: PointType);
  constructor(x:number, y:number);
  constructor(arg?: PointType|number, y?: number) {
    switch (typeof arg) {
      case 'number':
        this.x = arg
        this.y = y === undefined ? 0 : y;
        break;
      case 'object':
        this.x = arg.x ?? 0;
        this.y = arg.y ?? 0;
        break;
      default:
        this.x = 0;
        this.y = 0;
        break;
    }
  }
}

/** Hold a rectangular area on the Canvas */
export class Rect
{
  topLeft: Point;
  bottomRight: Point;
  constructor(topLeft: PointType, bottomRight: PointType);
  constructor(topLeft: PointType, width:number, height:number);
  constructor(topLeft: PointType, arg2: PointType|number, height?:number) {
    this.topLeft = topLeft;
    switch (typeof arg2) {
      case 'object':
        this.bottomRight = arg2;
        break;
      default:
        this.bottomRight = new Point(topLeft.x+arg2,topLeft.y+(height?height:0));
        break;
    }
  }
  get width() {
    return this.bottomRight.x - this.topLeft.x;
  } 
  get height() {
    return this.bottomRight.y - this.topLeft.y;
  } 
  get left() {
    return this.topLeft.x;
  } 
  get top() {
    return this.topLeft.y;
  }
  get right() {
    return this.bottomRight.x
  } 
  get bottom() {
    return this.bottomRight.y
  }
  /** Combines and returns two Rects */
  union(rhs:Rect):Rect {
    let topLeft = new Point(Math.min(this.left, rhs.left), Math.min(this.top, rhs.top))
    let bottomRight = new Point(Math.max(this.right, rhs.right), Math.max(this.bottom, rhs.bottom))
    return new Rect(topLeft, bottomRight)
  }
  /** Returns true if it contains the specified Rect */
  isIncluded(rhs:Rect):boolean {
    return this.left <= rhs.left
    && this.top <= rhs.top
    && rhs.right <= this.right
    && rhs.bottom <= this.bottom;
  }
  static clone(from:Rect):Rect {
    return new Rect(new Point(from.left, from.right), from.width, from.height)
  }
}

/**
 * Layout information for one cell grid to be drawn
 */
export class Cell
{
  /** Coordinates(column,row) in the table of the current cell */
  coordinate: Point;
  /**
  * The rectangular area in which the cells are drawn on the Canvas.
  * Borders are drawn on the bottom and right lines.
  */
  clipRect: Rect;
  constructor(coordinate:Point, clipRect:Rect) {
    this.coordinate = coordinate
    this.clipRect = clipRect
  }
  get width() {
    return this.clipRect.width
  } 
  get height() {
    return this.clipRect.height
  } 
  get left() {
    return this.clipRect.left
  } 
  get top() {
    return this.clipRect.top
  } 
  get colmun() {
    return this.coordinate.x
  } 
  get row() {
    return this.coordinate.y
  } 
}

/**
 *  Wrap canvas context2d
 */
export class Draw
{
  position:Point = new Point();
  ctx:CanvasRenderingContext2D;
  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }
  fillRect(rect:Rect, fillStyle?:string) {
    if (fillStyle) {
      this.ctx.fillStyle = fillStyle
    }
    this.ctx.fillRect(rect.left, rect.top, rect.width, rect.height)
  }

  strokeRect(rect:Rect, strokeStyle?:string) {
    if (strokeStyle) {
      this.ctx.strokeStyle = strokeStyle
    }
    this.ctx.strokeRect(rect.left, rect.top, rect.width, rect.height);
  }
  drawText(text:string) {
    this.ctx.fillText(text, this.position.x, this.position.y)
  }

  measureText(text:string):TextMetrics {
    return this.ctx.measureText(text)
  }
  fillText(text:string, leftTop:PointType, maxwidth?:number) {
    this.ctx.fillText(text, leftTop.x, leftTop.y, maxwidth)
  }
}


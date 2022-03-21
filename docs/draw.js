/*jslint browser: true, unparam: true, todo: true*/
/** Holds the xy coordinates on the Canvas and the matrix coordinates of the cell */
class Point {
    constructor(arg, y) {
        var _a, _b;
        switch (typeof arg) {
            case 'number':
                this.x = arg;
                this.y = y === undefined ? 0 : y;
                break;
            case 'object':
                this.x = (_a = arg.x) !== null && _a !== void 0 ? _a : 0;
                this.y = (_b = arg.y) !== null && _b !== void 0 ? _b : 0;
                break;
            default:
                this.x = 0;
                this.y = 0;
                break;
        }
    }
}
/** Hold a rectangular area on the Canvas */
class Rect {
    constructor(topLeft, arg2, height) {
        this.topLeft = topLeft;
        switch (typeof arg2) {
            case 'object':
                this.bottomRight = arg2;
                break;
            default:
                this.bottomRight = new Point(topLeft.x + arg2, topLeft.y + (height ? height : 0));
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
        return this.bottomRight.x;
    }
    get bottom() {
        return this.bottomRight.y;
    }
    /** Combines and returns two Rects */
    union(rhs) {
        let topLeft = new Point(Math.min(this.left, rhs.left), Math.min(this.top, rhs.top));
        let bottomRight = new Point(Math.max(this.right, rhs.right), Math.max(this.bottom, rhs.bottom));
        return new Rect(topLeft, bottomRight);
    }
    /** Returns true if it contains the specified Rect */
    isIncluded(rhs) {
        return this.left <= rhs.left
            && this.top <= rhs.top
            && rhs.right <= this.right
            && rhs.bottom <= this.bottom;
    }
    static clone(from) {
        return new Rect(new Point(from.left, from.right), from.width, from.height);
    }
}
/**
 * Layout information for one cell grid to be drawn
 */
class Cell {
    constructor(coordinate, clipRect) {
        this.coordinate = coordinate;
        this.clipRect = clipRect;
    }
    get width() {
        return this.clipRect.width;
    }
    get height() {
        return this.clipRect.height;
    }
    get left() {
        return this.clipRect.left;
    }
    get top() {
        return this.clipRect.top;
    }
    get colmun() {
        return this.coordinate.x;
    }
    get row() {
        return this.coordinate.y;
    }
}
/**
 *  Wrap canvas context2d
 */
class Draw {
    constructor(ctx) {
        this.position = new Point();
        this.ctx = ctx;
    }
    fillRect(rect, fillStyle) {
        if (fillStyle) {
            this.ctx.fillStyle = fillStyle;
        }
        this.ctx.fillRect(rect.left, rect.top, rect.width, rect.height);
    }
    strokeRect(rect, strokeStyle) {
        if (strokeStyle) {
            this.ctx.strokeStyle = strokeStyle;
        }
        this.ctx.strokeRect(rect.left, rect.top, rect.width, rect.height);
    }
    drawText(text) {
        this.ctx.fillText(text, this.position.x, this.position.y);
    }
    measureText(text) {
        return this.ctx.measureText(text);
    }
    fillText(text, leftTop, maxwidth) {
        this.ctx.fillText(text, leftTop.x, leftTop.y, maxwidth);
    }
}

export { Cell, Draw, Point, Rect };
//# sourceMappingURL=draw.js.map

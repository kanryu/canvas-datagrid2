import { Rect, Point } from './draw.js';

/*jslint browser: true, unparam: true, todo: true*/
class TextLine {
    constructor(text, height, tm) {
        this.text = text;
        this.height = height;
        this.tm = tm;
    }
}
/**
 * Draw the text in the cell.
 */
class Text {
    constructor(text) {
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
        return !!this.text;
    }
    willOverlap(ctx, rect) {
        let text = this.text;
        let tm = ctx.measureText(text);
        return this.wrapping == 'nowrap' && tm.width > rect.width - 2;
    }
    /**
     * Draw the text in the cell.
     *
     * Measure the size of the text to accommodate line breaks, and split the line if it is too long.
     */
    draw(grid, ctx, rect, isForce = false) {
        if (!this.isValid) {
            return;
        }
        let text = this.text;
        let textLines = this.makeTextLines(text, ctx, rect, isForce);
        return this.drawTextLines(grid, ctx, rect, textLines);
    }
    /** Measure the size of the text to accommodate line breaks, and split the line if it is too long. */
    makeTextLines(text, ctx, rect, isForce) {
        // ToDo: Since measureText () is a heavy process, the number of executions should be reduced.
        let tm = ctx.measureText(text);
        let height = tm.actualBoundingBoxAscent + tm.actualBoundingBoxDescent + 1;
        let wrapping = isForce ? 'wrap' : this.wrapping;
        if (tm.width <= rect.width - 2 || wrapping == 'nowrap') {
            return [new TextLine(text, height, tm)];
        }
        let textLines = [];
        for (let i = text.length; i > 0; i--) {
            let subtext = text.substring(0, i);
            tm = ctx.measureText(subtext);
            if (tm.width > rect.width - 2) {
                continue;
            }
            textLines.push(new TextLine(subtext, height, tm));
            if (text == subtext) {
                break;
            }
            text = text.substring(subtext.length);
            i = text.length + 1;
        }
        return textLines;
    }
    /** Draw text split on multiple lines */
    drawTextLines(grid, ctx, rect, textLines) {
        let drawnRect = new Rect(new Point(), 0, 0);
        for (let i = 0; i < textLines.length; i++) {
            let line = textLines[i];
            let tm = line.tm;
            let height = line.height;
            let text = line.text;
            let left = rect.left + tm.actualBoundingBoxLeft + 1;
            let top = rect.top + tm.fontBoundingBoxAscent + height * i;
            switch (this.vAlign) {
                case 'middle':
                    top = rect.top + height * i + Math.ceil((rect.height + tm.fontBoundingBoxAscent - tm.fontBoundingBoxDescent - height * (textLines.length - 1)) / 2);
                    break;
                case 'bottom':
                    top = rect.bottom - tm.fontBoundingBoxDescent - height * (textLines.length - i - 1);
                    break;
            }
            switch (this.hAlign) {
                case 'center':
                    left = rect.left + Math.ceil((rect.width - tm.width) / 2) - 1;
                    break;
                case 'right':
                    left = rect.right - tm.width - 1;
                    break;
            }
            ctx.fillText(text, { x: left, y: top });
            let rectLine = new Rect({ x: left - tm.actualBoundingBoxLeft, y: top - tm.actualBoundingBoxAscent }, tm.width, tm.actualBoundingBoxAscent + tm.actualBoundingBoxDescent);
            drawnRect = drawnRect.union(rectLine);
        }
        return drawnRect;
    }
}

export { Text };
//# sourceMappingURL=text.js.map

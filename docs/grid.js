import { Point, Rect } from './draw.js';
import { Text } from './text.js';

class CellRange extends Rect {
}
class CellData {
    constructor(position, text) {
        this.position = position;
        this.text = new Text(text);
    }
    draw(grid, ctx, rect) {
        var _a, _b, _c, _d, _e;
        if (!this.text.isValid) {
            return;
        }
        // draw background
        ctx.fillRect(rect, (_a = this.backgroundColor) !== null && _a !== void 0 ? _a : grid.backgroundColor);
        // draw text
        ctx.ctx.fillStyle = (_b = this.textColor) !== null && _b !== void 0 ? _b : grid.textColor;
        let textRect = this.text.draw(grid, ctx, rect);
        if (textRect && rect.right < (textRect === null || textRect === void 0 ? void 0 : textRect.right)) {
            // Draw a border for the entire text because the text overlaps to the cell to the right
            let cellRect = grid.getCellRectByRange(new Rect(this.position, grid.maxColumns - this.position.x, 1));
            for (let i = 1; i < cellRect[0].length; i++) {
                if (!cellRect[0]) {
                    break;
                }
                rect = new Rect(rect.topLeft, rect.width + cellRect[0][i].width, rect.height);
                if (rect.right >= (textRect === null || textRect === void 0 ? void 0 : textRect.right)) {
                    break;
                }
            }
            ctx.fillRect(rect, (_c = this.backgroundColor) !== null && _c !== void 0 ? _c : grid.backgroundColor);
            ctx.ctx.fillStyle = (_d = this.textColor) !== null && _d !== void 0 ? _d : grid.textColor;
            this.text.draw(grid, ctx, rect);
        }
        // draw border
        ctx.strokeRect(rect, (_e = this.borderColor) !== null && _e !== void 0 ? _e : grid.borderColor);
    }
}
class RowGrid {
    constructor() {
        this.cells = [];
    }
}
/**
 * Main Grid
 *
 * It has all the data of Grid and has a function to draw.
 * Eventually the grid data will be retrieved and stored from the outside interface,
 * so this class will only have some data.
 */
class Grid {
    constructor(options) {
        var _a, _b;
        /**
         * The coordinates of the upper left cell of the holding Grid Cell.
         *
         * If you hold a part of the Grid, it is not the origin.
         */
        this.gridRange = new CellRange(new Point(), 0, 0);
        /** A list of pixel width for each column in the Grid. */
        this.widthList = [];
        /** A list of pixel heights for each row in the Grid. */
        this.heightList = [];
        /**
         * The entire grid data.
         *
         * This property will change its structure
         * as it will eventually get only part of it dynamically.
         */
        this.rows = [];
        this.backgroundColor = '#ffffff';
        this.borderColor = '#a0a0a0';
        this.textColor = 'black';
        this.fontSize = 16;
        this.gridSize = new Point(options.columns, options.rows);
        let cellWidth = (_a = options.cellWidth) !== null && _a !== void 0 ? _a : 150;
        let cellHeight = (_b = options.cellHeight) !== null && _b !== void 0 ? _b : 24;
        let cellData = options.cellData;
        let range = new Rect(new Point(), this.gridSize);
        this.widthList = new Array(range.width).fill(cellWidth);
        this.heightList = new Array(range.height).fill(cellHeight);
        this.resetCells(range, cellData);
    }
    resetCells(range, cellData) {
        this.gridRange = CellRange.clone(range);
        this.rows = [];
        for (let r = range.top; r < range.bottom; r++) {
            let row = new RowGrid();
            for (let c = range.left; c < range.right; c++) {
                let cell = new CellData(new Point(c, r), cellData[r][c]);
                row.cells.push(cell);
            }
            this.rows.push(row);
        }
    }
    draw(ctx, range) {
        // [r,c] the layout of cells
        // [0,0][0,1]
        // [1,0][1,1]
        range = range !== null && range !== void 0 ? range : new CellRange(new Point(), this.maxColumns, this.maxRows);
        console.log(range);
        let cellRectMap = this.getCellRectByRange(range);
        console.log(cellRectMap);
        // Paint the entire background first
        // (because the text is written over the adjacent cells under certain conditions)
        let fullwidth = this.widthList.slice(range.left, range.right).reduce((p, c) => p + c);
        let fullheight = this.widthList.slice(range.top, range.bottom).reduce((p, c) => p + c);
        let entireCellRect = new Rect(new Point(), fullwidth, fullheight);
        ctx.fillRect(entireCellRect, this.backgroundColor);
        for (let r = range.top; r < range.bottom; r++) {
            for (let c = range.left; c < range.right; c++) {
                let cell = this.getCellData(c, r);
                let cellRect = cellRectMap[r][c];
                cell.draw(this, ctx, cellRect);
            }
        }
    }
    /** Returns the cell data at the specified position */
    getCellData(column, row) {
        return this.rows[row].cells[column];
    }
    /** Get the drawing area of the specified Cell range in a two-dimensional list */
    getCellRectByRange(range) {
        let cellRect = [];
        let lefttop = new Point();
        for (let r = range.top; r < range.bottom; r++) {
            let height = this.heightList[r];
            let cellRowRect = [];
            for (let c = range.left; c < range.right; c++) {
                let width = this.widthList[c];
                let cr = new Rect({ x: lefttop.x, y: lefttop.y }, width, height);
                cellRowRect.push(cr);
                lefttop.x += width;
            }
            cellRect.push(cellRowRect);
            lefttop.x = 0;
            lefttop.y += height;
        }
        return cellRect;
    }
    get maxColumns() {
        return this.gridSize.x;
    }
    get maxRows() {
        return this.gridSize.y;
    }
}

export { Grid };
//# sourceMappingURL=grid.js.map

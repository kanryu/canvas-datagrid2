import { Point, Rect, Draw } from './draw';
import { Text } from './text';

class CellRange extends Rect
{

}

class CellData
{
    text: Text;
    position:Point;
    backgroundColor:string|undefined;
    borderColor:string|undefined;
    textColor:string|undefined;
    fontSize:number|undefined;
    constructor(position:Point,text:string|undefined) {
        this.position = position
        this.text = new Text(text)
    }
    draw(grid:Grid, ctx:Draw, rect:Rect) {
        if (!this.text.isValid) {
            return
        }
        // draw background
        ctx.fillRect(rect, this.backgroundColor ?? grid.backgroundColor)
        // draw text
        ctx.ctx.fillStyle = this.textColor ?? grid.textColor
        let textRect = this.text.draw(grid, ctx, rect)
        if(textRect && rect.right < textRect?.right) {
            // Draw a border for the entire text because the text overlaps to the cell to the right
            let cellRect = grid.getCellRectByRange(new Rect(this.position, grid.maxColumns-this.position.x, 1))
            for (let i = 1; i < cellRect[0].length; i++) {
                if (!cellRect[0]) {
                    break;
                }
                rect = new Rect(rect.topLeft, rect.width+cellRect[0][i].width,rect.height)
                if (rect.right >= textRect?.right) {
                    break;
                }
            }
            // Since only the first cell is painted with the background color,
            // the entire concatenated cell is redrawn.
            ctx.fillRect(rect, this.backgroundColor ?? grid.backgroundColor)
            ctx.ctx.fillStyle = this.textColor ?? grid.textColor
            this.text.draw(grid, ctx, rect)
        }
        // draw border
        ctx.strokeRect(rect, this.borderColor ?? grid.borderColor)
    }
}

class RowGrid
{
    cells: Array<CellData> = [];
}

type TableSize = {
    columns:number,
    rows:number
}

/**
 * Main Grid
 * 
 * It has all the data of Grid and has a function to draw.
 * Eventually the grid data will be retrieved and stored from the outside interface, 
 * so this class will only have some data.
 */
export class Grid
{
    /** Table size held by Grid (columns, rows) */
    gridSize: Point;
    /** 
     * The coordinates of the upper left cell of the holding Grid Cell.
     * 
     * If you hold a part of the Grid, it is not the origin. 
     */
    gridRange:CellRange = new CellRange(new Point(), 0, 0);
    /** A list of pixel width for each column in the Grid. */
    widthList:Array<number> = [];
    /** A list of pixel heights for each row in the Grid. */
    heightList:Array<number> = [];
    /**
     * The entire grid data. 
     * 
     * This property will change its structure
     * as it will eventually get only part of it dynamically.
     */
    rows:Array<RowGrid> = [];
    backgroundColor:string = '#ffffff';
    borderColor:string = '#a0a0a0';
    textColor:string = 'black';
    fontSize:number = 16;
    constructor(options:TableSize|any) {
        this.gridSize = new Point(options.columns, options.rows)
        let cellWidth = options.cellWidth ?? 150;
        let cellHeight = options.cellHeight ?? 24;
        let cellData = options.cellData;
        let range = new Rect(new Point(), this.gridSize)
        this.widthList = new Array<number>(range.width).fill(cellWidth)
        this.heightList = new Array<number>(range.height).fill(cellHeight)
        this.resetCells(range, cellData)
    }
    resetCells(range:CellRange, cellData:Array<Array<any>>) {
        this.gridRange = CellRange.clone(range)
        this.rows = []
        for(let r = range.top; r < range.bottom; r++) {
            let row = new RowGrid();
            for(let c = range.left; c < range.right; c++) {
                let cell = new CellData(new Point(c,r), cellData[r][c])
                row.cells.push(cell)
            }
            this.rows.push(row)
        }
    }
    draw(ctx:Draw, range?:CellRange) {
        // [r,c] the layout of cells
        // [0,0][0,1]
        // [1,0][1,1]
        range = range ?? new CellRange(new Point(), this.maxColumns, this.maxRows)
        console.log(range);
        let cellRectMap = this.getCellRectByRange(range);
        console.log(cellRectMap);
        // Paint the entire background first
        // (because the text is written over the adjacent cells under certain conditions)
        let fullwidth = this.widthList.slice(range.left,range.right).reduce((p,c) => p+c)
        let fullheight = this.widthList.slice(range.top,range.bottom).reduce((p,c) => p+c)
        let entireCellRect = new Rect(new Point(), fullwidth, fullheight)
        ctx.fillRect(entireCellRect, this.backgroundColor)

        for(let r = range.top; r < range.bottom; r++) {
            for(let c = range.left; c < range.right; c++) {
                let cell = this.getCellData(c, r)
                let cellRect = cellRectMap[r][c]
                cell.draw(this, ctx, cellRect)
            }
        }
    }
    /** Returns the cell data at the specified position */
    getCellData(column:number, row:number):CellData {
        return this.rows[row].cells[column]
    }
    /** Get the drawing area of the specified Cell range in a two-dimensional list */
    getCellRectByRange(range:CellRange):Array<Array<Rect>> {
        let cellRect = []
        let lefttop = new Point()
        for(let r = range.top; r < range.bottom; r++) {
            let height = this.heightList[r]
            let cellRowRect = []
            for(let c = range.left; c < range.right; c++) {
                let width = this.widthList[c]
                let cr = new Rect({x:lefttop.x,y:lefttop.y}, width, height)
                cellRowRect.push(cr)
                lefttop.x += width
            }
            cellRect.push(cellRowRect)
            lefttop.x = 0
            lefttop.y += height
        }
        return cellRect
    }
    get maxColumns() {
        return this.gridSize.x;
    } 
    get maxRows() {
        return this.gridSize.y;
    } 
}


import { Draw } from './draw';
import { Grid } from './grid';

function createGridData(maxColumns:number, maxRows:number):Array<Array<string>> {
    let cellData = []
    for(let r = 0; r < maxRows; r++) {
        let row = [];
        for(let c = 0; c < maxColumns; c++) {
            let text = `Cell data (${c}, ${r})`
            row.push(text)
        }
        cellData.push(row)
    }
    return cellData
}




let canvas:HTMLCanvasElement = document.getElementById('my-house') as HTMLCanvasElement;
let ctx:CanvasRenderingContext2D = canvas.getContext('2d')!;
// ctx.font = "48px serif";
let draw = new Draw(ctx);
// draw.strokeRect({x:20, y:30});
// draw.position = {x:20, y:50};
// draw.fillText('new Point(Math.min(arg1.x, arg2.x), Math.min(arg1.y, arg2.y));', 200);
// console.log(draw);

ctx.font = "12pt san-serif";
let columns = 5
let rows = 5
let grid = new Grid({
    columns:5,
    rows:5,
    cellWidth:150,
    cellHeight:70,
    cellData:createGridData(columns, rows)
});
let cell12 = grid.rows[2].cells[1]
cell12.backgroundColor = 'yellow'
let text12 = grid.rows[2].cells[1].text
text12.vAlign = 'bottom';
text12.hAlign = 'center';

let text22 = grid.rows[2].cells[2].text
text22.vAlign = 'middle';
text22.hAlign = 'right';

let text13 = grid.rows[3].cells[1].text
text13.text = 'The TextMetrics interface represents drink'
text13.vAlign = 'top';
text13.hAlign = 'left';
text13.wrapping = 'wrap';

let text23 = grid.rows[3].cells[2].text
text23.text = 'The TextMetrics interface represents drink'
text23.vAlign = 'middle';
text23.hAlign = 'center';
text23.wrapping = 'wrap';

let text33 = grid.rows[3].cells[3].text
text33.text = 'The TextMetrics interface represents drink'
text33.vAlign = 'bottom';
text33.hAlign = 'right';
text33.wrapping = 'wrap';

grid.rows[4].cells[1].backgroundColor = 'yellow'
let text14 = grid.rows[4].cells[1].text
text14.text = 'long text is overlap but overwritten by cell with caption'
grid.rows[4].cells[2].text.text = undefined
grid.draw(draw);





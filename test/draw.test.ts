// jest-canvas-mock provides CanvasRenderingContext2D for unit testing. 
// This object has a hidden method for additional confirmation. 
// You can get the call history by executing __getEvents() after rendering.
import 'jest-canvas-mock'
import {Point, Rect, Draw} from '@lib/draw'



describe('Point', () => {
    it('default constructor', () => {
        let pt = new Point();
        expect(pt.x).toEqual(0);
        expect(pt.y).toEqual(0);
    })
    it('x,y constructor', () => {
        let pt = new Point(1,2);
        expect(pt.x).toEqual(1);
        expect(pt.y).toEqual(2);
    })
    it('{x,y} constructor', () => {
        let pt = new Point({x:1,y:2});
        expect(pt.x).toEqual(1);
        expect(pt.y).toEqual(2);
    })
    it('{x,y} constructor', () => {
        let pt = new Point({x:1,y:2});
        expect(pt.x).toEqual(1);
        expect(pt.y).toEqual(2);
    })
});

describe('Rect', () => {
    it('2 point constructor', () => {
        let rect = new Rect({x:10,y:20},{x:40,y:60});
        expect(rect.width).toEqual(30);
        expect(rect.height).toEqual(40);
        expect(rect.left).toEqual(10);
        expect(rect.top).toEqual(20);
        expect(rect.right).toEqual(40);
        expect(rect.bottom).toEqual(60);
    })
    it('lefttop, width, height constructor', () => {
        let rect = new Rect({x:10,y:20},30,40);
        expect(rect.width).toEqual(30);
        expect(rect.height).toEqual(40);
        expect(rect.left).toEqual(10);
        expect(rect.top).toEqual(20);
        expect(rect.right).toEqual(40);
        expect(rect.bottom).toEqual(60);
    })
});

describe('draw', () => {
    let ctx:CanvasRenderingContext2D = new window.CanvasRenderingContext2D();
    beforeEach(() => {
        ctx.__clearEvents();
        ctx.__clearDrawCalls();
        ctx.__clearPath();
    });
    it('default constructor', () => {
        let dr = new Draw(ctx);
        let events = ctx.__getEvents();
        expect(events.length).toEqual(0);
        expect(dr.position).toEqual({x:0,y:0});
    })
    it('drawText', () => {
        let dr = new Draw(ctx);
        dr.drawText('abc');
        let events = ctx.__getEvents();
        expect(events.length).toEqual(1);
        expect(events[0]).toEqual({
            "type": "fillText",
            "props": { "maxWidth": null, "text": "abc", "x": 0, "y": 0}, 
            "transform": [1, 0, 0, 1, 0, 0], 
        });
    })
    // it('strokeRect', () => {
    //     let dr = new Draw(ctx);
    //     dr.strokeRect({x:10,y:20});
    //     let events = ctx.__getEvents();
    //     expect(events.length).toEqual(1);
    //     expect(events[0]).toEqual({
    //         "type": "strokeRect",
    //         "props": {"height": 20, "width": 10, "x": 0, "y": 0}, 
    //         "transform": [1, 0, 0, 1, 0, 0], 
    //     });
    // })
});




import { MRect } from "./MRect";
import * as Util from "../util/util.js";

export class Selector extends MRect{
    constructor(points,color,thickness,width,height)
    {
        super(-1,points,color,thickness,width,height);
        this.observers = [];
        this.offset = {x:0,y:0};
        this.last_position = {x: this.points[0],y: this.points[1]};
    }

    attach(obsever){this.observers.push(obsever);}
    dettach(observer){
        let index = this.observers.indexOf(observer);
        if(index !== -1){this.observers.splice(index,1);}
    }

    move(mouse_position,initial_click,socket)
    {
        let offset = {x: initial_click.x - this.offset.x,y: initial_click.y - this.offset.y}

        this.points = [mouse_position.x - offset.x,mouse_position.y - offset.y];
        this.notify(socket);
        this.last_position = {x: this.points[0],y: this.points[1]};
    }

    set_offset()
    {
        this.offset = {x: this.points[0],y:this.points[1]};
        this.last_position = {x: this.points[0],y: this.points[1]};
    }

    notify(socket)
    {
        for(var i in this.observers)
        {
            let moved_by = {x:this.points[0] - this.last_position.x,y: this.points[1] -  this.last_position.y};
            let observer = this.observers[i];
            observer.notify(moved_by,socket);
        }
    }
}
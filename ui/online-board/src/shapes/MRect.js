import { Drawable } from "./Drawable";
import {Rect} from 'react-konva';

export class MRect extends Drawable
{
    constructor(type,key,points,color,thickness,width,height)
    {
        super(type,key,points);
        if(typeof color !== "string" || typeof thickness !== "number" || typeof width !== "number" || typeof height !== "number") {throw new Error("invalid arguments");}
        this.color = color;
        this.thickness = thickness;
        this.width = width;
        this.height = height;
        this.fill = false;
        this.fill_color = color;
        this.opacity = 1;
    }

    draw()
    {
        return (
            <Rect
            key={this.key}
            x={this.points[0]}
            y={this.points[1]}
            width={this.width}
            height={this.height}
            stroke={this.color}
            strokeWidth={this.thickness}
            fillEnabled={this.fill}
            fill={this.fill_color}
            opacity={this.opacity}
            />
        )
    }

    get_offset()
    {
        return {width: this.width, height:this.height}
    }

    to_rect()
    {
        let x = (this.width > 0)? this.points[0] : this.points[0] + this.width;
        let y = (this.height > 0)? this.points[1] : this.points[1] + this.height;
        return {
            points: [x,y],
            width: Math.abs(this.width),
            height: Math.abs(this.height),
        }
    }
}
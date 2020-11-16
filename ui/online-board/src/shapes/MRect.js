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
            />
        )
    }
}
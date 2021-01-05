import { Drawable } from "./Drawable";
import {Circle} from 'react-konva';

export class MCircle extends Drawable
{
    constructor(key,points,color,thickness,radius)
    {
        super('Circle',key,points);
        if(typeof color !== "string" || typeof thickness !== "number" || typeof radius !== "number") {throw new Error("invalid arguments");}
        this.color = color;
        this.thickness = thickness;
        this.radius = radius;
    }

    draw()
    {
        return (
            <Circle
                key={this.key}
                x={this.points[0]}
                y={this.points[1]}
                radius={this.radius}
                stroke={this.color}
                strokeWidth={this.thickness}
            />
        )
    }
    
    get_offset()
    {
        return {width: this.radius, height:this.radius}
    }

    to_rect()
    {
        return {
            points: [this.points[0]-this.radius,this.points[1]-this.radius],
            width: this.radius*2,
            height: this.radius*2,
        }
    }
}
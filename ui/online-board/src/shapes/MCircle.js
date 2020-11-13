import { Drawable } from "./Drawable";
import {Circle} from 'react-konva';

export class MCircle extends Drawable
{
    constructor(key,points,color,thickness,radius)
    {
        super(key,points);
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
}
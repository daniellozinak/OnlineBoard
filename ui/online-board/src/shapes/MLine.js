import { Drawable } from "./Drawable";
import {Line} from 'react-konva';

export class MLine extends Drawable{
    constructor(type,key,points,color,thickness)
    {
        super(type,key,points);
        if(typeof color !== "string" || typeof thickness !== "number") {throw new Error("invalid arguments");}
        this.color = color;
        this.thickness = thickness;
    }

    draw()
    {
        return (
            <Line 
                key={this.key}
                points={this.points}
                stroke={this.color}
                strokeWidth={this.thickness}
                lineCap={'round'}
                lineJoin={'round'}>
            </Line>)
    }
};
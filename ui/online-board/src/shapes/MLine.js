import { Drawable } from "./Drawable";
import {Line} from 'react-konva';

export class MLine extends Drawable{
    constructor(key,points,color,thickness)
    {
        super('Line',key,points);
        if(typeof color !== "string" || typeof thickness !== "number") {throw new Error("invalid arguments");}
        this.color = color;
        this.thickness = thickness;
    }

    create(key,points,color,thickness)
    {
        return new MLine("Line",key,points,color,thickness);
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

    get_offset()
    {
        return {width: 0, height: 0}
    }

    to_rect()
    {
        return {
            points: this.points,
            width: 0,
            height: 0,
        }
    }
};
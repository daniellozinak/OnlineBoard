import { Drawable } from "./Drawable";
import {Image} from 'react-konva';

export class MField extends Drawable{
    constructor(type,key,points,src)
    {
        super(type,key,points);
        if(typeof src !== "string") {throw new Error("invalid arguments");}
        this.src = src;
    }

    draw()
    {
        var temp_image = new window.Image();
        temp_image.src = this.src;
        return(
            <Image
            key={this.key}
            x={this.points[0]}
            y={this.points[1]}
            image={temp_image}
        />)
    }
};
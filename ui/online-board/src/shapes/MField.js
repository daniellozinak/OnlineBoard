import { Drawable } from "./Drawable";
import {Image} from 'react-konva';

export class MField extends Drawable{
    constructor(type,key,points,src)
    {
        super(type,key,points);
        if(typeof src !== "string") {throw new Error("invalid arguments");}
        this.src = src;
        this.width = 0;
        this.height = 0;
    }

    draw()
    {
        var temp_image = new window.Image();
        temp_image.src = this.src;
        this.width = temp_image.width;
        this.height = temp_image.height;
        return(
            <Image
            key={this.key}
            x={this.points[0]}
            y={this.points[1]}
            width={this.width}
            height={this.height}
            image={temp_image}
        />)
    }

    get_offset()
    {
        return {width: this.width, height:this.height}
    }

    to_rect()
    {
        return {
            points: this.points,
            width: this.width,
            height: this.height,
        }
    }
};
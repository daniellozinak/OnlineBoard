import { Drawable } from "./Drawable";
import {Image} from 'react-konva';

export class MField extends Drawable{
    constructor(key,points,src,scale,image = null)
    {
        super('Field',key,points);
        if(typeof src !== "string") {throw new Error("invalid arguments");}
        this.src = src;
        this.width = 0;
        this.height = 0;
        this.scale = scale;
        this.image = image;
        this.can_drag = false;
        this.stroke_width = 0;
    }

    draw(callback=null)
    {
        var temp_image = new window.Image();
        temp_image.src = this.src;
        this.width = temp_image.width;
        this.height = temp_image.height;
        if(this.image) {
            temp_image = this.image;
        }
        return(
                <Image
                key={this.key}
                x={this.points[0]}
                y={this.points[1]}
                width={this.width}
                height={this.height}
                scale={this.scale}
                image={temp_image}
                draggable={this.can_drag}
                stroke={'#006600'}
                strokeWidth={this.stroke_width}
                onDragEnd={(e)=>{
                    if(callback!== null){
                        callback.move(this.key,[e.target.attrs.x,e.target.attrs.y]);
                    }
                }}
                onClick={(e)=>{
                    this.can_drag = !this.can_drag;
                    callback.select({konva_object: e.target, custom_object: this}); 
                }}
            />
            )
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
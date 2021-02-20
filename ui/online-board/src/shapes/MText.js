import { Drawable } from "./Drawable";
import {Text} from 'react-konva';
import React from 'react';

export class MText extends Drawable{
    constructor(key,points,font_size,text)
    {
        super('Text',key,points);
        this.font_size = font_size;
        this.text = text;
        this.width = 100;
        this.height = 100;
        this.ref = React.createRef();
        this.edit = false;
    }

    draw()
    {
        return(
                <Text
                key={this.key}
                x={this.points[0]}
                y={this.points[1]}
                text={this.text}
                fontSize={this.font_size}
                ref={this.ref}
                fill={'green'}
                onDblClick={()=>{
                    let node = this.ref.current;
                    console.log(node.height());
                    let position =node.getAbsolutePosition();
                    this.edit = !this.edit;

                    var edit_text = document.createElement('textarea');
                    edit_text.value = node.getText();
                    edit_text.style.position = 'absolute';
                    edit_text.style.top = position.y + 'px';
                    edit_text.style.left = position.x + 'px';
                    edit_text.style.zIndex = 2;
                    edit_text.focus();
                    document.body.appendChild(edit_text);

                    edit_text.addEventListener('focusout', () =>{
                        this.text = edit_text.value;
                        document.body.removeChild(edit_text);
                    })
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
        this.width = this.ref.current.width();
        this.height = this.ref.current.height();
        return {
            points: this.points,
            width: this.width,
            height: this.height,
        }
    }
};
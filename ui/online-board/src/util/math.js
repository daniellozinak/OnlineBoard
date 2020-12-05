import {Drawable} from '../shapes/Drawable';
import {MRect} from '../shapes/MRect';

export function vector_size(x,y)
{
    return Math.sqrt(x*x + y*y);
}

export function vector_normalize(x,y)
{
    let size = vector_size(x,y);
    if(size === 0)
    {
        return {x:0,y:0};
    }
    return {x: x/size, y: y/size};
}

export function collision_check( entity, selector)
{
    if(!entity instanceof Drawable || !selector instanceof MRect){ return null;}

    var my_selector = {
        x: selector.points[0],
        y: selector.points[1],
        width: selector.width,
        height: selector.height
    }

    if(my_selector.width < 0)
    {
        my_selector.width *= -1;
        my_selector.x -= my_selector.width;
    }
    if(my_selector.height < 0)
    {
        my_selector.height *= -1;
        my_selector.y -= my_selector.height;
    }

    for(var i = 0; i < entity.points.length;i+=2)
    {
        var cors = {
            x: entity.points[i],
            y: entity.points[i+1]
        }
        if(( my_selector.x < cors.x) &&
            (my_selector.x + my_selector.width > cors.x) &&
            (my_selector.y < cors.y) &&
            (my_selector.y + my_selector.height > cors.y))
        {
            return true;
        }
    }
    return false;
}

export function get_selector(entities)
{
    if(!Array.isArray(entities)) {return null;}

    let x_cors = [];
    let y_cors = [];

    let count = 0;
    for(var i in entities)
    {
        if(entities[i].selected)
        {
            let to_rect = entities[i].to_rect();
            let width = to_rect.width;
            let height = to_rect.height;

            for(var j in to_rect.points)
            {

                if(j%2 === 0) {
                    let x = to_rect.points[j];
                    x_cors.push(x);
                    if(width > 0) { x_cors.push(x + width);}
                }
                else{
                    let y = to_rect.points[j];
                    y_cors.push(y);
                    if(height > 0) { y_cors.push(y + height);}
                }
            }

            count++;
        }
    }

    if(count === 0) {return null;}

    let max_x = Math.max.apply(Math, x_cors);
    let min_x = Math.min.apply(Math, x_cors);
    let max_y = Math.max.apply(Math, y_cors);
    let min_y = Math.min.apply(Math, y_cors);


    return {max_x: max_x, min_x: min_x, max_y: max_y, min_y: min_y};
}

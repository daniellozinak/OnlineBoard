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
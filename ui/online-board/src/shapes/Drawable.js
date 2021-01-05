export class Drawable{
    constructor(type,key,points)
    {
        if(typeof  key !== "number" || !(points instanceof Array)) {throw new Error("invalid arguments");}
        this.type = type;
        this.key = key;
        this.points = points;
        this.selected = false;
    }

    draw(){}
    self(){}
    to_rect(){}


    notify(moved_by)
    {
        for(var i in this.points)
        {
            this.points[i] += (i%2==0)? moved_by.x :  moved_by.y;
        }
    }
};

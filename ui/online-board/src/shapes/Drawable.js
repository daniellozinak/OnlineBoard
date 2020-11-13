export class Drawable{
    constructor(key,points)
    {
        if(typeof  key !== "number" || !(points instanceof Array)) {throw new Error("invalid arguments");}
        this.key = key;
        this.points = points;
    }

    draw(){}
};

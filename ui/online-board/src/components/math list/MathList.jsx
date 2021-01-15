import React,{lazy,Suspense} from 'react';
import './style.css';


class MathList extends React.Component{
    constructor(props)
    {
        super(props);
        this.state={
            show:true
        }
    }

    render()
    {
        return(
            <div className="math-list">math</div>
        )
    }
}

export default MathList;
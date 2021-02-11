import React,{lazy} from 'react';
import {Link} from 'react-router-dom';
import './style.css';
import {Navbar,Button} from 'react-bootstrap';


class TopBar extends React.Component{
    constructor(props)
    {
        super(props);
    }

    render(){
        return(
            <Navbar bg="dark" className="top-bar">
                <div className="draw">
                    <Link className="draw-button" to='/draw'>
                        <Button variant="success">DRAW</Button>
                    </Link>
                    <Link className="home-button" to='/'>
                        <Button variant="secondary">HOME</Button>
                    </Link>
                </div>
            </Navbar>
        )
    }
}

export default TopBar;
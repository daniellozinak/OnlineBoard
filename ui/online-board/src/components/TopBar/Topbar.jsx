import React,{lazy} from 'react';
import {Link} from 'react-router-dom';
import './style.css';
import {Navbar,Button} from 'react-bootstrap';
import {ReactComponent as HomeLogo} from "../../assets/icons/home.svg";
import {ReactComponent as DrawLogo} from "../../assets/icons/draw.svg";


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
                        <DrawLogo/>
                    </Link>
                    <Link className="home-button" to='/'>
                        <HomeLogo/>
                    </Link>
                </div>
            </Navbar>
        )
    }
}

export default TopBar;
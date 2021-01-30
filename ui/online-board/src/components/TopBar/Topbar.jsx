import React from 'react';
import {Link} from 'react-router-dom';
import './style.css';


class TopBar extends React.Component{
    constructor(props)
    {
        super(props);
    }

    render(){
        return(
            <div className="top-bar">
                <div className="draw">
                    <Link className="draw-button" to='/draw'>
                        <button>DRAW</button>
                    </Link>
                    <Link className="home-button" to='/'>
                        <button>HOME</button>
                    </Link>
                </div>
                <div className="authentication">
                    <Link className="login-button" to='/login'>
                        <button>LOGIN</button>
                    </Link>
                    <Link className="register-button" to='/register'>
                        <button>REGISTER</button>
                    </Link>
                </div>
            </div>
        )
    }
}

export default TopBar;
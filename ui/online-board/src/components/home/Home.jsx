import React  from 'react';
import './style.css'

import tutorial from '../../assets/images/home.jpg'

class Home extends React.Component
{
    render(){
        return(
            <div className="home">
                <div className="head">
                    Welcome to online white board
                </div>
                <div className="image">
                    <img src={tutorial}/>
                </div>
            </div>
        )
    }
}

export default Home;
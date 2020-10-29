
import React from 'react';
import Board from '../board/Board'
import './style.css';

class Container extends React.Component{
    render()
    {
        return(
            <div className="container">
                <div className="board-container">
                    <Board></Board>
                </div>
            </div>

        )
    }
}

export default Container;
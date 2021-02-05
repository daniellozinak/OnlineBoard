import React from 'react';
import './style.css';

class Invite extends React.Component{

    constructor(props)
    {
        super(props);
        this.state = {
            show: false
        }
    }

    invite()
    {
        this.props.create_callback.create_callback();
    }

    render()
    {
        return(
            <div className="invite">
                <button className="invite-button" onClick={this.invite.bind(this)}> INVITE</button>
                {this.state.show && <div className="link"> inv link</div>}
            </div>
        )
    }
}

export default Invite;
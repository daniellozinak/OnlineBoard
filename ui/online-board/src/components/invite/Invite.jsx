import React from 'react';
import './style.css';
import {Modal, Button,Form,Row} from 'react-bootstrap';

class Invite extends React.Component{

    constructor(props)
    {
        super(props);
        this.state = {
            show: false,
            copied: false
        }

    }

    invite()
    {
        if(this.props.joined){return;}
        this.props.create_callback.create_callback();
        this.setState({show:true})
    }

    handleClose()
    {
        this.setState({show:false})
    }


    render()
    {
        return(
            <div className="invite">
                <Button variant="success" onClick={this.invite.bind(this)}>
                    Invite
                </Button>

                <Modal show={this.state.show} onHide={this.handleClose.bind(this)}>
                    <Modal.Header closeButton>
                    <Modal.Title>Invite Your Friends!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Form.Control  readOnly type="text" value={this.props.link}/>
                            <Button 
                            variant="info"
                            onClick={() => {navigator.clipboard.writeText(this.props.link); this.setState({copied:true})}}
                            >{(this.state.copied) ? 'Copied!' : 'Copy' }</Button>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose.bind(this)}>
                        Close
                    </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default Invite;
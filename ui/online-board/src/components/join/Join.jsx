import React from 'react';
import './style.css';

import { Modal, Button, Form, Row } from 'react-bootstrap';


class Join extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            show: true,
            name: ''
        }
    }

    handleChange(e) {
        this.setState({ name: e.target.value });
    }

    handleConfirm(e) {
        if (this.state.name === '') { return;}
        this.setState({ show: false });
        this.props.join_callback(this.state.name);
    }

    render() {
        return (
            <div>
                <Modal show={this.state.show}>
                    <Modal.Header>
                        <Modal.Title>Type your username!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row>
                            <Form.Control type="text" placeholder="Username" onChange={this.handleChange.bind(this)}/>
                        </Row>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.handleConfirm.bind(this)}>
                            Confirm
                    </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    }
}

export default Join;
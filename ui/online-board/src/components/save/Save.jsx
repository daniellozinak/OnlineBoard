import React from 'react';
import {Modal,Button,Form} from 'react-bootstrap';
import './style.css'

class Save extends React.Component{

    constructor(props)
    {
        super(props);
        
        this.state={
            show: false,
            loaded_file: null,
            is_over: false,
        }
    }

    handleOpen() { this.setState({show: true}); }

    handleClose(){ this.setState({show: false}); }

    save(){
        if(this.props.board.length === 0){
            console.log('Board is empty')
            return;
        }
        let data = JSON.stringify(this.props.board);
        const a = document.createElement("a");
        const file = new Blob([data], { type: 'application/json' });
        a.href = URL.createObjectURL(file);
        a.download = 'your_board.json';
        a.click()
    }

    _onDragOver(e)
    {
        this.setState({is_over: true});
        e.stopPropagation();
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }

    _onDrop(e)
    {
        this.setState({is_over: false});
        e.stopPropagation();
        e.preventDefault();
        const fileList = e.dataTransfer.files;
        var json;

        let file = fileList[0];
        if(file.type !== 'application/json'){
            console.log('JSON only, please');
            return;
        }

        let reader = new FileReader();

        reader.onload = (function(theFile){
			return function (e) {
				try {
					json = JSON.parse(e.target.result);
					this.setState({loaded_file: json});
                    this.props.load_callback.load(json);
				} catch (ex) {
					alert('ex when trying to parse json = ' + ex);
				}
			}.bind(this)
		}.bind(this))(file);
		reader.readAsText(file);
    }

    _onDragLeave(e)
    {
        this.setState({is_over: false});
    }
    

    render(){
        return(
            <div className="save">
                <Button variant="primary" onClick={this.handleOpen.bind(this)}>Save</Button>
                <Modal show={this.state.show} 
                    onHide={this.handleClose.bind(this)}> 
                    <Modal.Header closeButton>Save or drag n' drop</Modal.Header>
                    <Modal.Body className="body">
                        <Button onClick={this.save.bind(this)}>Save</Button>
                        {!this.state.is_over && <div className='dragdrop-off' 
                        onDrop={this._onDrop.bind(this)}
                        onDragOver={this._onDragOver.bind(this)}
                        onDragLeave={this._onDragLeave.bind(this)}>
                            Drag n Drop 
                        </div>}
                        {this.state.is_over && <div className='dragdrop-on' 
                        onDrop={this._onDrop.bind(this)}
                        onDragOver={this._onDragOver.bind(this)}
                        onDragLeave={this._onDragLeave.bind(this)}>
                            Drag n Drop 
                        </div>}
                        <p>{this.state.loaded_file !== null ? 'loaded' : 'not loaded'}</p>
                    </Modal.Body>
                </Modal>
            </div>
        )
    }
}

export default Save;
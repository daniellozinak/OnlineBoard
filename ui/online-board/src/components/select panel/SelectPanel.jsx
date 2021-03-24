import React from 'react';
import './style.css';
import {Button} from 'react-bootstrap';

import {ReactComponent as CopyLogo} from "../../assets/icons/copy.svg";
import {ReactComponent as DeletLogo} from "../../assets/icons/delete.svg";

class SelectPanel extends React.Component{
  constructor(props)
  {
    super(props);
    this.state = {
      show: this.props.data.is_selected,
      x: this.props.data.x,
      y: this.props.data.y
    }

    this.panelRef = React.createRef();

  }

  componentDidUpdate(prev_props)
  {
    if(prev_props.data !== this.props.data)
    {
      this.setState({show: this.props.data.is_selected});
      this.setState({x: this.props.data.x});
      this.setState({y: this.props.data.y});

      if(this.panelRef.current !== null)
      {
        const node = this.panelRef.current;
      }

      //console.log(this.state.x + " " + this.state.y);
    }
  }

  _onClickDelete = e =>{
    this.props.callback_delete.delete_callback();
  }

  _onClickCopy = e =>{
    this.props.callback_copy.copy_callback();
  }

  render(){
    return(
      <>{this.state.show &&
      <div className="select-panel" style=
      {{position:'absolute',
       display: 'flex',
       gap: '5px',
       width: '20px',
       height: '20px',
       left: this.state.x + "px",
       top: this.state.y + "px"}}
       ref={this.panelRef}>
        <Button variant="light"  className="select-panel-delete" onClick={this._onClickDelete}><DeletLogo/></Button>
        <Button variant="light" className="select-panel-copy" onClick={this._onClickCopy}><CopyLogo/></Button>
      </div>}
      </>
    )
  }
}
export default SelectPanel;
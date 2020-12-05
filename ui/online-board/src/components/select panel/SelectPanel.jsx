import React from 'react';



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
      this.setState({x: this.props.data.x - 100});
      this.setState({y: this.props.data.y - 100});

      if(this.panelRef.current !== null)
      {
        const node = this.panelRef.current;
        console.log(node);
      }
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
      <div className="select-panel" style={{position:'absolute',left: this.state.x + "px",top: this.state.y + "px"}} ref={this.panelRef}>
        <button  className="select-panel-delete" onClick={this._onClickDelete}>DELETE</button>
        <button className="select-panel-copy" onClick={this._onClickCopy}>COPY</button>
      </div>}
      </>
    )
  }
}

export default SelectPanel;

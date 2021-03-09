import React from 'react';
import { Transformer } from "react-konva";

class ImageTransformer extends React.Component {
    componentDidMount() {
      this.checkNode();
    }
    componentDidUpdate() {
      this.checkNode();
    }
    checkNode() {
      const { selected } = this.props;
      
      if(selected!== null){
        this.transformer.attachTo(selected);
      }else{
        this.transformer.detach();
      }
      this.transformer.getLayer().batchDraw();
    }
    render() {
      return (
        <Transformer
          ref={node => {
            this.transformer = node;
          }}
        />
      );
    }
}

export default ImageTransformer;
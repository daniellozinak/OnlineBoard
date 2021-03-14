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
      
      if(selected.konva_object!== null){
        this.transformer.attachTo(selected.konva_object);
        selected.custom_object.update(selected.konva_object.attrs);
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
import React from 'react';
import compose from 'recompose/compose';
import withWidth from 'material-ui/utils/withWidth';
import Button from 'material-ui/Button';

const Footer = (({onClick, visible}) => {
  const btnStyle = {
    display: (visible) ? 'block' : 'none'
  };

  return(
    <div>
      <Button style={btnStyle} className="btn" size="large" onClick={()=>onClick(0)}>
        NE
      </Button>
      <Button style={btnStyle} className="btn" size="large" onClick={()=>onClick(1)}>
        DA
      </Button>
    </div>
  )
});

export default compose(withWidth())(Footer);

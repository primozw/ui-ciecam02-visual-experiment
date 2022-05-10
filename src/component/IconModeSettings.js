import React from 'react';
import { FormControl } from 'material-ui/Form';
import Input, { InputLabel } from 'material-ui/Input';
import IconButton from 'material-ui/IconButton';

const googleIcons = require('./googleIcons.js');

const IconModeSettings = ({options, onIconChange, onIconSizeChange}) => {


  const iconList = googleIcons.icons.map(function(elem, index) {
    if (index <= 100) {
      return (
        <IconButton key={index} data-icon={elem} onClick={onIconChange}>
          <i style={{
            color: (elem === options.icon) ? '#212121' : '#808080'
          }} className="material-icons">{elem}</i>
        </IconButton>
      );
    }
  });

  return(
    <div className="settings__icons">
      <FormControl className="settings__icons-size">
        <InputLabel htmlFor="font-size">Icon Size</InputLabel>
        <Input type="number" id="font-size" value={options.iconSize} onChange={onIconSizeChange} />
      </FormControl>

      <div className="settings__icons__list">
        {iconList}
      </div>
    </div>
  );
};

export default IconModeSettings;



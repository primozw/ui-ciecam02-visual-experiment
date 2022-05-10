import React, { Component } from 'react';
import Button from 'material-ui/Button';
import AddIcon from 'material-ui-icons/Add';
import Checkbox from 'material-ui/Checkbox';
import DeleteIcon from 'material-ui-icons/Delete';
import IconButton from 'material-ui/IconButton';


const classes = {
  button: 'btn--add',
  palette: 'palette',
  color: 'scheme',
  colors: 'schemes'
}




const Scheme = ({colors, onClick, selected, deleteHandler}) => {
  var colors = colors.map((elem, ind) => (<div key={ind} className="patch" style={{backgroundColor: elem}}/>));
  return (
    <div onClick={onClick} className={classes.color}>
      <Checkbox
        checked={selected}
      />
      {colors}
      <IconButton aria-label="Delete" onClick={deleteHandler}>
        <DeleteIcon />
      </IconButton>
    </div>
  )
}
const Palette = ({addSchemeHandler, schemes, setColors, selectedScheme, deleteHandler}) => {
  const palette = schemes.map((elem, ind) => {
    const colors = [elem.colors.initBackground,elem.colors.initForeground, elem.colors.targetBackground, elem.colors.newForeground];
    return <Scheme 
      key={elem.id} 
      selected={elem.id === selectedScheme} 
      colors={colors} 
      onClick={(event)=>setColors(elem.colors, elem.id)} 
      deleteHandler={(event)=>{
        deleteHandler(elem.id)
        event.stopPropagation();
      }} />
  });

  return(
    <div className={classes.palette}>
      <div className={classes.colors}>
        {palette}
      </div>
      <div className={classes.button} onClick={addSchemeHandler}>
        <Button mini variant="fab" color="primary" aria-label="add">
          <AddIcon />
        </Button>
        <p>Add colors</p>
      </div>
    </div>
  );
}


export default Palette;


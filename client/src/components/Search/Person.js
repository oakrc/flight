import React from 'react';
import { TextField, IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';

function Person(props) {

    return (
        <div className="Person">
            <p>{props.type}</p>
            <IconButton color="inherit" onClick={(e) => {props.updater(e, props.type, props.amount - 1)}}><RemoveIcon/></IconButton>
            <TextField id="outlined-basic" variant="outlined" value={props.amount} onChange={(e) => {props.updater(e, props.type, (e.target.value))}}/>
            <IconButton disabled={props.addDisabled} color="inherit" onClick={(e) => {props.updater(e, props.type, props.amount + 1)}}><AddIcon/></IconButton>
        </div>
    )
}

export default Person

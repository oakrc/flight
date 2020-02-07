import React from 'react';
import { FormControl, MenuItem, Select} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

function Passengers(props) {

    const list = [];
    for (const [index, value] of props.amounts.entries()) {
        let plural = '';
        if (value !== 1 && (props.type[index] === 'Adult' || props.type[index] === 'Infant')) {
            plural ='s'
        } else if (value !== 1 && props.type[index] === 'Child') {
            plural = 'ren'
        }
        list.push(<MenuItem key={props.type[index]} value={value}><AddIcon fontSize="large"/>{`${value} ${props.type[index]}${plural}`}</MenuItem>)
    }

    return (
        <div>
            <FormControl variant="outlined">
                <Select  
                value={props.curr}
                autoWidth
                defaultValue={1}
                >
                    {list}
                </Select>
            </FormControl>
        </div>
    )
}

export default Passengers

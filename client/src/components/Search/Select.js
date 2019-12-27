import React from 'react';
import { FormControl, MenuItem, Select} from '@material-ui/core';

export default function SimpleSelect(props) {

    const list = [];
    for (const value of props.options) {
        list.push(<MenuItem key={value} value={value}>{value}</MenuItem>)
    }

    return (

        <div>
        <FormControl variant="outlined">
            <Select  
            value={props.curr}
            onChange={(e) => {props.updater(e, e.target.value)}}
            defaultValue={"Road trip"}
            autoWidth
            >
            {list}
            </Select>
        </FormControl>
        </div>
  );
}

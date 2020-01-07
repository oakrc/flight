import React from 'react';
import { FormControl, MenuItem, Select, InputLabel} from '@material-ui/core';

export default function SimpleSelect(props) {

    const list = [];
    for (const value of props.options) {
        list.push(<MenuItem key={value} value={value}>{value}</MenuItem>)
    }
    const inputLabel = React.useRef(null);
    const [labelWidth, setLabelWidth] = React.useState(0);
    React.useEffect(() => {
      setLabelWidth(inputLabel.current.offsetWidth);
    }, []);

    return (

        <div>
        <FormControl variant="outlined">
            <InputLabel error={props.error} ref={inputLabel} id="formcontrollabel">
            {props.label}
            </InputLabel>
            <Select
            labelId="formcontrollabel"
            id="formcontrol"  
            value={props.curr}
            labelWidth={labelWidth}
            onChange={(e) => {props.updater(e, e.target.value)}}
            error={props.error}
            >
            {list}
            </Select>
        </FormControl>
        </div>
  );
}

import React from 'react';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

function DatePick(props) {

  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <KeyboardDatePicker
        autoOk
        disablePast
        variant="inline"
        inputVariant="outlined"
        format="MM/dd/yyyy"
        margin="none"
        label={props.label}
        value={props.value}
        onChange={(value, e) => props.updater(e, value)}
        KeyboardButtonProps={{
          "aria-label": "change date"
        }}
        onError={props.error}
      />
    </MuiPickersUtilsProvider>
  );
}

export default DatePick;
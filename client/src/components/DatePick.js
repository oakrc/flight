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
        minDate={props.minDate}
        maxDate={props.maxDate}
        maxDateMessage={props.maxDateMessage}
        error={props.error}
        autoOk
        disableFuture={props.disableFuture}
        disablePast={props.disablePast}
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
      />
    </MuiPickersUtilsProvider>
  );
}

export default DatePick;
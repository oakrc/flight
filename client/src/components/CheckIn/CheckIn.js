import React, { Component } from 'react';
import { Paper, TextField, Button } from "@material-ui/core";
import { Alert } from '@material-ui/lab';
import axios from 'axios';

import '../../css/components/CheckIn/CheckIn.scss';

export class CheckIn extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            passengerFirstName: '',
            passengerLastName: '',
            confirmationNumber: '',

            fNameValid: true,
            lNameValid: true,
            confNumberValid: true,
            confSuccess: null,

            fieldError : 0,

            id: ''
        }

        this.checkIn = this.checkIn.bind(this);
    }

    fNameUpdate(value) {
        if (value.replace(/\s+/g, '').length === 0) {
            this.setState({passengerFirstName: value.replace(/[&#,+()$~%.":*?<>{}]/g, ''), fNameValid: false})
        } else {
            this.setState({passengerFirstName: value.replace(/[&#,+()$~%.":*?<>{}]/g, ''), fNameValid: true})
        }
    }

    lNameUpdate(value) {
        if (value.replace(/\s+/g, '').length === 0) {
            this.setState({passengerLastName: value.replace(/[&#,+()$~%.":*?<>{}]/g, ''), lNameValid: false})
        } else {
            this.setState({passengerLastName: value.replace(/[&#,+()$~%.":*?<>{}]/g, ''), lNameValid: true})
        }
    }

    confirmUpdate(value) {
        if (value.replace(/\s+/g, '').length !== 6) {
            this.setState({confirmationNumber: value.replace(/[&#,+()$~%.":*?<>{}]/g, ''), confNumberValid: false})
        } else {
            this.setState({confirmationNumber: value.replace(/[&#,+()$~%.":*?<>{}]/g, ''), confNumberValid: true})
        }
    }

    checkIn() {
        let fNameValid = true;
        let lNameValid = true;
        let confNumberValid = true;
        let confSuccess = null;
        let fieldError = 0;

        if (this.state.passengerFirstName.replace(/\s+/g, '').length === 0) {
            fNameValid = false;
        }

        if (this.state.passengerLastName.replace(/\s+/g, '').length === 0) {
            lNameValid = false;
        }

        if (this.state.confirmationNumber.replace(/\s+/g, '').length !== 6) {
            confNumberValid = false;
            confSuccess = false;
        }

        if (!this.state.confNumberValid && this.state.lNameValid && this.state.fNameValid) {
            fieldError = 1;
        } else {
            fieldError = 2;
        }

        if (confNumberValid && lNameValid && fNameValid) {
            axios.post('/api/ticket/check-in', {
                first_name: this.state.passengerFirstName,
                last_name: this.state.passengerLastName,
                conf: this.state.confirmationNumber
            }, {withCredentials: true})
            .then((response) => {
                response.status === 200 && this.setState({confSuccess: true})
                console.log(response);
            })
            .catch((err) => {
                this.setState({confSuccess: false})
                console.log(err);
            })
        }

        this.setState({fNameValid: fNameValid, lNameValid: lNameValid, confNumberValid: confNumberValid, confSuccess: confSuccess, fieldError: fieldError});
    }

    render() {
        return (
            <div className="CheckIn">
                <Paper elevation={5}>
                    <h1>Check In</h1>
                    <TextField id="outlined-basic" label="Passenger First Name" variant="outlined" value={this.state.passengerFirstName} onChange={(e) => this.fNameUpdate(e.target.value)} error={!this.state.fNameValid}/>
                    <TextField id="outlined-basic" label="Passenger Last Name" variant="outlined" value={this.state.passengerLastName} onChange={(e) => this.lNameUpdate(e.target.value)} error={!this.state.lNameValid}/>
                    <TextField id="outlined-basic" label="Confirmation Number" variant="outlined" value={this.state.confirmationNumber} onChange={(e) => this.confirmUpdate(e.target.value)} error={!this.state.confNumberValid}/>
                    <div style={{display: 'inline-flex', width: '100%', justifyContent: this.state.confSuccess === null ? 'flex-end' : 'space-between'}}>
                        {this.state.confSuccess !== null && (this.state.confSuccess ? <Alert severity="success">Checked In!</Alert> : this.state.fieldError === 1 ? <Alert severity="error">Error! (6 digit Confirmation #)</Alert> : <Alert severity="error">Please fill out all fields!</Alert>)}
                        <Button color="primary" variant="contained" onClick={this.checkIn}>Check In</Button>
                    </div>
                </Paper>
            </div>
        )
    }
}

export default CheckIn

import React, { Component } from 'react';
import { Paper, TextField, Button, } from "@material-ui/core";
import axios from 'axios';

import '../../css/components/Careers/Careers.scss';

export class Careers extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            email: '',
            firstName: '',
            lastName: '',
            phoneNumber: '',

            firstNameValid: true,
            lastNameValid: true,
            emailValid: true,
            phoneNumberValid: true,
        }

        this.send = this.send.bind(this);
    }

    componentDidMount() {
        this.setState({display: true});
    }

    updateFName(value) {
        if (value === '') {
            this.setState({firstName: value, firstNameValid: false});
        } else {
            this.setState({firstName: value, firstNameValid: true});
        }
    }

    updateLName(value) {
        if (value === '') {
            this.setState({lastName: value, lastNameValid: false});
        } else {
            this.setState({lastName: value, lastNameValid: true});
        }
    }

    updatePhoneNumber(value) {
        if ((/^\d+$/.test(value) || value.length === 0) && value.length < 12) {
            if (value.length === 10 || (value.length === 11 && value[0] === '1')) {
                this.setState({phoneNumber: value, phoneNumberValid: true});  
            } else {
                this.setState({phoneNumber: value, phoneNumberValid: false});  
            } 
        }
    }

    updateEmail(value) {
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) || value.length === 0) {
            this.setState({email: value, emailValid: false})
        }

        if (value.length !== 0 && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
            this.setState({email: value, emailValid: true});
        }
    }

    send() {
        let firstNameValid = true;
        let lastNameValid = true;
        let emailValid = true;
        let phoneNumberValid = true;

        if (this.state.firstName === '') {
            firstNameValid = false;
        }

        if (this.state.lastName === '') {
            lastNameValid = false;
        }

        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(this.state.email) || this.state.email.length === 0) {
            emailValid = false;
        }

        if (this.state.phoneNumber.length !== 10 && (this.state.phoneNumber.length !== 11 && this.state.phoneNumber[0] !== '1')) {
            phoneNumberValid = false;
        }

        if (firstNameValid && lastNameValid && emailValid && phoneNumberValid) {
            axios.post('https://westflight.herokuapp.com/api/app', {
                first_name: this.state.firstName,
                last_name: this.state.lastName,
                phone_number: this.state.phoneNumber,
                email: this.state.email,
            }, {headers: {'content-type': 'multipart/form-data'}, withCredentials: true})
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        email: '',
                        firstName: '',
                        lastName: '',
                        phoneNumber: '',
                        firstNameValid: true,
                        lastNameValid: true,
                        emailValid: true,
                        phoneNumberValid: true,
                    })
                }
            }).catch(error => {
                console.log(error);
            })
        }

        this.setState({firstNameValid: firstNameValid, lastNameValid: lastNameValid, emailValid: emailValid, phoneNumberValid: phoneNumberValid});
    }

    render() {
        return (
            <div className={`Careers ${this.state.display ? 'shownnozfast' : 'hiddenfast'}`}>
                <Paper elevation={5}>
                    <h1>Send Us A Message!</h1>
                    <div className="half-field">
                        <TextField error={!this.state.firstNameValid} label="First name" variant="outlined" value={this.state.firstName} onChange={(e) => this.updateFName(e.target.value)}/>
                        <TextField error={!this.state.lastNameValid} label="Last name" variant="outlined" value={this.state.lastName} onChange={(e) => this.updateLName(e.target.value)}/>
                    </div>
                    <TextField type="tel" label="Phone Number" variant="outlined" value={this.state.phoneNumber} onChange={(e) => this.updatePhoneNumber(e.target.value)} error={!this.state.phoneNumberValid}/>
                    <TextField type="email" label="Email" variant="outlined" value={this.state.email} onChange={(e) => this.updateEmail(e.target.value)} error={!this.state.emailValid}/>
                    {this.state.resume !== null ? <p className="resumeTitle">{this.state.resumeTitle}</p> : null}
                    <Button className="submitButton" variant="contained" color="primary" onClick={this.signUp}>Submit</Button>
                </Paper>            
            </div>
        )
    }
}

export default Careers
import React, { Component } from 'react';
import { Paper, TextField, Button, } from "@material-ui/core";
import { Alert } from '@material-ui/lab';
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
            subject: '',
            message: '',

            firstNameValid: true,
            lastNameValid: true,
            emailValid: true,
            phoneNumberValid: true,
            subjectValid: true,
            messageValid: true,

            sent: false
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

    updateSubject(value) {
        if (value.trim().length === 0 || value.length > 120) {
            this.setState({subject: value, subjectValid: false})
        } else {
            this.setState({subject: value, subjectValid: true})
        }
    }

    updateMessage(value) {
        if (value.trim().length === 0 || value.length > 500) {
            this.setState({message: value, messageValid: false})
        } else {
            this.setState({message: value, messageValid: true})
        }
    }

    send() {
        let firstNameValid = true;
        let lastNameValid = true;
        let emailValid = true;
        let phoneNumberValid = true;
        let subjectValid = true;
        let messageValid = true;

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

        if (this.state.subject.trim().length === 0 || this.state.subject.length > 120) {
            subjectValid = false;
        }
        
        if (this.state.message.trim().length === 0 || this.state.message.length > 500) {
            messageValid = false;
        }

        if (firstNameValid && lastNameValid && emailValid && phoneNumberValid && subjectValid && messageValid) {
            axios.post('/api/msg', {
                first_name: this.state.firstName,
                last_name: this.state.lastName,
                phone: this.state.phoneNumber,
                email: this.state.email,
                subject: this.state.subject.trim(),
                message: this.state.message.trim()
            })
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        email: '',
                        firstName: '',
                        lastName: '',
                        phoneNumber: '',
                        subject: '',
                        message: '',
                        firstNameValid: true,
                        lastNameValid: true,
                        emailValid: true,
                        phoneNumberValid: true,
                        subjectValid: true,
                        messageValid: true,
                        sent: true
                    })
                }
            }).catch(error => {
            })
        }

        this.setState({firstNameValid: firstNameValid, lastNameValid: lastNameValid, emailValid: emailValid, phoneNumberValid: phoneNumberValid, subjectValid: subjectValid, messageValid: messageValid});
    }

    render() {
        return (
            <div className={`Careers Contact ${this.state.display ? 'shownnozfast' : 'hiddenfast'}`}>
                <Paper elevation={5}>
                    <h1 style={{textAlign: 'center'}}>Send Us A Message!<br></br><span style={{fontSize: '1.2rem'}}>Customer Service: 909-555-0146</span></h1>
                    <div className="third-field">
                        <TextField error={!this.state.firstNameValid} label="First name" variant="outlined" value={this.state.firstName} onChange={(e) => this.updateFName(e.target.value)}/>
                        <TextField error={!this.state.lastNameValid} label="Last name" variant="outlined" value={this.state.lastName} onChange={(e) => this.updateLName(e.target.value)}/>
                        <TextField type="tel" label="Phone Number" variant="outlined" value={this.state.phoneNumber} onChange={(e) => this.updatePhoneNumber(e.target.value)} error={!this.state.phoneNumberValid}/>
                    </div>
                    <TextField type="email" label="Email" variant="outlined" value={this.state.email} onChange={(e) => this.updateEmail(e.target.value)} error={!this.state.emailValid}/>
                    <TextField type="text" label="Subject" variant="outlined" value={this.state.subject} onChange={(e) => this.updateSubject(e.target.value)} error={!this.state.subjectValid}/>
                    <TextField label="Message" multiline rowsMax="6" value={this.state.message} onChange={(e) => this.updateMessage(e.target.value)} error={!this.state.messageValid} variant="outlined"/>
                    <div style={{display: 'inline-flex', width: '100%', justifyContent: this.state.sent ? 'space-between' : 'flex-end'}}>
                        <Button className="submitButton" variant="contained" color="primary" onClick={this.send}>Submit</Button>
                        {this.state.sent && <Alert severity="success">Sent!</Alert>}
                    </div>
                </Paper>            
            </div>
        )
    }
}

export default Careers
import React, { Component } from 'react';
import { Paper, TextField, Button, } from "@material-ui/core";
import { Alert } from '@material-ui/lab';
import axios from 'axios';

import Select from '../Select';
import DatePick from '../DatePick';

export class SignUpCard extends Component {
    constructor(props) {
        super(props);

        this.pwdValidate = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})");
    
        this.state = {
            email: '',
            password: '',
            confirmpwd: '',
            firstName: '',
            lastName: '',
            birthday: null,
            gender: '',
            phoneNumber: '',

            firstNameValid: true,
            lastNameValid: true,
            birthdayValid: true,
            genderEntered: true,
            emailValid: true,
            passwordValid: true,
            confirmpwdValid: true,
            phoneNumberValid: true,

            signUpSuccess: null,
            display: false,
        }

        this.signUp = this.signUp.bind(this);
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

    updateBirthday(e, value) {
        if (value === '') {
            this.setState({birthday: null})
        } else {
            if (value instanceof Date && !isNaN(value) && value.getFullYear() > 1909 && value < new Date().setFullYear(new Date().getFullYear() - 18)) {
                this.setState({birthday: value, birthdayValid: true})
            } else {
                this.setState({birthday: value, birthdayValid: false})
            }
        }
    }

    updateGender(e, value) {
        this.setState({gender: value, genderEntered: true});
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
    
    updatePwd(value) {
        if (this.pwdValidate.test(this.state.password) && /^[a-zA-Z0-9!@#$%^&*()_+-=/.,;']{8,}$/.test(value)) {
            this.setState({password: value, passwordValid: true})
        } else {
            this.setState({password: value, passwordValid: false})
        }
    }

    updateConfirmPwd(value) {
        if (value === this.state.password) {
            this.setState({confirmpwd: value, confirmpwdValid: true})
        } else {
            this.setState({confirmpwd: value, confirmpwdValid: false})
        }
        
    }

    signUp() {
        let firstNameValid = true;
        let lastNameValid = true;
        let birthdayValid = false;
        let genderEntered = true;
        let emailValid = true;
        let passwordValid = true;
        let confirmpwdValid = true;
        let phoneNumberValid = true;

        if (this.state.firstName === '') {
            firstNameValid = false;
        }

        if (this.state.lastName === '') {
            lastNameValid = false;
        }

        if (this.state.birthday instanceof Date && !isNaN(this.state.birthday) && this.state.birthday.getFullYear() > 1909 && this.state.birthday < new Date().setFullYear(new Date().getFullYear() - 18)) {
            birthdayValid = true;
        }

        if (this.state.gender.length === 0) {
            genderEntered = false;
        }

        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(this.state.email) || this.state.email.length === 0) {
            emailValid = false;
        }

        if (!this.pwdValidate.test(this.state.password)) {
            passwordValid = false;
        }

        if (this.state.password !== this.state.confirmpwd || this.state.confirmpwd.length === 0) {
            confirmpwdValid = false;
        }

        if (this.state.phoneNumber.length !== 10 && (this.state.phoneNumber.length !== 11 && this.state.phoneNumber[0] !== '1')) {
            phoneNumberValid = false;
        }

        if (firstNameValid && lastNameValid && birthdayValid && genderEntered && emailValid && passwordValid && confirmpwdValid && phoneNumberValid) {
            axios.put('https://westflightairlines.com/api/user', {
                first_name: this.state.firstName,
                last_name: this.state.lastName,
                birthday: this.state.birthday,
                gender: this.state.gender[0],
                phone_number: this.state.phoneNumber,
                email: this.state.email,
                password: btoa(this.state.password)
            }, {withCredentials: true})
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        email: '',
                        password: '',
                        confirmpwd: '',
                        firstName: '',
                        lastName: '',
                        birthday: null,
                        gender: '',
                        phoneNumber: '',
                        firstNameValid: true,
                        lastNameValid: true,
                        birthdayValid: true,
                        genderEntered: true,
                        emailValid: true,
                        passwordValid: true,
                        confirmpwdValid: true,
                        phoneNumberValid: true,
                    })
                    this.setState({signUpSuccess: true});
                    this.props.logIn();
                  }
            }).catch(error => {
                try {
                    console.log(error);
                  } catch {}
            })
        }

        this.setState({firstNameValid: firstNameValid, lastNameValid: lastNameValid, birthdayValid: birthdayValid, genderEntered: genderEntered, emailValid: emailValid, passwordValid: passwordValid, confirmpwdValid: confirmpwdValid, phoneNumberValid: phoneNumberValid});
    }

    close() {
        this.setState({display: false});
    }

    render() {
        return (
            <div className={`loginchild ${this.state.display ? 'shownnozfast' : 'hiddenfast'}`}>
                <Paper elevation={5}>
                    <h1>Sign Up</h1>
                    <div className="half-field">
                        <TextField error={!this.state.firstNameValid} label="First name" variant="outlined" value={this.state.firstName} onChange={(e) => this.updateFName(e.target.value)}/>
                        <TextField error={!this.state.lastNameValid} label="Last name" variant="outlined" value={this.state.lastName} onChange={(e) => this.updateLName(e.target.value)}/>
                    </div>
                    <div className="half-field">
                        <DatePick disableFuture label="Birthdate" value={this.state.birthday} updater={(e, date) => {this.updateBirthday(e, date)}} error={!this.state.birthdayValid} minDate={new Date('1910-12-31')} maxDate={new Date().setFullYear(new Date().getFullYear() - 18)} maxDateMessage={'Must be 18 years or older'}/>
                        <Select error={!this.state.genderEntered} label="Gender" variant="outlined" curr={this.state.gender} options={["Male", "Female", "Other", "Prefer not to say"]} updater={(e, option) => this.updateGender(e, option)}/>
                    </div>
                    <TextField type="tel" label="Phone Number" variant="outlined" value={this.state.phoneNumber} onChange={(e) => this.updatePhoneNumber(e.target.value)} error={!this.state.phoneNumberValid}/>
                    <TextField type="email" label="Email" variant="outlined" value={this.state.email} onChange={(e) => this.updateEmail(e.target.value)} error={!this.state.emailValid}/>
                    <TextField label="Password" type="password" autoComplete="current-password" variant="outlined" value={this.state.password} onChange={(e) => this.updatePwd(e.target.value)} error={!this.state.passwordValid}/>
                    <TextField label="Confirm Password" type="password" autoComplete="current-password" variant="outlined" value={this.state.confirmpwd} onChange={(e) => this.updateConfirmPwd(e.target.value)} error={!this.state.confirmpwdValid}/>
                    {this.state.signUpSuccess !== null && (this.state.signUpSuccess ? <Alert severity="success">Signed Up!</Alert> : <Alert severity="error">Error!</Alert>)}
                    <Button variant="contained" color="primary" onClick={this.signUp}>
                    Sign Up
                    </Button>
                    <Button color="primary" variant="outlined" onClick={() => {this.props.logIn(); this.close()}}>Log In</Button>
                </Paper>            
            </div>
        )
    }
}

export default SignUpCard

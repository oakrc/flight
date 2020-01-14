import React, { Component } from 'react';
import { Paper, TextField, Button, } from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from 'axios';
import FuzzySearch from 'fuzzy-search';

import Select from '../Select';
import DatePick from '../DatePick';

import '../../css/components/Careers/Careers.scss';

export class Careers extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            email: '',
            password: '',
            confirmpwd: '',
            firstName: '',
            lastName: '',
            birthday: null,
            gender: '',
            phoneNumber: '',
            career: '',
            careers: [
                'Sr. Software Engineer - Walnut, CA',
                'Aircraft Support Mechanic - Walnut, CA',
                'Aircraft Maintenance Technician - Walnut, CA',
                'Sr. Repair Coordinator - Los Angeles, CA',
                'Director - Global Corporate Sales - Los Angeles, CA',
                'Principal Engineer - Walnut, CA',
                'Team Leader - Global Assistance - Walnut, CA',
                'Pre-flight Inspector - Los Angeles, CA',
                'Sr. Analyst - Los Angeles, CA',
                'Customer Service Agent - Los Angles, CA'
            ],
            resume: null,
            resumeTitle: null,

            firstNameValid: true,
            lastNameValid: true,
            genderEntered: true,
            emailValid: true,
            phoneNumberValid: true,
            careerValid: true,
            birthdayValid: true,

            display: false,
        }

        this.flightSearcher = new FuzzySearch(this.state.careers);
        this.signUp = this.signUp.bind(this);
        this.updateFile = this.updateFile.bind(this);
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
            if (value instanceof Date && !isNaN(value) && value.getFullYear() > 1909 && value.getFullYear() < 2005) {
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

    careerUpdate(e, value) {
        e.preventDefault();

        this.setState({
            career: value
        }, () => {
            if (value.length === 0) {
                this.setState({careerValid: false})
            } else {
                this.setState({careerValid: true})
            }
        })
    }

    updateFile(event) {
        this.setState({resume: event.target.files[0], resumeTitle: event.target.files[0].name})
    }

    signUp() {
        let firstNameValid = true;
        let lastNameValid = true;
        let genderEntered = true;
        let emailValid = true;
        let phoneNumberValid = true;
        let confirmpwdValid = true;
        let careerValid = true;
        let birthdayValid = true;

        if (this.state.firstName === '') {
            firstNameValid = false;
        }

        if (this.state.lastName === '') {
            lastNameValid = false;
        }

        if (this.state.birthday === null || !this.state.birthday instanceof Date) {
            birthdayValid = false;
        }

        if (this.state.gender.length === 0) {
            genderEntered = false;
        }

        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(this.state.email) || this.state.email.length === 0) {
            emailValid = false;
        }

        if (this.state.password !== this.state.confirmpwd || this.state.confirmpwd.length === 0) {
            confirmpwdValid = false;
        }

        if (this.state.phoneNumber.length !== 10 && (this.state.phoneNumber.length !== 11 && this.state.phoneNumber[0] !== '1')) {
            phoneNumberValid = false;
        }

        if (!this.state.career.replace(/\s/g, '').length) {
            careerValid = false;
        } 

        if (firstNameValid && lastNameValid && genderEntered && emailValid && phoneNumberValid) {
            axios.post('http://oak.hopto.org:3000/application', {
                first_name: this.state.firstName,
                last_name: this.state.lastName,
                birthday: this.state.birthday,
                gender: this.state.gender[0],
                phone_number: this.state.phoneNumber,
                email: this.state.email,
                resume: this.state.resume
            }, {headers: {'content-type': 'multipart/form-data'}, withCredentials: true})
            .then(response => {
                if (response.status === 200) {
                    this.setState({
                        email: '',
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
                        phoneNumberValid: true,
                    })
                }
            }).catch(error => {
                console.log(error);
            })
        }

        this.setState({firstNameValid: firstNameValid, lastNameValid: lastNameValid, birthdayValid: birthdayValid, genderEntered: genderEntered, emailValid: emailValid, confirmpwdValid: confirmpwdValid, phoneNumberValid: phoneNumberValid, careerValid: careerValid});
    }

    render() {
        return (
            <div className={`Careers ${this.state.display ? 'shownnozfast' : 'hiddenfast'}`}>
                <Paper elevation={5}>
                    <h1>Apply for a Career</h1>
                    <div className="half-field">
                        <TextField error={!this.state.firstNameValid} label="First name" variant="outlined" value={this.state.firstName} onChange={(e) => this.updateFName(e.target.value)}/>
                        <TextField error={!this.state.lastNameValid} label="Last name" variant="outlined" value={this.state.lastName} onChange={(e) => this.updateLName(e.target.value)}/>
                    </div>
                    <div className="half-field">
                        <DatePick label="Birthdate" value={this.state.birthday} updater={(e, date) => {this.updateBirthday(e, date)}} error={!this.state.birthdayValid} minDate={new Date('1910-12-31')} maxDate={new Date('2004-01-01')}/>
                        <Select error={!this.state.genderEntered} label="Gender" variant="outlined" curr={this.state.gender} options={["Male", "Female", "Other", "Prefer not to say"]} updater={(e, option) => this.updateGender(e, option)}/>
                    </div>
                    <TextField type="tel" label="Phone Number" variant="outlined" value={this.state.phoneNumber} onChange={(e) => this.updatePhoneNumber(e.target.value)} error={!this.state.phoneNumberValid}/>
                    <TextField type="email" label="Email" variant="outlined" value={this.state.email} onChange={(e) => this.updateEmail(e.target.value)} error={!this.state.emailValid}/>
                    <Autocomplete disableClearable autoHighlight autoComplete autoSelect filterOptions={(options, {inputValue}) => this.flightSearcher.search(inputValue)} options={this.state.careers} value={this.state.career} onChange={(e, value) => {this.careerUpdate(e, value)}} renderInput={params => (<TextField {...params} error={!this.state.careerValid} type="text" label="Careers" variant="outlined"/>)}></Autocomplete>
                    <Button
                        variant="contained"
                        component="label"
                        >
                        Upload File
                        <input
                            type="file"
                            style={{ display: "none" }}
                            onChange={this.updateFile}
                        />
                    </Button>
                    {this.state.resume !== null ? <p className="resumeTitle">{this.state.resumeTitle}</p> : null}
                    <Button className="submitButton" variant="contained" color="primary" onClick={this.signUp}>Submit</Button>
                </Paper>            
            </div>
        )
    }
}

export default Careers
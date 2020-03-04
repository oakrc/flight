import React, { Component } from 'react';
import FuzzySearch from 'fuzzy-search';
import axios from 'axios';

import { Paper, TextField, Button, } from "@material-ui/core";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Alert } from '@material-ui/lab';

import Select from '../Select';
import DatePick from '../DatePick';
import DelayLink from '../DelayLink';
import '../../css/components/LogIn/LogInAndDashboard.scss';

export class Purchase extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
            currentPassenger: 1,
            passengerRequestData: [],
            email: '',
            firstName: '',
            lastName: '',
            birthday: null,
            gender: '',
            phoneNumber: '',
            address1: '',
            address2: '',
            city: '',
            state: '',
            postal: '',

            firstNameValid: true,
            lastNameValid: true,
            birthdayValid: true,
            genderEntered: true,
            emailValid: true,
            phoneNumberValid: true,
            address1Valid: true,
            cityValid: true,
            stateValid: true,
            postalValid: true,

            states: [
                'AK', 'AL', 'AR', 'AS', 'AZ', 'CA', 'CO', 'CT', 'DC', 'DE', 'FL', 'GA', 'GU', 'HI', 'IA', 'ID', 'IL', 'IN', 'KS', 'KY', 'LA', 'MA', 'MD', 'ME', 'MI', 'MN', 'MO', 'MP', 'MS', 'MT', 'NC', 'ND', 'NE', 'NH', 'NJ', 'NM', 'NV', 'NY', 'OH', 'OK', 'OR', 'PA', 'PR', 'RI', 'SC', 'SD', 'TN', 'TX', 'UM', 'UT', 'VA', 'VI', 'VT', 'WA', 'WI', 'WV', 'WY'
            ],

            paid: false,
            adultsCorrect: true

        }

        this.back = this.back.bind(this)
        this.stateSearcher = new FuzzySearch(this.state.states);
        this.signUp = this.signUp.bind(this);
    }

    componentDidMount() {
        let emptyObj = [];
        if (this.props.flightData.length !== 0) {
            for (let i = 0; i < this.props.flightData[0][1].passengers; i++) {
                emptyObj.push({
                    firstName: '',
                    lastName: '',
                    gender: '',
                    email: '',
                    phoneNumber: '',
                    birthday: null,
                    address1: '',
                    address2: '',
                    city: '',
                    state: '',
                    postal: '',
                });
            }
            this.setState({passengerRequestData: emptyObj});
        }
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
            if (value instanceof Date && !isNaN(value) && value.getFullYear() > 1909) {
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

    updateAddress1(value) {
        if (value.length === 0) {
            this.setState({address1: value, address1Valid: false})
        } else {
            this.setState({address1: value, address1Valid: true})
        }
    }

    updateAddress2(value) {
        this.setState({address2: value})
    }
    
    updateCity(value) {
        if (value.length === 0) {
            this.setState({city: value, cityValid: false})
        } else {
            this.setState({city: value, cityValid: true})
        }
    }

    updateState(e, value) {
        e.preventDefault();
        if (value.length === 2) {
            this.setState({state: value, stateValid: true})
        } else {
            this.setState({state: value, stateValid: false})
        }
    }

    updatePostal(value) {
        if (value.length !== 5) {
            this.setState({postal: value, postalValid: false})
        } else {
            this.setState({postal: value, postalValid: true})
        }
    }

    signUp() {
        let firstNameValid = true;
        let lastNameValid = true;
        let birthdayValid = false;
        let genderEntered = true;
        let emailValid = true;
        let phoneNumberValid = true;
        let address1Valid = true;
        let cityValid = true;
        let stateValid = true;
        let postalValid = true;

        if (this.state.firstName === '') {
            firstNameValid = false;
        }

        if (this.state.lastName === '') {
            lastNameValid = false;
        }

        if (this.state.birthday instanceof Date && !isNaN(this.state.birthday) && this.state.birthday.getFullYear() > 1909) {
            birthdayValid = true;
        }

        if (this.state.gender.length === 0) {
            genderEntered = false;
        }

        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(this.state.email) || this.state.email.length === 0) {
            emailValid = false;
        }

        if (this.state.phoneNumber.length !== 10 && (this.state.phoneNumber.length !== 11 && this.state.phoneNumber[0] !== '1')) {
            phoneNumberValid = false;
        }

        if (this.state.address1.length === 0) {
            address1Valid = false;
        }

        if (this.state.city.length === 0) {
            cityValid = false;
        }

        if (this.state.postal.length !== 5) {
            postalValid = false;
        }

        if (this.state.state.length === 0) {
            stateValid = false;
        }

        if (firstNameValid && lastNameValid && birthdayValid && genderEntered && emailValid && phoneNumberValid && address1Valid && cityValid && postalValid && stateValid) {
            this.state.passengerRequestData[this.state.currentPassenger - 1] = {
                firstName: this.state.firstName,
                lastName: this.state.lastName,
                gender: this.state.gender,
                email: this.state.email,
                phoneNumber: this.state.phoneNumber,
                birthday: this.state.birthday,
                address1: this.state.address1,
                address2: this.state.address2,
                city: this.state.city,
                state: this.state.state,
                postal: this.state.postal,
            }
            this.forceUpdate()
            
            if (this.state.currentPassenger === this.props.flightData[0][1].passengers) {
                let adultsPresent = this.props.flightData[1][1].adults;
                let adultsSubmitted = 0;
                for (let i = 0; i < this.props.flightData[0][1].passengers; i++) {
                    if (this.state.passengerRequestData[i].birthday < new Date().setFullYear(new Date().getFullYear() - 18)) {
                        adultsSubmitted++;
                    }
                }

                if (adultsSubmitted === adultsPresent) {
                    this.setState({
                        firstName: '',
                        lastName: '',
                        gender: '',
                        email: '',
                        phoneNumber: '',
                        birthday: null,
                        address1: '',
                        address2: '',
                        city: '',
                        state: '',
                        postal: '',
                        paid: true,
                        adultsCorrect: true
                    }, () => {
                        for (let i = 0; i < this.props.flightData[0][1].passengers; i++) {
                            axios.put('/api/ticket', {
                                fl_id: this.props.flightData[0][0].fl_id,
                                af_id: this.props.flightData[0][0].af_id,
                                first_name: this.state.passengerRequestData[i].firstName,
                                last_name: this.state.passengerRequestData[i].lastName,
                                gender: this.state.passengerRequestData[i].gender[0],
                                email: this.state.passengerRequestData[i].email,
                                phone: this.state.passengerRequestData[i].phoneNumber,
                                birthday: this.state.passengerRequestData[i].birthday,
                                addr1: this.state.passengerRequestData[i].address1,
                                addr2: this.state.passengerRequestData[i].address2,
                                city: this.state.passengerRequestData[i].city,
                                state: this.state.passengerRequestData[i].state,
                                postal: this.state.passengerRequestData[i].postal,
                            }, {withCredentials: true})
                            .then(response => {})
                            .catch(error => {})
                            
                            if (this.props.flightData.length === 2) {
                                axios.put('/api/ticket', {
                                    fl_id: this.props.flightData[1][0].fl_id,
                                    af_id: this.props.flightData[1][0].af_id,
                                    first_name: this.state.passengerRequestData[i].firstName,
                                    last_name: this.state.passengerRequestData[i].lastName,
                                    gender: this.state.passengerRequestData[i].gender[0],
                                    email: this.state.passengerRequestData[i].email,
                                    phone: this.state.passengerRequestData[i].phoneNumber,
                                    birthday: this.state.passengerRequestData[i].birthday,
                                    addr1: this.state.passengerRequestData[i].address1,
                                    addr2: this.state.passengerRequestData[i].address2,
                                    city: this.state.passengerRequestData[i].city,
                                    state: this.state.passengerRequestData[i].state,
                                    postal: this.state.passengerRequestData[i].postal,
                                }, {withCredentials: true})
                                .then(response => {})
                                .catch(error => {})
                            }
                        }
                    })
                    setTimeout(() => {
                        alert('As for this is a mock website for FBLA Web Design, we will not be taking any actual payments. However, We will still process your order for your (pretend) flight.');
                    }, 1500)
                } else {
                    this.setState({adultsCorrect: false})
                }
            } else {
                this.setState({
                    firstName: this.state.passengerRequestData[this.state.currentPassenger].firstName,
                    lastName: this.state.passengerRequestData[this.state.currentPassenger].lastName,
                    gender: this.state.passengerRequestData[this.state.currentPassenger].gender,
                    email: this.state.passengerRequestData[this.state.currentPassenger].email,
                    phoneNumber: this.state.passengerRequestData[this.state.currentPassenger].phoneNumber,
                    birthday: this.state.passengerRequestData[this.state.currentPassenger].birthday,
                    address1: this.state.passengerRequestData[this.state.currentPassenger].address1,
                    address2: this.state.passengerRequestData[this.state.currentPassenger].address2,
                    city: this.state.passengerRequestData[this.state.currentPassenger].city,
                    state: this.state.passengerRequestData[this.state.currentPassenger].state,
                    postal: this.state.passengerRequestData[this.state.currentPassenger].postal,
                    currentPassenger: this.state.currentPassenger + 1,
                })
            }
        }
        this.setState({firstNameValid: firstNameValid, lastNameValid: lastNameValid, birthdayValid: birthdayValid, genderEntered: genderEntered, emailValid: emailValid, phoneNumberValid: phoneNumberValid, address1Valid: address1Valid, cityValid: cityValid, stateValid: stateValid, postalValid: postalValid});
    }

    back() {
        let firstNameValid = true;
        let lastNameValid = true;
        let birthdayValid = true;
        let genderEntered = true;
        let emailValid = true;
        let phoneNumberValid = true;
        let address1Valid = true;
        let cityValid = true;
        let stateValid = true;
        let postalValid = true;

        this.state.passengerRequestData[this.state.currentPassenger - 1] = {
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            gender: this.state.gender,
            email: this.state.email,
            phoneNumber: this.state.phoneNumber,
            birthday:  this.state.birthday,
            address1: this.state.address1,
            address2: this.state.address2,
            city: this.state.city,
            state: this.state.state,
            postal: this.state.postal,
        }
        this.forceUpdate()

        this.setState({
            firstName: this.state.passengerRequestData[this.state.currentPassenger - 2].firstName,
            lastName: this.state.passengerRequestData[this.state.currentPassenger - 2].lastName,
            gender: this.state.passengerRequestData[this.state.currentPassenger - 2].gender,
            email: this.state.passengerRequestData[this.state.currentPassenger - 2].email,
            phoneNumber: this.state.passengerRequestData[this.state.currentPassenger - 2].phoneNumber,
            birthday: this.state.passengerRequestData[this.state.currentPassenger - 2].birthday,
            address1: this.state.passengerRequestData[this.state.currentPassenger - 2].address1,
            address2: this.state.passengerRequestData[this.state.currentPassenger - 2].address2,
            city: this.state.passengerRequestData[this.state.currentPassenger - 2].city,
            state: this.state.passengerRequestData[this.state.currentPassenger - 2].state,
            postal: this.state.passengerRequestData[this.state.currentPassenger - 2].postal,
            currentPassenger: this.state.currentPassenger - 1,
        })

        this.setState({firstNameValid: firstNameValid, lastNameValid: lastNameValid, birthdayValid: birthdayValid, genderEntered: genderEntered, emailValid: emailValid, phoneNumberValid: phoneNumberValid, address1Valid: address1Valid, cityValid: cityValid, stateValid: stateValid, postalValid: postalValid});
    }

    render() {
        return (
            <div>
                { this.props.flightData.length === 0 || this.props.flightData === undefined ?
                <div className="Redirect" onClick={this.props.showOption}>
                    <DelayLink style={{textDecoration: 'none', color: 'inherit'}} to='/'>Click <u>Here</u> to Book A Flight!</DelayLink>
                </div>
                :
                <div className="LogIn Purchase">
                    <Paper elevation={5}>
                        <h1>Book Your Flight</h1>
                        <div className="third-field">
                            <TextField className="spaceTaken" error={!this.state.firstNameValid} label="First name" variant="outlined" value={this.state.firstName} onChange={(e) => this.updateFName(e.target.value)}/>
                            <TextField className="spaceTaken" error={!this.state.lastNameValid} label="Last name" variant="outlined" value={this.state.lastName} onChange={(e) => this.updateLName(e.target.value)}/>
                            <DatePick className="spaceGot" disableFuture label="Birthdate" value={this.state.birthday} updater={(e, date) => {this.updateBirthday(e, date)}} error={!this.state.birthdayValid} minDate={new Date('1910-12-31')}/>
                        </div>
                        <div className="third-field">
                            <Select error={!this.state.genderEntered} label="Gender" variant="outlined" curr={this.state.gender} options={["Male", "Female", "Other", "Prefer not to say"]} updater={(e, option) => this.updateGender(e, option)}/>
                            <TextField type="tel" label="Phone Number" variant="outlined" value={this.state.phoneNumber} onChange={(e) => this.updatePhoneNumber(e.target.value)} error={!this.state.phoneNumberValid}/>
                            <TextField type="email" label="Email" variant="outlined" value={this.state.email} onChange={(e) => this.updateEmail(e.target.value)} error={!this.state.emailValid}/>
                        </div>
                        <TextField label="Street Address" variant="outlined" value={this.state.address1} onChange={(e) => this.updateAddress1(e.target.value)} error={!this.state.address1Valid}/>
                        <TextField label="Street Address 2" variant="outlined" value={this.state.address2} onChange={(e) => this.updateAddress2(e.target.value)}/>
                        <div className="third-field">
                            <TextField label="City" variant="outlined" value={this.state.city} onChange={(e) => this.updateCity(e.target.value)} error={!this.state.cityValid}/>
                            <Autocomplete disableClearable autoHighlight autoComplete autoSelect filterOptions={(options, {inputValue}) => this.stateSearcher.search(inputValue)} options={this.state.states} value={this.state.state} onChange={(e, value) => {this.updateState(e, value)}} renderInput={params => (<TextField {...params} error={!this.state.stateValid} type="text" label="State&nbsp;" variant="outlined"/>)}></Autocomplete>
                            <TextField label="Postal Code" variant="outlined" value={this.state.postal} onChange={(e) => this.updatePostal(e.target.value)} error={!this.state.postalValid}/>
                        </div>
                        <div className={this.state.currentPassenger !== 1 ? 'half-field1' : 'payButton'} style={{justifyContent: (this.state.adultsCorrect || !this.state.paid) && 'flex-end'}}>
                            {this.state.currentPassenger !== 1 &&
                            <Button variant="contained" color="primary" onClick={this.back}>
                                Back
                            </Button>}
                            {!this.state.adultsCorrect && <Alert className="payButton" severity="error">{'Make sure that you have ' + this.props.flightData[1][1].adults + (this.props.flightData[1][1].adults > 1 ? ' adults' : ' adult') + ' and ' + (this.props.flightData[1][1].passengers - this.props.flightData[1][1].passengers) +  ' children/infants.'}</Alert>}
                            {this.state.paid && <Alert className="payButton" severity="success">Booked! Please check email for check-in code!</Alert>}
                            <Button variant="contained" color="primary" onClick={this.signUp}>
                            {this.state.currentPassenger < this.props.flightData[0][1].passengers ?
                                `Next Passenger (${this.state.currentPassenger}/${this.props.flightData[0][1].passengers})` :
                                'Pay'
                            }
                            </Button>
                        </div>
                    </Paper>            
                </div>
                }
            </div>
        )
    }
}

export default Purchase

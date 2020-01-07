import React, { Component } from 'react';
import Person from './Person';
import Select from '../Select';
import DatePick from '../DatePick';
import { TextField, Fab, Button, Paper, Fade } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import '../../css/components/BookAndLanding/FlightSearch.scss';
import OutsideAlerter from './OutsideAlerter';
import axios from 'axios';
import FuzzySearch from 'fuzzy-search';
import Autocomplete from '@material-ui/lab/Autocomplete';

class FlightSearch extends Component {
    constructor(props) {
        let arrDate = new Date();
        arrDate.setDate(arrDate.getDate() + 16);
        let depDate = new Date();
        depDate.setDate(depDate.getDate() + 14);

        super(props)
    
        this.state = {
            typeOfTrip: 'Round trip',
            Adults: 1,
            Children: 0,
            Infants: 0,
            departLocation: '',
            departDate: depDate,
            arriveLocation: '',
            arriveDate: arrDate,
            class: 'Economy',

            passengerShown: false,
            maxed: false,
            passengerPlural: false,

            departValid: true,
            arriveValid: true,
            departDateValid: true,
            arriveDateValid: true,

            airportNames: [
                'Boeing Field King County (BFI)',
                'Boise Air Terminal/Gowen Field (BOI)',
                'Spokane (GEG)',
                'Daniel K Inouye (HNL)',
                'McCarran - Las Vegas (LAS)',
                'Los Angeles (LAX)',
                'Metropolitan Oakland (OAK)',
                'Ontario (ONT)',
                'Portland (PDX)',
                'Phoenix Sky Harbor (PHX)',
                'Reno Tahoe (RNO)',
                'San Diego (SAN)',
                'Seattle Tacoma (SEA)',
                'San Francisco (SFO)',
                'Norman Y. Mineta San Jose (SJC)',
                'Salt Lake City (SLC)',
                'Sacramento (SMF)',
                'John Wayne Airport - Orange County (SNA)',
                'Tucson (TUS)',
            ],
            departSearchResult: '',
        }

        this.flightSearcher = new FuzzySearch(this.state.airportNames);
        this.changePassenger = this.changePassenger.bind(this);
        this.togglePassengers = this.togglePassengers.bind(this);
        this.dDateUpdate = this.dDateUpdate.bind(this);
        this.aDateUpdate = this.aDateUpdate.bind(this);
        this.searchFlights = this.searchFlights.bind(this);

    }

    togglePassengers() {
        this.setState((prevState) => ({passengerShown: !prevState.passengerShown}))
    }

    changePassenger(e, type, amount) {
        if (type === "Adults" && (amount >= 1 || amount.length === 0) && amount <= 9) {
            this.setState((prevState) => ({
                [type]: amount
            }), () => {
                if (Number(this.state.Adults) + Number(this.state.Children) + Number(this.state.Infants) === 9) {
                    this.setState({
                        maxed: true,
                        passengerPlural: true
                    })
                } else {
                    if (Number(this.state.Adults) + Number(this.state.Children) + Number(this.state.Infants) !== 1) {
                        this.setState({
                            maxed: false,
                            passengerPlural: true
                        })
                    } else {
                        this.setState({
                            maxed: false,
                            passengerPlural: false
                        })
                    }
                }
            })
        } else if (type !== "Adults" && amount >= 0 && amount <= 8) {
            this.setState((prevState) => ({
                [type]: amount
            }), () => {
                if (Number(this.state.Adults) + Number(this.state.Children) + Number(this.state.Infants) === 9) {
                    this.setState({
                        maxed: true,
                        passengerPlural: true
                    })
                } else {
                    if (Number(this.state.Adults) + Number(this.state.Children) + Number(this.state.Infants) !== 1) {
                        this.setState({
                            maxed: false,
                            passengerPlural: true
                        })
                    } else {
                        this.setState({
                            maxed: false,
                            passengerPlural: false
                        })
                    }
                }
            })
        }
    }

    changeTrip(e, option) {
        e.preventDefault();

        this.setState({typeOfTrip: option})
    }

    changeClass(e, option) {
        e.preventDefault();

        this.setState({class: option})
    } 

    departUpdate(e, value) {
        e.preventDefault();

        this.setState({
            departLocation: value
        }, () => {
            if (value.length === 0) {
                this.setState({departValid: false})
            } else {
                this.setState({departValid: true})
            }
        })
    }

    arriveUpdate(e, value) {
        e.preventDefault();

        this.setState({
            arriveLocation: value
        }, () => {
            if (value.length === 0) {
                this.setState({arriveValid: false})
            } else {
                this.setState({arriveValid: true})
            }
        })
    }

    dDateUpdate(value, e) {
        if (value === null) {
            this.setState({departDate: '', departDateValid: false})
        } else {
            this.setState({departDate: value, departDateValid: true})
        }
    }

    aDateUpdate(value, e) {
        if (value === null) {
            this.setState({arriveDate: '', arriveDateValid: false})
        } else {
            this.setState({arriveDate: value, arriveDateValid: true})
        }
    }

    searchFlights() {
        if (!this.state.departLocation.replace(/\s/g, '').length) {
            this.setState({
                departValid: false, 
                departLocation: ''
            })
        } 
        
        if (!this.state.arriveLocation.replace(/\s/g, '').length || (this.state.departLocation === this.state.arriveLocation)) {
            this.setState({
                arriveValid: false, 
                arriveLocation: ''
            })
        }

        if (this.state.arriveLocation.replace(/\s/g, '').length && this.state.departLocation.replace(/\s/g, '').length && (this.state.departLocation !== this.state.arriveLocation) && (this.state.departDate instanceof Date && !isNaN(this.state.departDate) && this.state.departDateValid) && (this.state.arriveDate instanceof Date && !isNaN(this.state.arriveDate) && this.state.arriveDateValid)) {
            axios({
                method: 'get',
                url: 'http://oak.hopto.org:3000/flight',
                params: {
                    passengers: Number(this.state.Adults) + Number(this.state.Children) + Number(this.state.Infants),
                    depart: this.state.departLocation.slice(-4, -1),
                    arrive: this.state.arriveLocation.slice(-4, -1),
                    date: this.state.departDate,
                    cabin: this.state.class.charAt(0)
                }
            })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    }

    resetError(value) {
        this.setState({[value]: true})
    }

    render() {

        return (
            <div>
                <div className="FlightSearch">
                        <div className="Top">
                            <Select curr={this.state.typeOfTrip} options={["Round trip", "One way", "Multi-city"]} updater={(e, option) => this.changeTrip(e, option)}/>
                            <Select curr={this.state.class} options={["Economy", "Business", "First Class"]} updater={(e, option) => this.changeClass(e, option)}/>
                            <OutsideAlerter condition={this.state.passengerShown} effect={this.togglePassengers}>
                                <div className="Vertical">
                                    <Button endIcon={<ArrowDropDownIcon />} onClick={this.togglePassengers}>{Number(this.state.Adults) + Number(this.state.Children) + Number(this.state.Infants)} Passenger{this.state.passengerPlural && 's'}</Button>
                                    <Fade in={this.state.passengerShown}>
                                            <Paper>
                                                <Person addDisabled={this.state.maxed} amount={this.state.Adults} type="Adults" updater={(type, change, amount) => this.changePassenger(type, change, amount)}/>
                                                <Person addDisabled={this.state.maxed} amount={this.state.Children} type="Children" updater={(type, change, amount) => this.changePassenger(type, change, amount)}/>
                                                <Person addDisabled={this.state.maxed} amount={this.state.Infants} type="Infants" updater={(type, change, amount) => this.changePassenger(type, change, amount)}/>
                                                <br></br>
                                                <p className={`sidenote ${this.state.maxed && 'sidenote-red'}`}>Maximum of 9 Passengers, at least one adult</p>
                                            </Paper>
                                    </Fade>
                                </div>
                            </OutsideAlerter>
                        </div>
                        <div className="Middle">
                            <Autocomplete disableClearable autoHighlight autoComplete autoSelect filterOptions={(options, {inputValue}) => this.flightSearcher.search(inputValue)} options={this.state.airportNames} value={this.state.departLocation} onChange={(e, value) => {this.departUpdate(e, value)}} renderInput={params => (<TextField {...params} onClick={() => this.resetError('departValid')} error={!this.state.departValid} className="Depart" type="text" label="Depart" variant="outlined"/>)}></Autocomplete>
                            <Autocomplete disableClearable autoHighlight autoComplete autoSelect filterOptions={(options, {inputValue}) => this.flightSearcher.search(inputValue)} options={this.state.airportNames} value={this.state.arriveLocation} onChange={(e, value) => {this.arriveUpdate(e, value)}} renderInput={params => (<TextField {...params} onClick={() => this.resetError('arriveValid')} error={!this.state.arriveValid} className="Arrive" type="text" label="Arrive" variant="outlined"/>)}></Autocomplete>
                            <DatePick disablePast label="Depart date    " value={this.state.departDate} updater={(e, date) => this.dDateUpdate(e, date)} error={!this.state.departDateValid}/>
                            <DatePick disablePast label="Return date  " value={this.state.arriveDate} updater={(e, date) => {this.aDateUpdate(e, date)}} error={!this.state.arriveDateValid}/>
                        </div>
                </div>
                <div className="Bottom">
                    <Fab onClick={this.searchFlights} color="primary" variant="extended">
                        <SearchIcon/>
                        Find Flights
                    </Fab>
                </div>
            </div>
        )
    }
}

export default FlightSearch

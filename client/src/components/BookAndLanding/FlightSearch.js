import React, { Component } from 'react';
import FuzzySearch from 'fuzzy-search';
import axios from 'axios';

import { Alert } from '@material-ui/lab';
import { TextField, Fab, Button, Paper, Fade } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Autocomplete from '@material-ui/lab/Autocomplete';

import '../../css/components/BookAndLanding/FlightSearch.scss';
import Person from './Person';
import Select from '../Select';
import DatePick from '../DatePick';
import OutsideAlerter from './OutsideAlerter';

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
            arriveDateShow: true,

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

            loggedIn: true,
            searched: false
        }

        this.flightSearcher = new FuzzySearch(this.state.airportNames);
        this.changePassenger = this.changePassenger.bind(this);
        this.togglePassengers = this.togglePassengers.bind(this);
        this.dDateUpdate = this.dDateUpdate.bind(this);
        this.aDateUpdate = this.aDateUpdate.bind(this);
        this.searchFlights = this.searchFlights.bind(this);

    }

    componentDidMount() {
        axios.get('/api/user', {withCredentials: true})
        .then((response) => {
          response.status === 200 && this.setState({loggedIn: true})
        })
        .catch((error) => {
          try {
            error.response.status === 401 && this.setState({loggedIn: false})
          } catch {
    
          }
        });
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
        this.setState({typeOfTrip: option}, () => {
            if (this.state.typeOfTrip === 'Round trip') {
                this.setState({arriveDateShow: true})
            } else {
                this.setState({arriveDateShow: false})
            }
        })
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
            if (new Date(value) instanceof Date && new Date(value) > new Date().setDate(new Date().getDate() - 1) && new Date(value).getFullYear() < 2022) {
                this.setState({departDate: value, departDateValid: true})
            } else {
                this.setState({departDate: value, departDateValid: false})
            }
        }
    }

    aDateUpdate(value, e) {
        if (value === null) {
            this.setState({arriveDate: '', arriveDateValid: false})
        } else {
            if (new Date(value) instanceof Date && new Date(value) > new Date().setDate(new Date().getDate() - 1) && new Date(value).getFullYear() < 2022 && new Date(value) >= new Date(this.state.departDate)) {
                this.setState({arriveDate: value, arriveDateValid: true})
            } else {
                this.setState({arriveDate: value, arriveDateValid: false})
            }
        }
    }

    searchFlights() {
        this.setState({searched: true});
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

        if (new Date(this.state.arriveDate) < new Date(this.state.departDate)) {
            this.setState({ arriveDateValid: false })
        }

        if (this.state.arriveLocation.replace(/\s/g, '').length && this.state.departLocation.replace(/\s/g, '').length && (this.state.departLocation !== this.state.arriveLocation) && (new Date(this.state.departDate) instanceof Date && new Date(this.state.departDate) > new Date().setDate(new Date().getDate() - 1) && new Date(this.state.departDate).getFullYear() < 2022) && (new Date(this.state.arriveDate) instanceof Date && new Date(this.state.arriveDate) > new Date().setDate(new Date().getDate() - 1) && new Date(this.state.arriveDate).getFullYear() < 2022) && new Date(this.state.arriveDate) > new Date(this.state.departDate) && this.state.loggedIn) {            
            axios({
                method: 'get',
                url: '/api/flight',
                params: {
                    passengers: Number(this.state.Adults) + Number(this.state.Children) + Number(this.state.Infants),
                    depart: this.state.departLocation.slice(-4, -1),
                    arrive: this.state.arriveLocation.slice(-4, -1),
                    date: new Date(this.state.departDate).toISOString(),
                    cabin: this.state.class.charAt(0)
                }
            })
            .then(response => {
                if (response.status === 200) {
                    this.props.flightQueryOK(response.data, {
                        departDate: this.state.departDate, 
                        arriveDate: this.state.arriveDate,
                        departLocation: this.state.departLocation,
                        arriveLocation: this.state.arriveLocation,
                        typeOfTrip: this.state.typeOfTrip,
                        passengers: this.state.Adults + this.state.Children + this.state.Infants
                    });
                }
            })
            .catch(error => {
            });
            
            if (this.state.typeOfTrip === 'Round trip') {
                axios({
                    method: 'get',
                    url: '/api/flight',
                    params: {
                        passengers: Number(this.state.Adults) + Number(this.state.Children) + Number(this.state.Infants),
                        depart: this.state.arriveLocation.slice(-4, -1),
                        arrive: this.state.departLocation.slice(-4, -1),
                        date: new Date(this.state.arriveDate).toISOString(),
                        cabin: this.state.class.charAt(0)
                    }
                })
                .then(response => {
                    if (response.status === 200) {
                        this.props.roundFlightQueryOK(response.data, {
                            departDate: this.state.arriveDate, 
                            arriveDate: this.state.departDate,
                            departLocation: this.state.arriveLocation,
                            arriveLocation: this.state.departLocation,
                            typeOfTrip: this.state.typeOfTrip,
                            passengers: this.state.Adults + this.state.Children + this.state.Infants,
                            adults: this.state.Adults
                        });
                    }
                })
                .catch(error => {
                });
            }
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
                            <Select curr={this.state.typeOfTrip} options={["Round trip", "One way"]} updater={(e, option) => this.changeTrip(e, option)}/>
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
                                                <p className={`sidenote ${this.state.maxed && 'sidenote-red'}`}>Maximum of 9 Passengers, <br></br>at least one adult</p>
                                            </Paper>
                                    </Fade>
                                </div>
                            </OutsideAlerter>
                        </div>
                        <div className="Middle">
                            <Autocomplete disableClearable autoHighlight autoComplete autoSelect filterOptions={(options, {inputValue}) => this.flightSearcher.search(inputValue)} options={this.state.airportNames} value={this.state.departLocation} onChange={(e, value) => {this.departUpdate(e, value)}} renderInput={params => (<TextField {...params} onClick={() => this.resetError('departValid')} error={!this.state.departValid} className="Depart" type="text" label="Depart&nbsp;" variant="outlined"/>)}></Autocomplete>
                            <Autocomplete disableClearable autoHighlight autoComplete autoSelect filterOptions={(options, {inputValue}) => this.flightSearcher.search(inputValue)} options={this.state.airportNames} value={this.state.arriveLocation} onChange={(e, value) => {this.arriveUpdate(e, value)}} renderInput={params => (<TextField {...params} onClick={() => this.resetError('arriveValid')} error={!this.state.arriveValid} className="Arrive" type="text" label="Arrive&nbsp;" variant="outlined"/>)}></Autocomplete>
                            <DatePick className='Date' disablePast label="Depart date&nbsp;&nbsp;" value={this.state.departDate} updater={(e, date) => this.dDateUpdate(e, date)} error={!this.state.departDateValid} minDate={new Date().setDate(new Date().getDate() - 1)} maxDate={new Date('2022-01-01')}/>
                            <DatePick className={!this.state.arriveDateShow ? 'hiddenfandis Date' : 'shownnozfast Date'} disablePast label="Return date&nbsp;&nbsp;" value={this.state.arriveDate} updater={(e, date) => this.aDateUpdate(e, date)} error={!this.state.arriveDateValid} minDate={new Date().setDate(new Date().getDate() - 1)} maxDate={new Date('2022-01-01')}/>
                        </div>
                        {!this.state.loggedIn && this.state.searched && <Alert severity="info" style={{marginTop: '1.5vh', width: '50vw', padding: '0', backgroundColor: 'transparent'}}>Please Sign Up / Log In First!</Alert>}
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

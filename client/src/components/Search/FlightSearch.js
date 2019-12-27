import React, { Component } from 'react';
import Person from './Person';
import Select from './Select';
import DatePick from './DatePick';
import { TextField, Fab, Button, Paper, Fade } from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import '../../css/FlightSearch.scss';
import OutsideAlerter from '../OutsideAlerter';
import axios from 'axios';

class FlightSearch extends Component {
    constructor(props) {
        let arrDate = new Date();
        arrDate.setDate(arrDate.getDate() + 2);

        super(props)
    
        this.state = {
            typeOfTrip: 'Round trip',
            Adults: 1,
            Children: 0,
            Infants: 0,
            departLocation: '',
            departDate: new Date(),
            arriveLocation: '',
            arriveDate: arrDate,
            class: 'Economy',

            passengerShown: false,
            maxed: false,
            passengerPlural: false,

            departValid: true,
            arriveValid: true,
        }

        this.changePassenger = this.changePassenger.bind(this);
        this.togglePassengers = this.togglePassengers.bind(this);
        this.dDateUpdate = this.dDateUpdate.bind(this);
        this.aDateUpdate = this.aDateUpdate.bind(this);
        this.searchFlights = this.searchFlights.bind(this);

    }

    togglePassengers() {
        this.setState((prevState) => ({
            passengerShown: !prevState.passengerShown
        }))
    }

    changePassenger(e, type, amount) {
        if (type === "Adults" && (amount >= 1 || amount.length == 0) && amount <= 9) {
            this.setState((prevState) => ({
                [type]: amount
            }), () => {
                if (Number(this.state.Adults) + Number(this.state.Children) + Number(this.state.Infants) == 9) {
                    this.setState({
                        maxed: true,
                        passengerPlural: true
                    })
                } else {
                    if (Number(this.state.Adults) + Number(this.state.Children) + Number(this.state.Infants) != 1) {
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
                if (Number(this.state.Adults) + Number(this.state.Children) + Number(this.state.Infants) == 9) {
                    this.setState({
                        maxed: true,
                        passengerPlural: true
                    })
                } else {
                    if (Number(this.state.Adults) + Number(this.state.Children) + Number(this.state.Infants) != 1) {
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

        this.setState({
            typeOfTrip: option
        })
    }

    changeClass(e, option) {
        e.preventDefault();

        this.setState({
            class: option
        })
    } 

    departUpdate(e, value) {
        e.preventDefault();

        this.setState({
            departLocation: value
        }, () => {
            if (value.length == 0) {
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
            if (value.length == 0) {
                this.setState({arriveValid: false})
            } else {
                this.setState({arriveValid: true})
            }
        })
    }

    dDateUpdate(value, e) {
        this.setState({
            departDate: value
        })
    }

    aDateUpdate(value, e) {
        this.setState({
            arriveDate: value
        })
    }

    searchFlights() {
        if (this.state.departLocation.length == 0) {
            this.setState({departValid: false})
        }

        if (this.state.arriveLocation.length == 0) {
            this.setState({arriveValid: false})
        }
    }

    render() {

        return (
            <div>
                <div className="FlightSearch">
                        <div className="Top">
                            <Select curr={this.state.typeOfTrip} options={["Round trip", "One way", "Multi-city"]} updater={(e, option) => this.changeTrip(e, option)}/>
                            <Select curr={this.state.class} options={["Economy", "Business", "1st Class"]} updater={(e, option) => this.changeClass(e, option)}/>
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
                            <TextField error={!this.state.departValid} className="Depart" type="text" id="outlined-basic" label="Depart" variant="outlined" value={this.state.departLocation} onChange={(e) => {this.departUpdate(e, e.target.value)}}/>
                            <TextField error={!this.state.arriveValid} className="Arrive" type="text" id="outlined-basic" label="Arrive" variant="outlined" value={this.state.arriveLocation} onChange={(e) => {this.arriveUpdate(e, e.target.value)}}/>
                            <DatePick label="Depart date" value={this.state.departDate} updater={(e, date) => this.dDateUpdate(e, date)}/>
                            <DatePick label="Arrive (back) date" value={this.state.arriveDate} updater={(e, date) => {this.aDateUpdate(e, date)}}/>
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

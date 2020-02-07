import React, { Component } from 'react';
import FuzzySearch from 'fuzzy-search';
import axios from 'axios';

import { TextField, Fab} from "@material-ui/core";
import SearchIcon from '@material-ui/icons/Search';
import Autocomplete from '@material-ui/lab/Autocomplete';

import '../../css/components/BookAndLanding/FlightSearch.scss';
import DatePick from '../DatePick';

class FlightSearch extends Component {
    constructor(props) {
        let arrDate = new Date();
        arrDate.setDate(arrDate.getDate() + 16);
        let depDate = new Date();
        depDate.setDate(depDate.getDate() + 14);

        super(props)
    
        this.state = {
            departLocation: '',
            departDate: depDate,
            arriveLocation: '',
            arriveDate: arrDate,

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
        this.dDateUpdate = this.dDateUpdate.bind(this);
        this.aDateUpdate = this.aDateUpdate.bind(this);
        this.searchFlights = this.searchFlights.bind(this);

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

        if (this.state.arriveLocation.replace(/\s/g, '').length && this.state.departLocation.replace(/\s/g, '').length && (this.state.departLocation !== this.state.arriveLocation) && (new Date(this.state.departDate) instanceof Date && new Date(this.state.departDate) > new Date().setDate(new Date().getDate() - 1) && new Date(this.state.departDate).getFullYear() < 2022) && (new Date(this.state.arriveDate) instanceof Date && new Date(this.state.arriveDate) > new Date().setDate(new Date().getDate() - 1) && new Date(this.state.arriveDate).getFullYear() < 2022) && new Date(this.state.arriveDate) > new Date(this.state.departDate)) {
            axios({
                method: 'get',
                url: 'https://westflightairlines.com/api/sched',
                params: {
                    depart: this.state.departLocation.slice(-4, -1),
                    arrive: this.state.arriveLocation.slice(-4, -1),
                    date: new Date(this.state.departDate).toISOString(),
                }
            })
            .then(response => {
                if (response.status === 200) {
                    this.props.flightQueryOK(response.data, {
                        departDate: this.state.departDate, 
                        arriveDate: this.state.arriveDate,
                        departLocation: this.state.departLocation,
                        arriveLocation: this.state.arriveLocation
                    });
                }
            })
            .catch(error => {
                console.log(error);
            });
        }
    }

    resetError(value) {
        this.setState({[value]: true})
    }

    render() {

        return (
            <div class="FlightSched">
                <div className="Title">
                    <h2>Flight Schedules</h2>
                </div>
                <div className="FlightSearch">
                    <div className="Middle">
                        <Autocomplete disableClearable autoHighlight autoComplete autoSelect filterOptions={(options, {inputValue}) => this.flightSearcher.search(inputValue)} options={this.state.airportNames} value={this.state.departLocation} onChange={(e, value) => {this.departUpdate(e, value)}} renderInput={params => (<TextField {...params} onClick={() => this.resetError('departValid')} error={!this.state.departValid} className="Depart" type="text" label="Depart&nbsp;" variant="outlined"/>)}></Autocomplete>
                        <Autocomplete disableClearable autoHighlight autoComplete autoSelect filterOptions={(options, {inputValue}) => this.flightSearcher.search(inputValue)} options={this.state.airportNames} value={this.state.arriveLocation} onChange={(e, value) => {this.arriveUpdate(e, value)}} renderInput={params => (<TextField {...params} onClick={() => this.resetError('arriveValid')} error={!this.state.arriveValid} className="Arrive" type="text" label="Arrive&nbsp;" variant="outlined"/>)}></Autocomplete>
                        <DatePick disablePast label="Depart date&nbsp;&nbsp;" value={this.state.departDate} updater={(e, date) => this.dDateUpdate(e, date)} error={!this.state.departDateValid} minDate={new Date().setDate(new Date().getDate() - 1)} maxDate={new Date('2022-01-01')}/>
                        <DatePick disablePast label="Return date&nbsp;&nbsp;" value={this.state.arriveDate} updater={(e, date) => this.aDateUpdate(e, date)} error={!this.state.arriveDateValid} minDate={new Date().setDate(new Date().getDate() - 1)} maxDate={new Date('2022-01-01')}/>
                    </div>
                </div>
                <div className="Bottom">
                    <Fab onClick={this.searchFlights} color="primary" variant="extended">
                        <SearchIcon/>
                        See Flight Schedules
                    </Fab>
                </div>
            </div>
        )
    }
}

export default FlightSearch

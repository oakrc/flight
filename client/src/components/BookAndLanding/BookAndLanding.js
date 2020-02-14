import React, {Suspense, Component} from 'react';
import FlightSearch from './FlightSearch';
import KeyboardArrowDownRoundedIcon from '@material-ui/icons/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@material-ui/icons/KeyboardArrowUpRounded';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { Paper, Button } from '@material-ui/core';
import PreloadingComponent from '../PreloadingComponent';

import DelayLink from '../DelayLink';

const CloudandCard = React.lazy(() => import('./CloudandCard'));
const AirportFooter = React.lazy(() => import('../AirportFooter'));

export class BookAndLanding extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
           hidden: false,
           unmounting: false,
           goBack: false,
           flightQueried: false,
           flightList: [],
           roundResponse: [],
           roundQuery: {}
        }
    
        this.hide = this.hide.bind(this)
        this.backToTop = this.backToTop.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
        this.flightQueryOK = this.flightQueryOK.bind(this)
        this.reset = this.reset.bind(this)
    }

    componentDidMount() {
        setTimeout(() => window.scrollTo(0, 0), 500);
        this.setState({unmounting: false});
        window.onscroll = () => {
            if (window.pageYOffset >= window.innerHeight / 10) {
                if (window.pageYOffset >= window.innerHeight / 2) {
                    this.setState({hidden: true, goBack: true});
                } else {
                    this.setState({hidden: false, goBack: false});
                }
            }
        }
    }
    
    componentWillUnmount() {
        this.setState({unmounting: true});
        window.onscroll = null;
    }
    
    hide() {
        this.setState({hidden: true}, () => window.scrollTo(0, window.innerHeight * 1.2));
    }

    backToTop() {
        if (this.state.goBack) {
            this.setState({goBack: false}, () => window.scrollTo(0,0));
        }
    }

    reset() {
        this.setState({
            flightQueried: false,
            flightList: [],
            roundResponse: [],
            roundQuery: {}
        })
    }

    flightQueryOK(flightInfo, query) {
        this.setState({flightQueried: true, 
            flightList: flightInfo.map((flight, index) => {
            let depTime = new Date(flight.dt_arr);
            let depTimeL = new Date(flight.dt_dep);
            return <Paper key={flight.fl_id} className="flightResult">
                <div className="times">
                    <div>{query.departLocation.slice(-5)}</div>
                    <div><ArrowForwardIcon /></div>
                    <div>{query.arriveLocation.slice(-5)}</div>
                    <div>{new Date(flight.dt_dep).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</div>
                    <div><ArrowForwardIcon /></div>
                    <div>{new Date(flight.dt_arr).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</div>
                    <div>{Math.floor((depTime - depTimeL) / (1000 * 60 * 60)) !== 0 && Math.floor((depTime - depTimeL) / (1000 * 60 * 60)) + 'hr '}{Math.floor((depTime - depTimeL) / (1000 * 60) % 60)}min<br></br></div>
                </div>
                <div className="flightSelect">
                    <div>${flight.fare * query.passengers}</div>
                    {this.state.roundQuery.typeOfTrip === 'Round trip' ?
                    <Button onClick={() => this.handleFlight(flightInfo, index, query)} variant="outlined" color="primary">Select Flight</Button> :
                    <Button onClick={this.props.showOption} variant="outlined" color="primary"><DelayLink style={{textDecoration: 'none', color: 'inherit'}} to='/book'>Select Flight</DelayLink></Button>
                    }
                </div>
            </Paper>;
            }) 
        });
    }

    roundFlightQueryOK(response, query) {
        this.setState({roundResponse: response, roundQuery: query});
    }

    handleFlight(flightInfo, index, query) {
        this.setState({
            flightList: this.state.roundResponse.map((flight, index) => {
            let depTime = new Date(flight.dt_arr);
            let depTimeL = new Date(flight.dt_dep);
            return <Paper key={flight.fl_id} className="flightResult">
                <div className="times">
                    <div>{this.state.roundQuery.departLocation.slice(-5)}</div>
                    <div><ArrowForwardIcon /></div>
                    <div>{this.state.roundQuery.arriveLocation.slice(-5)}</div>
                    <div>{new Date(flight.dt_dep).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</div>
                    <div><ArrowForwardIcon /></div>
                    <div>{new Date(flight.dt_arr).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</div>
                    <div>{Math.floor((depTime - depTimeL) / (1000 * 60 * 60)) !== 0 && Math.floor((depTime - depTimeL) / (1000 * 60 * 60)) + 'hr '}{Math.floor((depTime - depTimeL) / (1000 * 60) % 60)}min<br></br></div>
                </div>
                <div className="flightSelect">
                    <div>${flight.fare * this.state.roundQuery.passengers}</div>
                    <Button onClick={this.props.showOption} variant="outlined" color="primary"><DelayLink style={{textDecoration: 'none', color: 'inherit'}} to='/book'>Select Flight</DelayLink></Button>
                </div>
            </Paper>;
            }) 
        });
    }

    render() {
        return (
            <div className="BookingAndLanding">
                <div className="Title">
                    <h2>Flying West, Prices Best.</h2>
                </div>
                <PreloadingComponent zIndex={!this.state.unmounting}/>
                <FlightSearch reset={this.reset} flightQueryOK={(flightInfo, query) => this.flightQueryOK(flightInfo, query)} roundFlightQueryOK={(response, query) => this.roundFlightQueryOK(response, query)}/>
                {!this.state.flightQueried ?
                <div>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <KeyboardArrowDownRoundedIcon onClick={this.hide} className={`scrollDown ${(this.state.hidden || this.state.unmounting) && 'hidden'}`}/></div>
                    <KeyboardArrowUpRoundedIcon onClick={this.backToTop} className={`backToTop ${!this.state.goBack && 'hidden'}`}/>
                    <Suspense className="cards" fallback={<div></div>}>
                        <CloudandCard src={1}/>
                        <CloudandCard left={0.5 - 0.402 * 12} src={2}/>
                        <CloudandCard left={0.5 - 0.153 * 12} src={3}/>
                        <CloudandCard left={0.5 - 0.630 * 12} src={4}/>
                        <CloudandCard left={0.5 - 0.372 * 12} src={5}/>
                        <CloudandCard left={0.5 - 0.592 * 12} src={6}/>
                    </Suspense>
                    <Suspense fallback={<div></div>}><AirportFooter/></Suspense>
                </div> :
                <div className="fullFlightList">{this.state.flightList}</div>
                }
            </div>
        )
    }
}

export default BookAndLanding

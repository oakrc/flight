import React, {Suspense, Component} from 'react';
import FlightSearch from './FlightSearch';
import KeyboardArrowDownRoundedIcon from '@material-ui/icons/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@material-ui/icons/KeyboardArrowUpRounded';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { Paper, Button } from '@material-ui/core';

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
           roundQuery: {},
           selectDisabled: false,
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
        this.props.resetFlData();
        /*window.onscroll = () => {
            if (window.pageYOffset >= window.innerHeight / 10) {
                if (window.pageYOffset >= window.innerHeight / 2) {
                    this.setState({hidden: true, goBack: true});
                } else {
                    this.setState({hidden: false, goBack: false});
                }
            }
        }*/
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
        this.props.resetFlData();
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
                        {query.typeOfTrip === 'Round trip' ?
                        <Button onClick={() => this.handleFlight(flightInfo, index, query)} variant="outlined" color="primary">Select First Flight</Button> :
                        <Button onClick={() => {
                            !this.state.unmounting && this.setState({searchDisabled: true}, () => setTimeout(() => {this.setState({searchDisabled: false})}, 1000))
                            this.props.showPurchase([[flightInfo[index], query]]);
                        }} variant="outlined" color="primary"><DelayLink style={{textDecoration: 'none', color: 'inherit'}} to='/book'>Select Flight</DelayLink></Button>
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
        if (!this.state.searchDisabled) {
            this.setState({
                searchDisabled: true,
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
                        <Button onClick={() => {
                            this.setState({searchDisabled: true}, () => setTimeout(() => {this.setState({searchDisabled: false})}, 1000))
                            this.props.showPurchase([[flightInfo[index], query], [this.state.roundResponse[index], this.state.roundQuery]])}
                        } variant="outlined" color="primary"><DelayLink style={{textDecoration: 'none', color: 'inherit'}} to='/book'>Select Second Flight</DelayLink></Button>
                    </div>
                </Paper>;
                }) 
            }, () => {
                setTimeout(() => {this.setState({searchDisabled: false})}, 1000);
            });
        }
    }

    render() {
        return (
            <div className="BookingAndLanding">
                <div className="Title">
                    <h1>West Flight</h1>
                    <h2>Flying West, Prices Best.</h2>
                </div>
                <FlightSearch reset={this.reset} flightQueryOK={(flightInfo, query) => this.flightQueryOK(flightInfo, query)} roundFlightQueryOK={(response, query) => this.roundFlightQueryOK(response, query)}/>
                {!this.state.flightQueried ?
                <div>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <KeyboardArrowDownRoundedIcon onClick={this.hide} className={`scrollDown ${(this.state.hidden || this.state.unmounting) && 'hidden'}`}/></div>
                    <KeyboardArrowUpRoundedIcon onClick={this.backToTop} className={`backToTop ${!this.state.goBack && 'hidden'}`}/>
                    <Suspense className="cards" fallback={<div></div>}>
                        <CloudandCard/>
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

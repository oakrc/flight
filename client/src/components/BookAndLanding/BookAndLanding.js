import React, {Suspense, Component} from 'react';
import FlightSearch from './FlightSearch';
import KeyboardArrowDownRoundedIcon from '@material-ui/icons/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@material-ui/icons/KeyboardArrowUpRounded';
import { Paper, Button } from '@material-ui/core';
import PreloadingComponent from '../PreloadingComponent';

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
           flightList: []
        }
    
        this.hide = this.hide.bind(this)
        this.backToTop = this.backToTop.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
        this.flightQueryOK = this.flightQueryOK.bind(this)
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

    flightQueryOK(flightInfo, query) {
        this.setState({flightQueried: true, 
            flightList: flightInfo.map(flight => {
            let depTime = new Date(flight.dt_arr);
            let depTimeL = new Date(flight.dt_dep);
            return <Paper key={flight.fl_id} className="flightResult">
                <div className="timeDestDate">
                    <div className="time">
                        {new Date(flight.dt_dep).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} -> &nbsp;
                        {new Date(flight.dt_arr).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} &nbsp;
                        {Math.floor((depTime - depTimeL) / (1000 * 60 * 60)) !== 0 && Math.floor((depTime - depTimeL) / (1000 * 60 * 60)) + 'hr '}{Math.floor((depTime - depTimeL) / (1000 * 60) % 60)}min<br></br>
                    </div>
                </div>
                <div className="priceSelect">
                    ${flight.fare}
                    <Button variant="outlined" color="primary">Select Flight</Button>
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
                <FlightSearch flightQueryOK={(flightInfo, query) => this.flightQueryOK(flightInfo, query)}/>
                {!this.state.flightQueried ?
                <div>
                <div style={{display: 'flex', justifyContent: 'center'}}>
                    <KeyboardArrowDownRoundedIcon onClick={this.hide} className={`scrollDown ${this.state.hidden && 'hidden'}`}/></div>
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
                <div>{this.state.flightList}</div>
                }
            </div>
        )
    }
}

export default BookAndLanding

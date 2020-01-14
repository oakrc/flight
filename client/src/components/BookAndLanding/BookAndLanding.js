import React, {Suspense, Component} from 'react';
import FlightSearch from './FlightSearch';
import KeyboardArrowDownRoundedIcon from '@material-ui/icons/KeyboardArrowDownRounded';
import KeyboardArrowUpRoundedIcon from '@material-ui/icons/KeyboardArrowUpRounded';
import PreloadingComponent from '../PreloadingComponent';

const CloudandCard = React.lazy(() => import('./CloudandCard'));
const AirportFooter = React.lazy(() => import('../AirportFooter'));

export class BookAndLanding extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
           hidden: false,
           unmounting: false,
           goBack: false
        }
    
        this.hide = this.hide.bind(this)
        this.backToTop = this.backToTop.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
    }

    componentDidMount() {
        setTimeout(() => window.scrollTo(0, 0), 500);
        this.setState({unmounting: false});
        window.onscroll = () => {
            if (window.pageYOffset >= window.innerHeight / 10) {
                if (window.pageYOffset >= window.innerHeight / 2) {
                    this.setState({hidden: true, goBack: true});
                } else {
                    this.setState({hidden: true, goBack: false});
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
        this.setState({goBack: false}, () => window.scrollTo(0,0))
    }

    render() {
        return (
            <div className="BookingAndLanding">
                <div className="Title">
                    <h2>Flying West, Prices Best.</h2>
                </div>
                <PreloadingComponent zIndex={!this.state.unmounting}/>
                <FlightSearch />
                <KeyboardArrowDownRoundedIcon onClick={this.hide} className={`scrollDown ${this.state.hidden && 'hidden'}`}/>
                <KeyboardArrowUpRoundedIcon onClick={this.backToTop} className={`backToTop ${!this.state.goBack && 'hidden'}`}/>
                <Suspense className="cards" fallback={<div></div>}>
                    <CloudandCard src={1}/>
                    <CloudandCard left={0.5 - 0.402 * 12} src={2}/>
                    <CloudandCard left={0.5 - 0.153 * 12} src={3}/>
                    <CloudandCard left={0.5 - 0.630 * 12} src={4}/>
                    <CloudandCard left={0.5 - 0.372 * 12} src={5}/>
                    <CloudandCard left={0.5 - 0.592 * 12} src={6}/>
                    <AirportFooter />
                </Suspense>
            </div>
        )
    }
}

export default BookAndLanding

import React, {Suspense, Component} from 'react';
import FlightSearch from './FlightSearch';
import KeyboardArrowDownRoundedIcon from '@material-ui/icons/KeyboardArrowDownRounded';

const CloudandCard = React.lazy(() => import('./CloudandCard'));

export class BookAndLanding extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
           hidden: false,
        }
    
        this.hide = this.hide.bind(this)
        this.componentDidMount = this.componentDidMount.bind(this)
    }

    componentDidMount() {
        if (!this.state.hidden) {
          window.onscroll = function() {
            if (window.pageYOffset >= window.innerHeight / 10) {
              this.setState({hidden: true});
              window.onscroll = null;
            }
          }.bind(this)
        }
    }
    
    componentWillUnmount() {
        window.onscroll = null;
    }
    
    hide() {
        document.getElementsByClassName("firstCard")[0].scrollIntoView(false);
        this.setState({hidden: true});
    }

    render() {
        return (
            <div className="BookingAndLanding">
                <div className="Title">
                    <h2>Flying West, Prices Best.</h2>
                </div>
                <FlightSearch />
                <KeyboardArrowDownRoundedIcon onClick={this.hide} className={`scrollDown ${this.state.hidden && 'hidden'}`}/>
                <Suspense className="cards" fallback={<div></div>}>
                    <CloudandCard src={1}/>
                    <CloudandCard src={2}/>
                    <CloudandCard src={3}/>
                    <CloudandCard src={4}/>
                    <CloudandCard src={5}/>
                    <CloudandCard src={6}/>
                </Suspense>
            </div>
        )
    }
}

export default BookAndLanding

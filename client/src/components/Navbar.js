import React, { Component } from 'react';
import DelayLink from './DelayLink';

import '../css/Animations.scss';
import '../css/Navbar.scss';
import logo from '../css/images/logo3.png';
import InstagramIcon from '@material-ui/icons/Instagram';
import FacebookIcon from '@material-ui/icons/Facebook';
import TwitterIcon from '@material-ui/icons/Twitter';

export class Navbar extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            navOpen: false,
        }
        this.toggleNav = this.toggleNav.bind(this);
    }

    toggleNav() {
        this.setState((prevState) => ({navOpen: !prevState.navOpen}))
    }
    
    render() {
        return (
            <div>
                <div className={`Nav ${this.state.navOpen && 'nav-open'}`}>
                    <h1 onClick={() => {this.props.optionHandler('/'); this.toggleNav();}} className={`option-1 animated ${this.state.navOpen ? 'slideInUp' : 'slideOutUp'}`}><DelayLink to='/'>Book A Flight</DelayLink></h1>
                    <h1 onClick={() => {this.props.optionHandler('/login'); this.toggleNav();}} className={`option-2 animated ${this.state.navOpen ? 'slideInUp' : 'slideOutUp'}`}>{this.props.loggedIn ? <DelayLink to='/dashboard'>Dashboard</DelayLink> : <DelayLink to='login'>Log In / Sign Up</DelayLink>}</h1>
                    <h1 onClick={() => {this.props.optionHandler('/westmiles'); this.toggleNav();}} className={`option-3 animated ${this.state.navOpen ? 'slideInUp' : 'slideOutUp'}`}><DelayLink to='/westmiles'>West Miles</DelayLink></h1>
                    <h1 onClick={() => {this.props.optionHandler('/checkin'); this.toggleNav();}} className={`option-4 animated ${this.state.navOpen ? 'slideInUp' : 'slideOutUp'}`}><DelayLink to='/checkin'>Check In</DelayLink></h1>
                    {/*<h1 onClick={() => {this.props.optionHandler(); this.toggleNav();}} className={`option-4 animated ${this.state.navOpen ? 'slideInUp' : 'slideOutUp'}`}><DelayLink to='/flightstatus'>Flight Status</DelayLink></h1>*/}
                    <h1 onClick={() => {this.props.optionHandler('/flightschedules'); this.toggleNav();}} className={`option-5 animated ${this.state.navOpen ? 'slideInUp' : 'slideOutUp'}`}><DelayLink to='/flightschedules'>Schedules</DelayLink></h1>
                    <div className="extras">
                        <h2 onClick={() => {this.props.optionHandler('/careers'); this.toggleNav();}} className={`option-6 animated ${this.state.navOpen ? 'slideInUp' : 'slideOutUp'}`}><DelayLink to='/careers'>Careers</DelayLink></h2>
                        <h2 onClick={() => {this.props.optionHandler('/contact'); this.toggleNav();}} className={`option-7 animated ${this.state.navOpen ? 'slideInUp' : 'slideOutUp'}`}><DelayLink to='/contact'>Contact Us</DelayLink></h2>
                        <div className={`option-8 social animated ${this.state.navOpen ? 'slideInUp' : 'slideOutUp'}`}>
                            <a href="https://instagram.com/westflightairlines" target="_blank" rel="noopener noreferrer"><InstagramIcon fontSize="large"/></a>
                            <a href="https://facebook.com/westflightairlines" target="_blank" rel="noopener noreferrer"><FacebookIcon fontSize="large"/></a>
                            <a href="https://twitter.com/westflightairlines" target="_blank" rel="noopener noreferrer"><TwitterIcon fontSize="large"/></a>
                        </div> 
                        <h2 className={`option-8 animated ${this.state.navOpen ? 'slideInUp' : 'slideOutUp'}`}><a href="https://docs.google.com/document/d/1hXhZ9vK3IizCvQzdjiuk3PD4Lv72TYH5hMi-CLAleSc/edit?usp=sharing" target="_blank" rel="noopener noreferrer">Sources</a></h2>
                    </div>
                </div>
                <div className="Navbar">
                    <img alt="logo" src={logo}></img>
                    <div className={`menu ${this.state.navOpen && 'menuToggled'}`} onClick={this.toggleNav}></div>
                </div>
                <div className={`transitionScreen ${this.props.transitionScreen && 'shown'}`}></div>
            </div>
        )
    }
}

export default Navbar

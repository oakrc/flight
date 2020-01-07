import React, { Component } from 'react';
import FlightIcon from '@material-ui/icons/Flight';
import '../css/Animations.scss';
import '../css/Navbar.scss';
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
                    <h1 onClick={() => {this.props.optionHandler('LogIn'); this.toggleNav();}} className={`option-1 animated ${this.state.navOpen ? 'slideInRight' : 'slideOutRight'}`}>{this.props.loggedIn ? 'Dashboard' : 'Log In / Sign Up'}</h1>
                    <h1 onClick={() => {this.props.optionHandler('BookAndLanding'); this.toggleNav();}} className={`option-2 animated ${this.state.navOpen ? 'slideInRight' : 'slideOutRight'}`}>Book A Flight</h1>
                    <h1 onClick={() => {this.props.optionHandler('CheckIn'); this.toggleNav();}} className={`option-3 animated ${this.state.navOpen ? 'slideInRight' : 'slideOutRight'}`}>Check In</h1>
                    <h1 onClick={() => {this.props.optionHandler('FlightStatus'); this.toggleNav();}} className={`option-4 animated ${this.state.navOpen ? 'slideInRight' : 'slideOutRight'}`}>Flight Status</h1>
                    <h1 onClick={() => {this.props.optionHandler('Schedules'); this.toggleNav();}} className={`option-5 animated ${this.state.navOpen ? 'slideInRight' : 'slideOutRight'}`}>Schedules</h1>
                    <div className="extras">
                        <h2 onClick={() => {this.props.optionHandler('Careers'); this.toggleNav();}} className={`option-6 animated ${this.state.navOpen ? 'slideInRight' : 'slideOutRight'}`}>Careers</h2>
                        <h2 onClick={() => {this.props.optionHandler('ContactUs'); this.toggleNav();}} className={`option-7 animated ${this.state.navOpen ? 'slideInRight' : 'slideOutRight'}`}>Contact Us</h2>
                        <div className={`option-8 social animated ${this.state.navOpen ? 'slideInRight' : 'slideOutRight'}`}>
                            <InstagramIcon fontSize="large"/>
                            <FacebookIcon fontSize="large"/>
                            <TwitterIcon fontSize="large"/>
                        </div> 
                    </div>
                </div>
                <div className="Navbar">
                    <FlightIcon fontSize="inherit"/>
                    <div className={`menu ${this.state.navOpen && 'menuToggled'}`} onClick={this.toggleNav}></div>
                </div>
                <div className={`transitionScreen ${this.props.transitionScreen && 'shown'}`}></div>
            </div>
        )
    }
}

export default Navbar

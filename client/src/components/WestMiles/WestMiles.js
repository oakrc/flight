import React, { Component } from 'react'

import KeyboardArrowDownRoundedIcon from '@material-ui/icons/KeyboardArrowDownRounded';
import '../../css/components/BookAndLanding/WestMiles.scss';

export class WestMiles extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            hidden: false,
        }

        this.hide = this.hide.bind(this)
        this.backToTop = this.backToTop.bind(this)
    }

    componentDidMount() {
        if (window.pageYOffset || document.documentElement.scrollTop >= window.innerHeight / 2) {
            this.setState({hidden:true});
        } 
    }
    
    hide() {
        this.setState({hidden: true}, () => window.scrollTo(0, window.innerHeight * 1.1));
    }

    backToTop() {
        if (this.state.goBack) {
            this.setState({goBack: false}, () => window.scrollTo(0,0));
        }
    }

    render() {
        return (
            <div className="WestMiles">
                <div className="Title">
                    <h2>West Miles: Our Frequent Flyer Program</h2>
                </div>
                <div className="Cards">
                    <div className="Card">
                        <h1>Get To Know West Miles</h1>
                        <hr></hr>
                        <p>With WestMiles, every trip and purchase can bring you closer to the next place on your travel wish list. Our frequent flyer program is completely free to join and easy to sign up with. You can begin to collect Miles as soon as you become a member! Membership also allows you to spend Miles with WestFlight, which effectively enhances your travel experience with benefits and services that make every trip more rewarding. Miles can also be used for future flights, and save money by using available Miles.</p>
                    </div>

                    <div className="Card">
                        <h1>Tiers</h1>
                        <hr></hr>
                        <p>There are three different tiers with varying benefits:</p>
                        <ul>
                            <li>Bronze</li>
                            <li>Silver</li>
                            <li>Gold</li>
                        </ul>
                    </div>

                    <div className="Card">
                        <h1>Bronze Tier - Benefits</h1>
                        <ul>
                            <li>Unlimited rollover miles</li>
                            <li>Waived Baggage Fees</li>
                            <li>Priority Check-in</li>
                            <li>Priority Boarding</li>
                        </ul>
                    </div>

                    <div className="Card">
                        <h1>Silver Tier - Benefits</h1>
                        <ul>
                            <li>All Bronze Benefits</li>
                            <li>Complimentary preferred seats</li>
                            <li>Priority baggage handling</li>
                            <li>Lounge Access</li>
                        </ul>
                    </div>

                    <div className="Card">
                        <h1>Gold Tier - Benefits</h1>
                        <ul>
                            <li>All Bronze Benefits</li>
                            <li>All Silver Benefits</li>
                            <li>Possible Upgraded Seats</li>
                            <li>Priority security line access</li>
                            <li>Expedited baggage service</li>
                            <li>Premium Lounge Access</li>
                        </ul>
                    </div>

                    <div className="Card">
                        <h1>Moving Up Tiers</h1>
                        <ul>
                            <li>You'll gain points everytime you fly, adding to the current account you're booking with.</li>
                            <li>Every flight, you'll gain 200 points with an extra 5 points per dollar spent.</li>
                            <li>To reach the very first tier, Bronze, you must accumulate a total of 15,000 miles or have flown 50 flights.</li>
                            <li>To reach the Silver tier, you must accumulate 30,000 miles or have flown 100 flights.</li>
                            <li>To reach the Gold tier, you must accumulate 45,000 miles or have flowing 150 flights.</li>
                            <li>WestMiles membership is valid from the first flight to the end of time! No need for any renewal.</li>
                        </ul>
                    </div>
                </div>
                <KeyboardArrowDownRoundedIcon onClick={this.hide} className={`scrollDown ${(this.state.hidden || this.state.unmounting) && 'hidden'}`}/>
            </div>
        )
    }
}

export default WestMiles

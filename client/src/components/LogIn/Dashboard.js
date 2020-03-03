import React, { Component } from 'react';

import axios from 'axios';

import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { Button, Paper } from "@material-ui/core";
import '../../css/components/LogIn/LogInAndDashboard.scss';

export class Dashboard extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            upcomingTickets: [],
            previousTickets: [],

            upcomingTicketsFormat: [],
            previousTicketsFormat: [],

            userInfo: [],
            
        }
    }

    componentDidMount() {
        this.props.showOption();
        this.props.showOption();
        axios({
            method: 'get',
            url: '/api/user'
        })
        .then((response) => {
            this.setState({userInfo: response.data})
        })
        .catch((err) => {
        })
        axios({
            method: 'get',
            url: '/api/ticket/upcoming'
        })
        .then((response) => {
            this.setState({upcomingTickets: response.data, upcomingTicketsFormat: response.data.map((ticket, index) => {
                if (ticket.tk_id !== null) {
                    return (<Paper className="ticket" key={ticket.tk_id}>
                        <div>
                            {ticket.first_name} {ticket.last_name}<br></br>
                            ({ticket.src }) <ArrowForwardIcon /> ({ticket.dest}), {new Date(ticket.dt_dep).toLocaleTimeString().replace(/:\d+ /, ' ')} <ArrowForwardIcon/> {new Date(ticket.dt_arr).toLocaleTimeString().replace(/:\d+ /, ' ')}
                        </div>
                    </Paper>)
                } else {
                    return (<Paper className="ticket">
                        Currently no upcoming flights.
                    </Paper>)
                }
            })})
        })
        .catch((err) => {
        })
        axios({
            method: 'get',
            url: '/api/ticket/history'
        })
        .then((response) => {
            this.setState({previousTickets: response.data, previousTicketsFormat: response.data.map((ticket, index) => {
                if (ticket.tk_id !== null) {
                    return (<Paper className="ticket" key={ticket.tk_id}>
                        <div>
                            {ticket.first_name} {ticket.last_name}<br></br>
                            ({ticket.src})  <ArrowForwardIcon />  ({ticket.dest})
                            {(new Date(ticket.dt_arr) - new Date(ticket.dt_dep)) / 60000 % 60 + 'min, ' + new Date(ticket.dt_dep).toLocaleTimeString().replace(/:\d+ /, ' ') + ' to ' + new Date(ticket.dt_arr).toLocaleTimeString().replace(/:\d+ /, ' ')}
                        </div>
                    </Paper>)
                } else {
                    return (<Paper className="ticket">
                        Currently no previous flights.
                    </Paper>)
                }
            })})
        })
        .catch((err) => {
        })
    }

    render() {
        return (
            <div className="Dashboard">
                <h1>{'Hello, ' + this.state.userInfo.first_name}!</h1>
                <div className="tickets">
                    <div className="half-section">
                        <Paper>Upcoming Flights</Paper>
                        {this.state.upcomingTickets.length === 0 ? <Paper className="ticket">Currently no upcoming flights.</Paper> : this.state.upcomingTicketsFormat}
                    </div>
                    <div className="half-section">
                        <Paper>Previous Flights</Paper>
                        {this.state.previousTickets.length === 0 ? <Paper className="ticket">Currently no previous flights.</Paper> : this.state.previousTicketsFormat}
                    </div>
                </div>
                <Button variant="contained" color="primary" onClick={this.props.logOut}>
                    Log Out
                </Button>
            </div>
        )
    }
}

export default Dashboard

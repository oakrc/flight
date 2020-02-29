import React, { Component } from 'react';

import axios from 'axios';

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
            console.log(response.data);
            this.setState({upcomingTickets: response.data, upcomingTicketsFormat: response.data.map((ticket, index) => {
                return (<div className="ticket" key={ticket.tk_id}>
                    {ticket.first_name + ' ' + ticket.last_name + ' '}
                </div>)
            })})
        })
        .catch((err) => {
        })
        axios({
            method: 'get',
            url: '/api/ticket/history'
        })
        .then((response) => {
            this.setState({previousTickets: response.data})
        })
        .catch((err) => {
        })
    }

    render() {
        return (
            <div className="Dashboard">
                <h1>{'Hello, ' + this.state.userInfo.first_name}!</h1>
                <div className="tickets">
                    <Paper>
                        <p>{this.state.upcomingTickets.length === 0 ? 'Currently no upcoming flights.' : this.state.upcomingTicketsFormat}</p>
                    </Paper>
                    <Paper>
                        <p>{this.state.previousTickets.length === 0 ? 'Currently no upcoming flights.' : this.state.previousTicketsFormat}</p>
                    </Paper>
                </div>
                <Button variant="contained" color="primary" onClick={this.props.logOut}>
                    Log Out
                </Button>
            </div>
        )
    }
}

export default Dashboard

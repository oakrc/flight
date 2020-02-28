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
            userInfo: [],
        }
    }

    componentDidMount() {
        axios({
            method: 'get',
            url: '/api/user'
        })
        .then((response) => {
            console.log(response);
            this.setState({userInfo: response.data})
        })
        .catch((err) => {
            console.log(err);
        })
        axios({
            method: 'get',
            url: '/api/ticket/upcoming'
        })
        .then((response) => {
            console.log(response);
            this.setState({upcomingTickets: response.data})
        })
        .catch((err) => {
            console.log(err);
        })
        axios({
            method: 'get',
            url: '/api/ticket/history'
        })
        .then((response) => {
            console.log(response);
            this.setState({previousTickets: response.data})
        })
        .catch((err) => {
            console.log(err);
        })
    }

    render() {
        return (
            <div className="Dashboard">
                <h1>{'Hello, ' + this.state.userInfo.first_name}!</h1>
                <div className="tickets">
                    <Paper>
                    </Paper>
                    <Paper>
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

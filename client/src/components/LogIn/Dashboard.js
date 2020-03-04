import React, { Component } from 'react';

import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { Button, Paper } from "@material-ui/core";
import '../../css/components/LogIn/LogInAndDashboard.scss';

export class Dashboard extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            upcomingTicketsFormat: [],
            previousTicketsFormat: [],

            userInfo: [],
            
        }
    }

    componentDidMount() {
        this.setState({upcomingTicketsFormat: this.props.upcomingTickets.map((ticket, index) => {
                if (ticket.tk_id !== null) {
                    return (<Paper className="ticket" key={ticket.tk_id}>
                        <div>
                            {ticket.first_name} {ticket.last_name}<br></br>
                            ({ticket.src }) <ArrowForwardIcon /> ({ticket.dest}), {new Date(ticket.dt_dep).toLocaleDateString()}
                            <br></br>{new Date(ticket.dt_dep).toLocaleTimeString().replace(/:\d+ /, ' ')} <ArrowForwardIcon/> {new Date(ticket.dt_arr).toLocaleTimeString().replace(/:\d+ /, ' ')},&nbsp;
                            {(new Date(ticket.dt_arr) - new Date(ticket.dt_dep)) / 60000 % 60}min
                            <br></br>
                            Checked In: {ticket.stat === 0 ? 'Yes' : 'No'}
                        </div>
                    </Paper>)
                } else {
                    return (<Paper className="ticket">
                        Currently no upcoming flights.
                    </Paper>)
                }
            })})
        this.setState({previousTicketsFormat: this.props.previousTickets.map((ticket, index) => {
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
        this.props.showOption();
        this.props.showOption();
    }

    render() {
        return (
            <div className="Dashboard">
                <h1>Hello, {this.props.userInfo.first_name !== undefined && this.props.userInfo.first_name}!</h1>
                <div className="tickets">
                    <div className="half-section">
                        <Paper>Upcoming Flights</Paper>
                        {this.props.upcomingTickets.length === 0 ? <Paper className="ticket">Currently no upcoming flights.</Paper> : this.state.upcomingTicketsFormat}
                    </div>
                    <div className="half-section">
                        <Paper>Previous Flights</Paper>
                        {this.props.previousTickets.length === 0 ? <Paper className="ticket">Currently no previous flights.</Paper> : this.state.previousTicketsFormat}
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

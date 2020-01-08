import React, { Component } from 'react';
import { Button } from "@material-ui/core";
import '../../css/components/LogIn/LogIn.scss';
import axios from 'axios';

export class Dashboard extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             
        }
    }
    
    logout() {
        axios.delete('http://oak.hopto.org:3000/user')
        .then((response) => {
            console.log(response);
            console.log('logged out');
        }).catch((error) => {
            console.log(error);
        })
    }

    render() {
        return (
            <div className="Dashboard">
                <Button variant="contained" color="primary" onClick={this.logout}>
                    Log Out
                </Button>
            </div>
        )
    }
}

export default Dashboard

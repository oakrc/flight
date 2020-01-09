import React, { Component } from 'react';

import { Button } from "@material-ui/core";
import '../../css/components/LogIn/LogIn.scss';


export class Dashboard extends Component {
    render() {
        return (
            <div className="Dashboard">
                <Button variant="contained" color="primary" onClick={this.props.logOut}>
                    Log Out
                </Button>
            </div>
        )
    }
}

export default Dashboard

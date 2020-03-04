import React, { Component } from 'react';
import DelayLink from './DelayLink';

export class NotAPage extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
             
        }
    }
    

    render() {
        return (
            <div>
                {window.location.pathname === '/dashboard' ?
                <div className="Redirect" onClick={this.props.showOption}>
                    <DelayLink style={{textDecoration: 'none', color: 'inherit'}} to='/login'>Log In <u>Here</u>!</DelayLink>
                </div>
                :
                <div style={{color: 'white', padding: '6vh 0 0 0'}}>
                    <h1>404 - Page Not Found</h1>
                </div>}    
            </div>    
        )
    }
}

export default NotAPage

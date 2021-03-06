import React, { Component } from 'react';
import { Paper, TextField, Button } from "@material-ui/core";
import { Alert } from '@material-ui/lab';
import axios from 'axios';

export class LogInCard extends Component {
    constructor(props) {
        super(props)
    
        this.state = {
            email: '',
            password: '',

            emailValid: true,
            passwordValid: true,
            logInSuccess: null,
            loading: null,
            logInText: -1,

            display: false
        }

        this.logIn = this.logIn.bind(this);
    }

    componentDidMount() {
        this.setState({display: true});
    }

    updateEmail(value) {
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value) || value.length === 0) {
            this.setState({email: value, emailValid: false})
        }

        if (value.length !== 0 && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
            this.setState({email: value, emailValid: true});
        }
    }
    
    updatePwd(value) {
        if (value.length === 0) {
            this.setState({password: value, passwordValid: false})
        } else {
            this.setState({password: value, passwordValid: true})
        }
    }

    enterKeyPress(e) {
        if (e.key === "Enter") {
            this.logIn()
        }
    }

    logIn() {
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(this.state.email) || this.state.email.length === 0) {
            this.setState({emailValid: false})
        }

        if (this.state.password.length === 0) {
            this.setState({passwordValid: false})
        }

        if (this.state.password.length !== 0 && this.state.email.length !== 0 && /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(this.state.email)) {
            this.setState({loading: true, logInSuccess: null})
            axios.post('/api/user', {
                email: this.state.email,
                password: btoa(this.state.password)
              }, {withCredentials: true})
              .then((response) => {
                if (response.status === 200) {
                    this.setState({email: '', password: '', logInSuccess: true, loading: false})
                    this.props.logIn();
                }
              })
              .catch((error) => {
                try {
                    (error.response.status === 401 || error.response.status === 400) && this.setState({password: '', logInSuccess: false, loading: false, logInText: 0});
                    (error.response.status === 423) && this.setState({password: '', logInSuccess: false, loading: false, logInText: 1});
                  } catch {}
              });
        }
    }

    close() {
        this.setState({display: false});
    }

    render() {
        return (
            <div className={`loginchild ${this.state.display ? 'shownnozfast' : 'hiddenfast'}`}>
                <Paper elevation={5}>
                    <h1>Log In</h1>
                    <TextField id="outlined-basic" type="email" label="Email" variant="outlined" value={this.state.email} onChange={(e) => this.updateEmail(e.target.value)} error={!this.state.emailValid}/>
                    <TextField id="outlined-password-input" label="Password" type="password" autoComplete="current-password" variant="outlined" value={this.state.password} onChange={(e) => this.updatePwd(e.target.value)} error={!this.state.passwordValid} onKeyPress={(e) => this.enterKeyPress(e)}/>
                    <div style={{display: 'flex', alignSelf: 'flex-end', width: '100%', justifyContent: 'space-between'}}>
                        <div style={{alignSelf: 'flex-end'}}>
                            {this.state.logInSuccess !== null && (this.state.logInSuccess ? <Alert severity="success">Logged In!</Alert> : this.state.logInText === 0 ? <Alert severity="error">Wrong email & password combination.</Alert> : <Alert severity="error">Please verify your account.</Alert>)}
                            {this.state.loading !== null && this.state.loading && <Alert severity="info">Loading...</Alert>}
                        </div>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <Button variant="contained" color="primary" onClick={this.logIn}>Log In</Button>
                            <Button color="primary" variant="outlined" onClick={() => {this.props.signUp(); this.close()}}>Sign Up</Button>
                        </div>
                    </div>
                </Paper>
            </div>
        )
    }
}

export default LogInCard

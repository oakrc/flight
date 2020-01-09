import React, { Component } from 'react';
import '../../css/components/LogIn/LogIn.scss';
import LogInCard from './LogInCard';
import SignUpCard from './SignUpCard';

export class LogIn extends Component {
  constructor(props) {
    super(props)
  
    this.state = {
      signingUp: false
    }

    this.signUp = this.signUp.bind(this);
    this.logIn = this.logIn.bind(this);
  }

  componentWillUnmount() {
    this.setState({signingUp: false})
  }

  signUp() {
    setTimeout(() => this.setState({signingUp: true}), 1000);
  }

  logIn() {
    setTimeout(() => this.setState({signingUp: false}), 1000);
  }

  render() {
    return (
      <div className="LogIn">{!this.state.signUp ? <LogInCard signUp={this.signUp} logIn={this.props.logIn}/> : <SignUpCard logIn={this.logIn}/>} </div>
    )
  }
}

export default LogIn

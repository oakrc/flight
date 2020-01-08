import React, { Suspense, Component } from 'react';
import { Preloader, Placeholder } from 'react-preloading-screen';
import { Route, Switch, withRouter } from 'react-router-dom';
import axios from 'axios';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import './css/App.scss';
import BookAndLanding from './components/BookAndLanding/BookAndLanding';
import PreloadingComponent from './components/PreloadingComponent';

const Navbar = React.lazy(() => import('./components/Navbar'));
const LogIn = React.lazy(() => import('./components/LogIn/LogIn'));
const Dashboard = React.lazy(() => import('./components/LogIn/Dashboard'));
const Careers = React.lazy(() => import('./components/Careers/Careers'));
const CheckIn = React.lazy(() => import('./components/CheckIn/CheckIn'));
const ContactUs = React.lazy(() => import('./components/ContactUs/ContactUs'));
const FlightStatus = React.lazy(() => import('./components/FlightStatus/FlightStatus'));
const Schedules = React.lazy(() => import('./components/Schedules/Schedules'));

const theme = createMuiTheme({
  typography: {
    fontFamily: 'Rubik'
  },
  palette: {
    primary: {
      main: '#0277bd',
    },
    secondary: {
      main: '#ebe7b9',
    },
    error: {
      main: '#cc0000'
    }
  },
});

class App extends Component {
  constructor(props) {
    super(props)

    this.state = {
      transitionScreen: false,
      loggedIn: false
    }

    this.showOption = this.showOption.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }
  
  showOption() {
    this.setState({transitionScreen: true}, () => {
      setTimeout(() => {
        this.setState({transitionScreen: false})
      }, 1000)
    })
  }

  componentDidMount() {
    axios.get('http://oak.hopto.org:3000/user', {withCredentials: true})
    .then((response) => {
      response.status === 200 && this.setState({loggedIn: true})
    })
    .catch((error) => {
      try {
        error.response.status === 401 && this.setState({loggedIn: false})
      } catch {}
      
    });
  }

  render() {
    return (
      <Suspense fallback={<div></div>}>
      <Preloader fadeDuration={2800} style={{backgroundColor: '#005aa7', transition: '1s', transitionDelay: '1.8s'}}>
        <Placeholder>
          <PreloadingComponent opacity={true} zIndex={this.state.transitionScreen}/>
        </Placeholder>
      </Preloader>
      <ThemeProvider theme={theme}>
      <div className="App">
        <Navbar transitionScreen={this.state.transitionScreen} optionHandler={(option) => {this.showOption(option)}} loggedIn={this.state.loggedIn}/>
            <Switch>
              <Route exact path='/' component={BookAndLanding} />
              {!this.state.loggedIn ? <Route path='/login' component={LogIn} /> : <Route path='/dashboard' component={Dashboard} />}
              <Route path='/checkin' component={CheckIn} />
              <Route path='/flightstatus' component={FlightStatus} />
              <Route path='/flightschedules' component={Schedules} />
              <Route path='/careers' component={Careers} />
              <Route path='/contact' component={ContactUs} />
            </Switch>
        </div>
      </ThemeProvider> 
      </Suspense>
    );
  };
}

export default withRouter(App);

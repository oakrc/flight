import React, { Suspense, Component } from 'react';
import { Preloader, Placeholder } from 'react-preloading-screen';
import { Route, Switch, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import axios from 'axios';

import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import './css/App.scss';
import logo from './css/images/logo3.png';

const BookAndLanding = React.lazy(() => import('./components/BookAndLanding/BookAndLanding'))
const Navbar = React.lazy(() => import('./components/Navbar'));
const LogIn = React.lazy(() => import('./components/LogIn/LogIn'));
const Dashboard = React.lazy(() => import('./components/LogIn/Dashboard'));
const WestMiles = React.lazy(() => import('./components/WestMiles/WestMiles'));
const Careers = React.lazy(() => import('./components/Careers/Careers'));
const CheckIn = React.lazy(() => import('./components/CheckIn/CheckIn'));
const ContactUs = React.lazy(() => import('./components/Careers/ContactUs'));
const Schedules = React.lazy(() => import('./components/BookAndLanding/Schedules'));
const Purchase = React.lazy(() => import('./components/BookAndLanding/Purchase'));
const NotAPage = React.lazy(() => import('./components/NotAPage'));

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
      flightData: [],
      transitionScreen: false,
      loggedIn: false
    }

    this.resetFlData = this.resetFlData.bind(this);
    this.showPurchase = this.showPurchase.bind(this);
    this.showOption = this.showOption.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
  }
  
  static propTypes = {
    match: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired
  };

  resetFlData() {
    this.setState({flightData: []})
  }

  showOption(value) {
    if (this.props.location.pathname !== value) {
      this.setState({transitionScreen: true}, () => {
        setTimeout(() => {
          this.setState({transitionScreen: false})
        }, 1500)
      })
    }
  }

  showPurchase(flightData) {
    this.setState({
      transitionScreen: true,
      flightData: flightData
    }, () => {
      setTimeout(() => {
        this.setState({transitionScreen: false})
      }, 1500)
    })

  }

  logIn() {
    this.showOption();
    setTimeout(() => {
      this.props.history.push('/dashboard');
      this.setState({loggedIn: true});
    }, 1000);
  }

  logOut() {
    axios.delete('/api/user', {withCredentials: true})
    .then((response) => {
        this.showOption();
        setTimeout(() => {
          this.props.history.push('/login');
          this.setState({loggedIn: false});
          window.location.reload();
        }, 500);
    }).catch((error) => {
        console.log(error);
    })
  }

  componentDidMount() {
    axios.get('/api/user', {withCredentials: true})
    .then((response) => {
      response.status === 200 && this.setState({loggedIn: true})
    })
    .catch((error) => {
      try {
        error.response.status === 401 && this.setState({loggedIn: false})
      } catch {

      }
    });
  }

  render() {
    return (
      <Suspense fallback={<div></div>}>
      <Preloader fadeDuration={2800} style={{backgroundColor: '#005aa7', transition: '1s', transitionDelay: '1.8s'}}>
        <Placeholder>
          <img src={logo} alt="logo" className="logo"/>
          <div class="spinner">
            <div class="bounce1"></div>
            <div class="bounce2"></div>
            <div class="bounce3"></div>
          </div>
        </Placeholder>
      </Preloader>
      <ThemeProvider theme={theme}>
      <div className="App">
        <Navbar transitionScreen={this.state.transitionScreen} optionHandler={(option) => {this.showOption(option)}} loggedIn={this.state.loggedIn}/>
            <Switch>
              <Route exact path='/' render={(props) => <BookAndLanding {...props} showPurchase={(flightData) => this.showPurchase(flightData)} resetFlData={this.resetFlData}/>} />
              {!this.state.loggedIn ? <Route path='/login' render={(props) => <LogIn logIn={this.logIn} {...props} />} /> : <Route path='/dashboard' render={(props) => <Dashboard logOut={this.logOut} {...props} showOption={this.showOption} />} />}
              <Route path='/westmiles' component={WestMiles} />
              <Route path='/checkin' component={CheckIn} />
              {/*<Route path='/flightstatus' component={FlightStatus} />*/}
              <Route path='/flightschedules' component={Schedules} />
              <Route path='/careers' component={Careers} />
              <Route path='/contact' component={ContactUs} />
              <Route path='/book' render={(props) => <Purchase {...props} flightData={this.state.flightData} showOption={(value) => this.showOption(value)}/>} />
              <Route render={(props) => <NotAPage {...props} showOption={(value => this.showOption(value))}/>} />
            </Switch>
        </div>
      </ThemeProvider> 
      </Suspense>
    );
  };
}

export default withRouter(App);

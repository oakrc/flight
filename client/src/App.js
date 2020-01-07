import React, {Suspense, Component} from 'react';
import './css/App.scss';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import AirportFooter from './components/AirportFooter';
import BookAndLanding from './components/BookAndLanding/BookAndLanding';
import { Preloader, Placeholder } from 'react-preloading-screen';
import PreloadingComponent from './components/PreloadingComponent';
import axios from 'axios';

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
      LogIn: false,
      BookAndLanding: true,
      CheckIn: false,
      FlightStatus: false,
      Schedules: false,
      Careers: false,
      ContactUs: false,
      transitionScreen: false,
      loggedIn: false
    }

    this.showOption = this.showOption.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }
  
  showOption(option) {
    if (!this.state[option]) {
      this.setState({
        transitionScreen: true,
      }, () => {
        setTimeout(() => {
          this.setState({
            LogIn: false,
            BookAndLanding: false,
            CheckIn: false,
            FlightStatus: false,
            FlightSchedules: false,
            Careers: false,
            ContactUs: false,
            [option]: true
          })
        }, 900);
        setTimeout(() => {
          this.setState({transitionScreen: false})
      }, 1500)   
      })
    }
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
      <Preloader fadeDuration={2500} style={{backgroundColor: '#005aa7', transition: '1s', transitionDelay: '1.5s'}}>
        <Placeholder>
        </Placeholder>
        <ThemeProvider theme={theme}>
          <div className="App">
            <Suspense fallback={<div></div>}>
              <Navbar transitionScreen={this.state.transitionScreen} optionHandler={(option) => {this.showOption(option)}} loggedIn={this.state.loggedIn}/>
            </Suspense>
            <Suspense fallback={<div></div>}>
              {this.state.LogIn ? !this.state.loggedIn ? <LogIn /> : <Dashboard /> : null}
              {this.state.CheckIn ? <CheckIn /> : null}
              {this.state.FlightStatus ? <FlightStatus /> : null}
              {this.state.Schedules ? <Schedules /> : null}
              {this.state.Careers ? <Careers /> : null}
              {this.state.ContactUs ? <ContactUs /> : null}
            </Suspense>
            <PreloadingComponent opacity={this.state.BookAndLanding} zIndex={this.state.transitionScreen}/>
            {this.state.BookAndLanding ? <BookAndLanding /> : null}
          </div>
          <AirportFooter />
        </ThemeProvider> 
      </Preloader>
    );
  };
}

export default App;

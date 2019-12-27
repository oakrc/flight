import React from 'react';
import FlightSearch from './components/Search/FlightSearch';
import Title from './components/Title';
import './css/App.scss';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createMuiTheme({
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

function App() {
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <div className="Content">
          <Title />
          <FlightSearch />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;

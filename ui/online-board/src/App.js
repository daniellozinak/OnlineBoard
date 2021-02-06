import Container from './components/container/Container';
import React from 'react';
import { BrowserRouter} from 'react-router-dom';
import './App.css'

class App extends React.Component{
  render()
  {
    return(
      <BrowserRouter>
        <div className="App">
          <Container/>
        </div>
      </BrowserRouter>
    )
  }
}

export default App;

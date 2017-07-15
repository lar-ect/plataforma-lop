import React from 'react';
import ReactDOM from 'react-dom';
import '../../styles/main.css';

class App extends React.Component {
  render() {
    <div className="row">
      <div className="col-md-8 col-md-offset-2">
        <p>App</p>
      </div>
    </div>
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));
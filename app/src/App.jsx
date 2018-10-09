import React, { Component } from 'react';
import {
  HashRouter,
  Route,
  Switch,
} from 'react-router-dom';
import Home from './components/Home';
import Predictor from './components/Predictor';
import Database from './components/Database';

import './global.css';

export default class App extends Component {
    render() {
        return (
            <HashRouter>
              <div className="app">
                <Route path="/" exact component={ Home } />
                <Route path="/predictor"  component={ Predictor } />
                <Route path="/database" component={ Database } />
              </div>
            </HashRouter>
        )
    }
}

/* eslint jsx-quotes: ["error", "prefer-double"] */

import React from 'react'
import {
  BrowserRouter as Router,
  Switch,
  Route
} from 'react-router-dom'

import 'normalize.css'
import './styles/global.css'

import Game from './pages/Game'
import GameScreen from './pages/GameScreen'
import NoMatch from './pages/NoMatch'

const Application = () => (
  <Router>
    <Switch>
      <Route exact path="/" component={Game} />
      <Route exact path="/gamescreen" component={GameScreen} />
      <Route component={NoMatch} />
    </Switch>
  </Router>
)

export default Application

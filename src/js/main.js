/* global document */

import '../styles/styles.scss';

import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore  from './store/configureStore';
import { browserHistory, Switch, Redirect } from 'react-router';
import { BrowserRouter as Router, Route } from 'react-router-dom';

const store = configureStore();
const rootElement = document.getElementById('app');

import { App } from './components';
import TasksContainer from './containers/TasksContainer';
import NotFound from './views/NotFound';

// Render the React application to the DOM
ReactDOM.render(
  <Provider store={store}>
	<Router history={browserHistory}>
	  <Switch>
		<Route exact path="/" component={TasksContainer} />
		<Route path="/tasks" component={TasksContainer} />
		<Route path="/404" component={NotFound} />
		<Route path="*" render={() => <Redirect to="/404" component={NotFound} />} />
	  </Switch>
	</Router>
  </Provider>,
  rootElement
);

/* global window */

import { createStore, applyMiddleware, compose } from 'redux';
import rootReducer from '../reducers';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';
import * as ReduxImmutableStateInvariant from 'redux-immutable-state-invariant';

export default function configureStore(initialState) {
  const logger = createLogger({ collapsed: true });
  const composeEnhancers =
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({

    }) : compose;

  let enhancer;
  let middleware = applyMiddleware( thunkMiddleware );

  if (process.env.NODE_ENV !== 'production') {
    let middlewares = [
	  ReduxImmutableStateInvariant.default(),
      thunkMiddleware,
      logger
    ];
    middleware = applyMiddleware(...middlewares);
    enhancer = composeEnhancers(
      middleware,
    );
  } else {
    enhancer = compose(middleware);
  }

  const store = createStore(rootReducer, initialState, enhancer);

  if (module.hot) {
	module.hot.accept(rootReducer, () =>
	  store.replaceReducer(rootReducer.default)
    );
  }

  return store;
}

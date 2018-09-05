import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from 'App';
import 'index.css';
import registerServiceWorker from 'registerServiceWorker';
import { Controller } from './ui/Controller';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from 'reducers';
import rootSaga from 'sagas';

const sagaMiddleware = createSagaMiddleware();
const windowIfDefined = typeof window === 'undefined' ? null : (window as any);
const composeEnhancers = windowIfDefined.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(sagaMiddleware)));
sagaMiddleware.run(rootSaga);

var jsviewController: Controller;
jsviewController = new Controller();
jsviewController.run();
jsviewController.render();

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root') as HTMLElement
);
registerServiceWorker();

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

const store = createStore(rootReducer);

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

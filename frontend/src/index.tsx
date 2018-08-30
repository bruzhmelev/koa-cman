import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { Controller } from './ui/Controller';

import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import rootReducer, { DEFAULT_STATE } from './reducers';

const store = createStore(
    rootReducer //,DEFAULT_STATE
);

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

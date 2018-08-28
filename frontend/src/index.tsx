import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import { Controller } from './ui/Controller';

var jsviewController: Controller;
jsviewController = new Controller();
jsviewController.run();
jsviewController.render();

ReactDOM.render(<App />, document.getElementById('root') as HTMLElement);
registerServiceWorker();

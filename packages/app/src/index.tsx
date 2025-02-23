import '@app/index.css';
import { App } from '@app/App';
import { render } from 'solid-js/web';

const root = document.getElementById('root');

if (root === null) {
  throw new Error('Root element not found.');
}

// Render the app.
render(() => <App />, root);

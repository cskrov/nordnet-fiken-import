import '@app/index.css';
import { App } from '@app/App';
import { render } from 'solid-js/web';
import { setup, shouldForwardProp } from 'solid-styled-components';

const root = document.getElementById('root');

if (root === null) {
  throw new Error('Root element not found.');
}

// Prevent styled-components from passing down props that start with '$'.
setup(
  null,
  shouldForwardProp((prop) => !prop.startsWith('$')),
);

// Render the app.
render(() => <App />, root);

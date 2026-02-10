import '@app/index.css';
import { App } from '@app/App';
import { render } from 'solid-js/web';

if (typeof umami === 'undefined') {
  console.debug('Umami is not defined, setting up a mock.');

  window.umami = {
    track: (...args: unknown[]) => {
      console.debug('Umami mock track called with arguments:', JSON.stringify(args));
      return undefined;
    },
    identify: async (...args: unknown[]) => {
      console.debug('Umami mock identify called with arguments:', JSON.stringify(args));
    },
  };
}

const root = document.getElementById('root');

if (root === null) {
  throw new Error('Root element not found.');
}

// Render the app.
render(() => <App />, root);

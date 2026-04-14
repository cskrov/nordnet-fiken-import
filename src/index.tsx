import '@/index.css';
import { render } from 'solid-js/web';
import { App } from '@/App';

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

umami.identify({ version: __APP_VERSION__ });

const root = document.getElementById('root');

if (root === null) {
  throw new Error('Root element not found.');
}

// Render the app.
render(() => <App />, root);

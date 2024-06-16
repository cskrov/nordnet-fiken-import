import '@app/app.css'
import { mount } from 'svelte';
import App from '@app/app.svelte'

const target = document.getElementById('app')!

if (target === null) {
  const error = document.createElement('div');
  error.style.color = 'red';
  error.innerHTML = 'Could not find element with id "app"';
  document.body.appendChild(error);
}

const app = mount(App, { target })

export default app

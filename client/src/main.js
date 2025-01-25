import './app.css'
import Router from 'svelte-spa-router';
import CreatePaste from './routes/CreatePaste.svelte';
import ViewPaste from './routes/ViewPaste.svelte';

const routes = {
  '/': CreatePaste,
  '/paste/:id': ViewPaste,
};

const app = new Router({
  target: document.body,
  props: { routes },
});

export default app;

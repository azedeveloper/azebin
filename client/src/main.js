import './app.css';
import Router from 'svelte-spa-router';
import CreatePaste from './routes/CreatePaste.svelte';
import ViewPaste from './routes/ViewPaste.svelte';

const routes = {
  '/': CreatePaste,         
  '/:id': ViewPaste,          
  '*': CreatePaste,          
};

const app = new Router({
  target: document.body,
  props: { routes },
  mode: 'history',            
});

export default app;

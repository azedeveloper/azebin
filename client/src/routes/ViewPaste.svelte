<script>
  import { onMount, afterUpdate } from 'svelte';
  import hljs from 'highlight.js'; 
  import 'highlight.js/styles/base16/windows-10.css';
  import { push } from 'svelte-spa-router';

  export let params; 
  let paste = null;
  let error = '';
  let copySuccess = ''; 

  onMount(async () => {
    try {
      const response = await fetch(`http://localhost:3000/pastes/${params.id}`);
      if (!response.ok) throw new Error('Failed to load paste.');

      paste = await response.json();
    } catch (err) {
      error = err.message;
    }
  });

  function formatTimestamp(timestamp) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(timestamp).toLocaleDateString(undefined, options);
  }

  afterUpdate(() => {
    if (paste?.content) {
      const codeBlock = document.querySelector('pre code');
      if (codeBlock) {
        hljs.highlightElement(codeBlock);
      }
    }
  });

  async function copyToClipboard() {
    try {
      if (paste?.content) {
        await navigator.clipboard.writeText(paste.content);
        copySuccess = 'Copied to clipboard!';
        setTimeout(() => (copySuccess = ''), 2000); // Clear message after 2 seconds
      }
    } catch (err) {
      copySuccess = 'Failed to copy!';
      setTimeout(() => (copySuccess = ''), 2000);
    }
  }
</script>

<div class="max-w-2xl mx-auto p-4">
  <div class="title">
    <img src="favicon.png" alt="">
    <p>AzeBin</p>
  </div>
  {#if error}
    <p class="text-red-500">{error}</p>
  {:else if paste}
  <div class="container">
    <div class="left">
      <h1 class="text-2xl font-bold">{paste.title}</h1>
      <p class="text-gray-500 text-sm mt--5">
        {#if paste.timestamp}Posted on {formatTimestamp(paste.timestamp)}{/if}</p>
    </div>
    <div class="right">
      <button 
      on:click={copyToClipboard} 
      class="mt-4 px-4 py-2 text-white rounded bg-black">
      Copy
    </button>
    </div>
  </div>
    <pre><code class="">{paste.content}</code></pre>
  {:else}
    <p>Loading...</p>
  {/if}
</div>

<style>
  button {
    transition: background-color 0.3s;
  }
</style>

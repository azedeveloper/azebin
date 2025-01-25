<script>
  import { push } from 'svelte-spa-router'; 

  let title = '';
  let content = '';
  let error = '';

  const submitPaste = async () => {
    try {
      const response = await fetch('http://patricia-deliver-chest-auto.trycloudflare.com/pastes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content }),
      });

      if (!response.ok) throw new Error('Failed to save paste.');

      const data = await response.json();
      push(`/${data.id}`);
    } catch (err) {
      error = err.message;
    }
  };
</script>

<div class="max-w-2xl mx-auto p-4">
  <div class="title">
    <img src="favicon.png" alt="">
    <p>AzeBin</p>
  </div>
  <h1 class="text-2xl font-bold mb-4"></h1>
  {#if error}
    <p class="text-red-500 mb-4">{error}</p>
  {/if}
  <form
    class="space-y-4"
    on:submit|preventDefault={submitPaste}
  >
    <div>
      <label for="title" class="block font-medium mb-1">Title</label>
      <input
        id="title"
        type="text"
        bind:value={title}
        class="w-full border border-gray-300 rounded p-2 focus:ring focus:outline-none"
        required
      />
    </div>
    <div>
      <label for="content" class="block font-medium mb-1">Content</label>
      <textarea
        id="content"
        bind:value={content}
        class="w-full border border-gray-300 rounded p-2 focus:ring focus:outline-none"
        rows="6"
        required
      ></textarea>
    </div>
    <button
      type="submit"
      class="bg-black text-white px-4 py-2 rounded"
    >
      Create Paste
    </button>
  </form>
</div>

<script>
  import { push } from 'svelte-spa-router'; 

  let title = '';
  let content = '';
  let error = '';

  const submitPaste = async () => {
    try {
      const response = await fetch('http://46.246.96.210:6969/pastes', {
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
  <div class="title" onclick="window.location.href='/'">
    <img src="favicon.png" alt="">
    <p>AzeBin</p>
  </div>
  <h2 class="mb--4">Welcome to AzeBin</h2>
  <p id="subtitle" class="mb-4">An open-sourced paste website, feel free to contribute on <a href="https://github.com/azedeveloper/azebin">GitHub</a>!</p>
  <p class="sub"><b>Create a Paste:</b></p>
  <div class="seperator"/>
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

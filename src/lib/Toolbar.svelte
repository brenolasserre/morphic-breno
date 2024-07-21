<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import Topbar from './Topbar.svelte';

  let contentEditable: HTMLElement;
  let currentSuggestions: string[] = [];
  let selectedTopLevelOption: string | null = null;
  let activeIndex: number = 0;
  let showAutocomplete: boolean = false;

  const topLevelOptions = ['Model', 'Style', 'Model Type'];
  const subOptions = {
    'Model': ['Lola', 'Sophia'],
    'Style': ['Anime', 'Ghibli', 'Cyberpunk', 'Comicbook'],
    'Model Type': ['Default', 'Depth', 'LinearArt'],
  };

 
function handleInput(event: InputEvent) {
  const text = contentEditable.textContent;
  const caretPosition = getCaretPosition(contentEditable);
  const lastAtSymbolIndex = text.lastIndexOf('@', caretPosition);

  if (text === '') {
    showAutocomplete = false;
    selectedTopLevelOption = null;
  } else if (lastAtSymbolIndex !== -1 && caretPosition - lastAtSymbolIndex <= 1) {
    currentSuggestions = selectedTopLevelOption ? subOptions[selectedTopLevelOption] : topLevelOptions;
    activeIndex = 0; 
    showAutocomplete = true;
  } else {
    showAutocomplete = false;
    selectedTopLevelOption = null;
  }
}

function handleKeyDown(event: KeyboardEvent) {
  if (showAutocomplete) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      activeIndex = (activeIndex + (event.key === 'ArrowDown' ? 1 : -1) + currentSuggestions.length) % currentSuggestions.length;
    } else if (event.key === 'Enter') {
      event.preventDefault();
      selectItem(currentSuggestions[activeIndex]);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      showAutocomplete = false;
    }
  } else if (event.key === 'Backspace') {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) {
      return;
    }
    const range = selection.getRangeAt(0);
    const node = range.startContainer;

    if (node.nodeType === Node.TEXT_NODE && range.startOffset === 0) {
      if (node.previousSibling?.classList?.contains('optionPillValue')) {
        event.preventDefault();
        const textNode = document.createTextNode('@');
        node.parentNode.insertBefore(textNode, node.previousSibling);
        node.previousSibling.remove();
        
        const newRange = document.createRange();
        newRange.setStart(textNode, 1);
        newRange.setEnd(textNode, 1);
        selection.removeAllRanges();
        selection.addRange(newRange);

        showAutocomplete = true;
        selectedTopLevelOption = null;
        currentSuggestions = topLevelOptions;
        activeIndex = 0;

        contentEditable.dispatchEvent(new Event('input'));
      }
    } else if (node.nodeType === Node.ELEMENT_NODE && node.classList?.contains('optionPillValue')) {
      event.preventDefault();
      const textNode = document.createTextNode('@');
      node.parentNode.insertBefore(textNode, node);
      node.remove();

      const newRange = document.createRange();
      newRange.setStart(textNode, 1);
      newRange.setEnd(textNode, 1);
      selection.removeAllRanges();
      selection.addRange(newRange);

      showAutocomplete = true;
      selectedTopLevelOption = null;
      currentSuggestions = topLevelOptions;
      activeIndex = 0;

      contentEditable.dispatchEvent(new Event('input'));
    }
  }
}
function selectItem(item: string) {
  if (topLevelOptions.includes(item)) {
    selectedTopLevelOption = item;
    currentSuggestions = subOptions[item];
    activeIndex = 0;
  } else {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return;

    const range = selection.getRangeAt(0);
    const node = range.startContainer;
    const text = node.textContent;
    const caretPosition = range.startOffset;
    const atSymbolIndex = text.lastIndexOf('@', caretPosition);

    if (atSymbolIndex !== -1) {
      const span = document.createElement('span');
      span.className = 'optionPillValue';
      span.textContent = `@${item}`;
      span.contentEditable = 'false';

      node.textContent = text.substring(0, atSymbolIndex);
      node.parentNode.insertBefore(span, node.nextSibling);
      const spaceNode = document.createTextNode(' ');
      node.parentNode.insertBefore(spaceNode, span.nextSibling);
      const afterTextNode = document.createTextNode(text.substring(caretPosition).trim() || '\u00A0');
      node.parentNode.insertBefore(afterTextNode, spaceNode.nextSibling);

      const newRange = document.createRange();
      newRange.setStartAfter(spaceNode);
      newRange.collapse(true);
      selection.removeAllRanges();
      selection.addRange(newRange);

      showAutocomplete = false;
      selectedTopLevelOption = null;
    }
  }
}

  function getCaretPosition(element: HTMLElement) {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0) return 0;

    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(element);
    preCaretRange.setEnd(range.endContainer, range.endOffset);
    return preCaretRange.toString().length;
  }

  onMount(() => {
    if (contentEditable) {
      contentEditable.addEventListener('input', handleInput);
      contentEditable.addEventListener('keydown', handleKeyDown);
    }
  });

  onDestroy(() => {
    if (contentEditable) {
      contentEditable.removeEventListener('input', handleInput);
      contentEditable.removeEventListener('keydown', handleKeyDown);
    }
  });
</script>

<div class="w-[70%] min-w-fit mx-auto rounded-t-[14px] bg-[#171717] border-b-0 border justify-center border-[#212121] flex gap-2 transition-all">
  {#if !showAutocomplete}
    <div class="fade-out-scale-down">
      <Topbar />
    </div>
  {/if}
  {#if showAutocomplete}
  <div class="py-2 rounded z-10 w-full ">
    <div class="mb-2 w-full flex justify-between text-[14px] pb-2 font-medium px-4 text-left text-[#525252] border-b border-[#212121]">
      {#if selectedTopLevelOption}
        {selectedTopLevelOption}
      {/if}
      {#if !selectedTopLevelOption}
        Settings
      {/if}
    </div>
    <div class="fade-in-scale-up">
    {#each currentSuggestions as suggestion, index}
    <div class="px-2">
      <button 
        type="button" 
        class="relative text-left p-2 cursor-pointer hover:bg-[#212121] w-full {index === activeIndex ? 'rounded-lg bg-[#212121] text-[#F5F5F5]' : 'text-[#737373]'}" 
        tabindex="0"
        on:click={() => selectItem(suggestion)} 
        on:keydown={(event) => handleKeyDown(event)}
      >
        {#if selectedTopLevelOption && selectedTopLevelOption !== 'Model Type'}
        <img 
          src={`/${suggestion}.png`} 
          alt={suggestion} 
          class="rounded-[4px] inline-block mr-2 w-6 h-6"
        >
        {/if}
        {suggestion}
        {#if index === activeIndex}
        <div class=" min-w-fit bg-[#0F0F0F] p-1 border border-[#212121] rounded-md absolute right-[.35em] top-[14%] flex gap-2 items-center">
          <div class="bg-[#212121] h-5 w-5 p-[2px] border border-[#212121] rounded-[4px] flex items-center justify-center">
            <img class="!w-[10px] !h-[10px]" src="/enter.svg" alt="enter">
          </div>
          <p class="flex items-center h-4 font-medium text-[#737373] text-sm mr-1">to select</p>
        </div>
        {/if}
      </button>
    </div>
    {/each}
    </div>
  </div>
  {/if}
</div>

<div class="w-[80%] mx-auto flex flex-col gap-3 rounded-[14px] bg-[#171717] drop-shadow-[0_2px_4px_rgba(0,0,0,0.16)] border border-[#212121]">
  <div class="border-b border-b-[#212121] pl-3 flex gap-4 items-center justify-start h-11 text-[14px]">
    <p class="text-[#F5F5F5] font-medium">Image</p>
    <p class="text-[#404040] font-medium">Video</p>
    <p class="text-[#404040] font-medium">Interpolation</p>
  </div>
  
  <div class="gap-2 px-2 pb-2 flex items-center relative">
    <div 
      bind:this={contentEditable} 
      contenteditable="true" 
      role="textbox" 
      tabindex="0" 
      on:keydown={handleKeyDown} 
      placeholder="Imagine.." 
      class="flex truncate items-center caret-[#0075FF] p-2 focus:outline-none shadow-[0_0px_0px_1px_rgba(0,0,0,1)] rounded-[6px] text-left w-full focus:ring-0 bg-[#171717] border border-[#262626] text-white h-11"
    ></div>
    <button class="bg-[#0075FF] text-[#F5F5F5] h-11 flex rounded-[6px] items-center">Generate</button>
  </div>
</div>

<style>
  [contenteditable]:empty:before {
    content: attr(placeholder);
    color: #737373;
    display: flex;
    align-items: center;
    cursor: text;
  }

  :global(.optionPillValue) {
    /* padding-left: 4px; */
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    color: #0075FF;
  }

  .fade-in-scale-up {
    @apply animate-fadeInScaleUp;
  }

  .fade-out-scale-down {
    @apply animate-fadeOutScaleDown;
  }
</style>
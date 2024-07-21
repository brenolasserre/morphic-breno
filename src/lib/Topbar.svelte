<style>
     .color {
      width: 12px;
      height: 12px;
      border-radius: 100%;
    }

    .divider {
      height: 100%;
      width: 1px !important;
      background: #212121;
      margin: 0 8px;
    }
    img {
    transition: filter 0.15s ease;
  }

  img:hover {
    filter: invert(100%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(100%) contrast(900%);
    cursor: pointer;

  }
</style>
<div class="px-2 gap-2 h-10 fade-in-scale-up flex items-center">
  <img src="/brush.svg" alt="brush">
  <img src="/circle.svg" alt="circle">
  <img src="/rectangle.svg" alt="rectangle">
  <img src="/eraser.svg" alt="eraser">
  <img src="/selectCursor.svg" alt="select">
  <div class="divider"></div>
  <img src="/small.svg" alt="small">
  <img src="/big.svg" alt="big">
  <div class="divider"></div>
  <div class="flex items-center gap-4">
    <div class="color bg-[#000000]"></div>
    <div class="color bg-[#737373]"></div>
    <div class="color bg-[#F5F5F5]"></div>
    <div class="color bg-[#0075FF]"></div>
    <div class="color bg-[#6F3BDD]"></div>
    <div class="color bg-[#D10B0B]"></div>
    <div class="color bg-[#F58400]"></div>
    <div class="color bg-[#26972A]"></div>
  </div>
  <div class="divider"></div>
  <img src="/undo.svg" alt="undo">
  <img src="/redo.svg" alt="redo">
</div>
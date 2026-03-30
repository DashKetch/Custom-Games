const main = document.body;
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

if (true) {
  main.innerHTML =
  `
  <iframe src="https://www.worldguessr.com/" class="fullscreen" frameborder="0" allowfullscreen></iframe>
  <div class="title">
    <h1>Worldguessr Anti-Cheat Made by Nate - Don't Tab Out!</h1>
  </div>
  `;
}

async function handleInactivity(reason) {
  // If the tab is hidden OR the window doesn't have focus (snapped/new window)
  if (document.hidden || !document.hasFocus()) {
    console.log(`User drifted: ${reason}`);

    // Prevent duplicate covers
    if (main.querySelector('.cover')) return;

    main.insertAdjacentHTML('afterbegin', `<div class="cover"></div>`);
    const currentCover = main.querySelector('.cover');

    await sleep(30000);

    if (currentCover) currentCover.remove();
  }
}

// "visibilitychange" catches tab switching and minimizing
document.addEventListener("visibilitychange", () => handleInactivity("visibility"));

// "blur" catches window snapping, clicking the taskbar, or new windows
window.addEventListener("blur", () => handleInactivity("blur"));

// Optional: check focus specifically when the mouse leaves the area
window.addEventListener("mouseleave", () => handleInactivity("mouseleave"));
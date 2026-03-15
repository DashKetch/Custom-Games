const main = document.querySelector('body');

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Add the listener once (no while loop needed)
document.addEventListener("visibilitychange", async () => {
  if (document.hidden) {
    console.log("User left the tab");

    // 1. Inject the cover
    main.insertAdjacentHTML('afterbegin', `<div class="cover"></div>`);

    // 2. Select the NEWLY created cover element
    const currentCover = main.querySelector('.cover');

    // 3. Wait 3 seconds
    await sleep(30000);

    // 4. Remove it
    if (currentCover) {
      currentCover.remove();
    }
  }
});

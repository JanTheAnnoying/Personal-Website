// =========================
// BACKGROUND MUSIC
// =========================

const backgroundMusic = new Audio("./assets/background.mp3");

backgroundMusic.loop = true;
backgroundMusic.volume = 0.5;
backgroundMusic.preload = "auto";

let musicStarted = false;

function startMusic() {

    if (musicStarted) return;

    backgroundMusic.play()
        .then(() => {
            musicStarted = true;
            console.log("[AUDIO] Background music started");
        })
        .catch((error) => {
            console.log("[AUDIO] Music playback failed:", error);
        });
}


// Start music when the user first interacts with the page
document.addEventListener("click", () => {

    if (!musicStarted) {
        startMusic();
    }

});


(() => {

    console.log("[AUDIO] audio.js loaded");


    // =========================
    // CLICK SOUND
    // =========================

    const clickSFX = new Audio("./assets/hover.mp3");

    clickSFX.volume = 1.0;
    clickSFX.preload = "auto";


    // =========================
    // FIND CLICKABLE ELEMENTS
    // =========================

    const clickables = document.querySelectorAll(
        "button, a, .gallery-image"
    );

    console.log(
        "[AUDIO] Found clickable elements:",
        clickables.length
    );


    // =========================
    // ADD SOUND TO EACH ELEMENT
    // =========================

    clickables.forEach((element) => {

        element.addEventListener("click", () => {

            console.log(
                "[AUDIO] Playing click sound:",
                element
            );

            clickSFX.currentTime = 0;

            clickSFX.play()
                .then(() => {
                    console.log("[AUDIO] SFX playing");
                })
                .catch((error) => {
                    console.error(
                        "[AUDIO] SFX failed:",
                        error
                    );
                });

        });

    });

})();
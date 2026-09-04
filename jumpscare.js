
(() => {

    // =========================
    // SETTINGS
    // =========================

    const triggerButtons = document.querySelectorAll(".button");

    console.log("[JUMPSCARE] Script loaded");
    console.log(
        "[JUMPSCARE] Trigger buttons:",
        triggerButtons.length
    );


    // =========================
    // STATE
    // =========================

    // Monika can only appear ONCE per page visit.
    // This becomes true ONLY if she actually triggers.
    let alreadyTriggered = false;


    // =========================
    // JUMPSCARE FUNCTION
    // =========================

    function triggerJumpscare() {

        // Lock out all future triggers
        alreadyTriggered = true;

        console.log("[JUMPSCARE] MONIKA TRIGGERED");


        // =========================
        // BLACK OVERLAY
        // =========================

        const overlay = document.createElement("div");

        Object.assign(overlay.style, {
            position: "fixed",
            inset: "0",
            background: "black",
            zIndex: "99999"
        });

        document.body.appendChild(overlay);


        // =========================
        // MONIKA IMAGE
        // =========================

        const monika = document.createElement("img");

        monika.src = "./assets/monika.png";
        monika.alt = "";

        Object.assign(monika.style, {
            position: "absolute",
            inset: "0",
            width: "100%",
            height: "100%",
            objectFit: "contain"
        });

        overlay.appendChild(monika);


        // =========================
        // GLITCH SFX
        // =========================

        const jumpscareSFX =
            new Audio("./assets/glitch1.ogg");

        jumpscareSFX.volume = 1.0;

        jumpscareSFX.play()
            .then(() => {
                console.log("[JUMPSCARE] Glitch playing");
            })
            .catch((error) => {
                console.error(
                    "[JUMPSCARE] Glitch blocked:",
                    error
                );
            });


        // =========================
        // GIGGLE SFX
        // =========================

        const giggleSFX =
            new Audio("./assets/giggle.ogg");

        giggleSFX.volume = 1.0;


        // =========================
        // REMOVE JUMPSCARE
        // =========================

        setTimeout(() => {

            overlay.remove();

            jumpscareSFX.pause();
            jumpscareSFX.currentTime = 0;

            console.log("[JUMPSCARE] Finished");

        }, 700);


        // =========================
        // PLAY GIGGLE
        // =========================

        setTimeout(() => {

            console.log("[JUMPSCARE] Playing giggle");

            giggleSFX.currentTime = 0;

            giggleSFX.play()
                .then(() => {
                    console.log("[JUMPSCARE] Giggle playing");
                })
                .catch((error) => {
                    console.error(
                        "[JUMPSCARE] Giggle blocked:",
                        error
                    );
                });

        }, 800);

    }


    // =========================================================
    // ENTRY GATE
    // =========================================================

    const welcome = document.createElement("div");

    welcome.id = "welcomeScreen";

    welcome.innerHTML = `
        <div id="welcomeBox">
            <div id="welcomeTitle">Welcome</div>
            <div id="welcomeSubtitle">
                Press anything to continue.
            </div>
        </div>
    `;


    // =========================
    // ENTRY GATE STYLE
    // =========================

    Object.assign(welcome.style, {
        position: "fixed",
        inset: "0",
        zIndex: "9999",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        background: "rgba(0, 0, 0, 0.45)",

        backdropFilter: "blur(15px)",
        WebkitBackdropFilter: "blur(15px)",

        cursor: "pointer"
    });


    // =========================
    // GLASS BOX
    // =========================

    const welcomeBox =
        welcome.querySelector("#welcomeBox");

    Object.assign(welcomeBox.style, {
        textAlign: "center",

        padding: "45px 70px",

        border: "1px solid rgba(255, 255, 255, 0.2)",
        borderRadius: "20px",

        background: "rgba(255, 255, 255, 0.08)",

        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",

        boxShadow: "0 8px 40px rgba(0, 0, 0, 0.35)"
    });


    // =========================
    // WELCOME TITLE
    // =========================

    const welcomeTitle =
        welcome.querySelector("#welcomeTitle");

    Object.assign(welcomeTitle.style, {
        fontSize: "48px",
        fontWeight: "700",

        letterSpacing: "8px",

        color: "white",

        marginBottom: "15px",

        textShadow:
            "0 0 20px rgba(255,255,255,0.25)"
    });


    // =========================
    // WELCOME SUBTITLE
    // =========================

    const welcomeSubtitle =
        welcome.querySelector("#welcomeSubtitle");

    Object.assign(welcomeSubtitle.style, {
        fontSize: "16px",

        letterSpacing: "2px",

        color: "rgba(255,255,255,0.7)"
    });


    document.body.appendChild(welcome);


    // =========================================================
    // ENTRY GATE INTERACTION
    // =========================================================

    let welcomeFinished = false;


    welcome.addEventListener("click", () => {

        if (welcomeFinished) return;

        welcomeFinished = true;

        console.log("[WELCOME] User continued");


        // =====================================================
        // SEPARATE 2% ENTRY CHANCE
        // =====================================================

        const welcomeRoll =
            Math.floor(Math.random() * 100) + 1;

        console.log(
            "[WELCOME] Roll:",
            welcomeRoll
        );


        // 1 or 2 = 2% chance
        if (welcomeRoll <= 2) {

            console.log("[WELCOME] 2% HIT");

            // Monika triggered from entry.
            // This permanently disables button triggers.
            triggerJumpscare();

            // Remove the gate immediately.
            welcome.remove();

            return;
        }


        // =====================================================
        // ENTRY MISSED
        // =====================================================

        console.log(
            "[WELCOME] No jumpscare — buttons remain active"
        );


        // Fade the gate away
        welcome.style.transition =
            "opacity 0.4s ease";

        welcome.style.opacity = "0";


        setTimeout(() => {
            welcome.remove();
        }, 400);

    });


    // =========================================================
    // NORMAL BUTTON TRIGGERS
    // =========================================================

    triggerButtons.forEach((button) => {

        button.addEventListener("click", () => {

            console.log(
                "[JUMPSCARE] Button clicked:",
                button.id
            );


            // =================================================
            // MONIKA ALREADY APPEARED
            // =================================================

            if (alreadyTriggered) {

                console.log(
                    "[JUMPSCARE] Already triggered this visit"
                );

                return;
            }


            // =================================================
            // SEPARATE 1/100 BUTTON CHANCE
            // =================================================

            const roll =
                Math.floor(Math.random() * 100) + 1;

            console.log(
                "[JUMPSCARE] Button roll:",
                roll
            );


            // Only 69 triggers Monika
            if (roll !== 69) {

                console.log(
                    "[JUMPSCARE] No jumpscare"
                );

                return;
            }


            // =================================================
            // BUTTON HIT
            // =================================================

            console.log(
                "[JUMPSCARE] 1/100 HIT"
            );

            triggerJumpscare();

        });

    });

})();


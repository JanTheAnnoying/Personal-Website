document.addEventListener("DOMContentLoaded", function () {

// =========================================================
// MODALS
// =========================================================

const modals = {
about: document.getElementById("aboutModal"),
projects: document.getElementById("projectsModal"),
achievements: document.getElementById("achievementsModal"),
games: document.getElementById("gamesModal"),
gallery: document.getElementById("galleryModal"),
socials: document.getElementById("socialsModal")
};

function openModal(modal) {
if (modal) {
modal.style.display = "flex";
}
}

function closeModal(modal) {
if (modal) {
modal.style.display = "none";
}
}

// =========================================================
// MAIN BUTTONS
// =========================================================

document.getElementById("aboutButton")?.addEventListener("click", function () {
openModal(modals.about);
});

document.getElementById("projectsButton")?.addEventListener("click", function () {
openModal(modals.projects);
});

document.getElementById("achievementsButton")?.addEventListener("click", function () {
openModal(modals.achievements);
});

document.getElementById("gamesButton")?.addEventListener("click", function () {
openModal(modals.games);
});

document.getElementById("galleryButton")?.addEventListener("click", function () {
openModal(modals.gallery);
});

document.getElementById("socialsButton")?.addEventListener("click", function () {
openModal(modals.socials);
});

// =========================================================
// CLOSE BUTTONS
// =========================================================

document.getElementById("closeAboutButton")?.addEventListener("click", function () {
closeModal(modals.about);
});

document.getElementById("closeProjectsButton")?.addEventListener("click", function () {
closeModal(modals.projects);
});

document.getElementById("closeAchievementsButton")?.addEventListener("click", function () {
closeModal(modals.achievements);
});

document.getElementById("closeGamesButton")?.addEventListener("click", function () {
closeModal(modals.games);
});

document.getElementById("closeGalleryButton")?.addEventListener("click", function () {
closeModal(modals.gallery);
});

document.getElementById("closeSocialsButton")?.addEventListener("click", function () {
closeModal(modals.socials);
});

// =========================================================
// CLICK OUTSIDE NORMAL MODALS
// =========================================================

Object.values(modals).forEach(function (modal) {


if (!modal) return;

modal.addEventListener("click", function (event) {

  if (event.target === modal) {
    closeModal(modal);
  }

});


});

// =========================================================
// IMAGE VIEWER
// =========================================================

document.querySelectorAll(".gallery-image").forEach(function (image) {


image.addEventListener("click", function () {

  console.log("IMAGE CLICKED:", image.src);

  const galleryModal = modals.gallery;

  if (!galleryModal) return;

  const oldGui = galleryModal.querySelector(".gui-box");

  if (!oldGui) return;


  // =======================================================
  // HIDE ORIGINAL GALLERY
  // =======================================================

  oldGui.style.display = "none";


  // =======================================================
  // CREATE VIEWER
  // =======================================================

  const viewer = document.createElement("div");

  viewer.className = "image-viewer-window";

  Object.assign(viewer.style, {

    position: "absolute",
    inset: "0",
    width: "100%",
    height: "100%",

    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    padding: "20px",

    zIndex: "2000",

    background: "transparent"

  });


  // =======================================================
  // VIEWER WINDOW
  // =======================================================

  const viewerWindow = document.createElement("div");

  Object.assign(viewerWindow.style, {

    position: "relative",

    width: "min(1100px, 92%)",
    height: "min(720px, 85vh)",

    padding: "25px",

    display: "flex",
    flexDirection: "column",

    overflow: "hidden",

    background: "rgba(20, 20, 30, 0.92)",

    border: "1px solid rgba(255, 255, 255, 0.15)",

    borderRadius: "22px",

    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)"

  });


  // =======================================================
  // HEADER
  // =======================================================

  const header = document.createElement("div");

  Object.assign(header.style, {

    flex: "0 0 auto",

    padding: "0 55px 18px 0"

  });


  // =======================================================
  // TITLE
  // =======================================================

  const title = document.createElement("h2");

  title.textContent =
    image.dataset.title ||
    image.alt ||
    "Gallery Image";

  Object.assign(title.style, {

    margin: "0 0 8px 0",

    fontSize: "28px",

    lineHeight: "1.25"

  });


  // =======================================================
  // DESCRIPTION
  // =======================================================

  const description = document.createElement("p");

  description.textContent =
    image.dataset.description ||
    "A closer look at this gallery image.";

  Object.assign(description.style, {

    margin: "0",

    color: "rgba(255, 255, 255, 0.70)",

    fontSize: "15px",

    lineHeight: "1.5"

  });


  header.appendChild(title);
  header.appendChild(description);


  // =======================================================
  // IMAGE FRAME
  // =======================================================

  const imageFrame = document.createElement("div");

  Object.assign(imageFrame.style, {

    flex: "1 1 auto",

    minHeight: "0",

    width: "100%",

    display: "flex",

    justifyContent: "center",
    alignItems: "center",

    overflow: "hidden",

    position: "relative",

    background: "rgba(0, 0, 0, 0.20)",

    border: "1px solid rgba(255, 255, 255, 0.10)",

    borderRadius: "15px",

    cursor: "grab"

  });


  // =======================================================
  // FULL IMAGE
  // =======================================================

  const fullImage = document.createElement("img");

  /*
   * IMPORTANT:
   * Use getAttribute("src") rather than relying only on
   * image.src. This preserves the original relative path.
   * PNG and JPG both work.
   */

  fullImage.src = image.getAttribute("src");

  fullImage.alt = image.alt || "";

  fullImage.draggable = false;

  Object.assign(fullImage.style, {

    maxWidth: "100%",
    maxHeight: "100%",

    width: "auto",
    height: "auto",

    objectFit: "contain",

    userSelect: "none",

    pointerEvents: "auto",

    transformOrigin: "center center",

    transition: "transform 0.08s ease-out",

    cursor: "grab"

  });


  // =======================================================
  // ZOOM / PAN
  // =======================================================

  let scale = 1;

  let translateX = 0;
  let translateY = 0;

  let dragging = false;

  let startX = 0;
  let startY = 0;


  function updateImage() {

    fullImage.style.transform =
      `translate(${translateX}px, ${translateY}px) scale(${scale})`;

  }


  function resetImage() {

    scale = 1;

    translateX = 0;
    translateY = 0;

    fullImage.style.transition =
      "transform 0.2s ease";

    updateImage();

  }


  // =======================================================
  // ZOOM WITH MOUSE WHEEL
  // =======================================================

  imageFrame.addEventListener("wheel", function (event) {

    event.preventDefault();

    const zoomAmount = 0.15;

    if (event.deltaY < 0) {

      scale += zoomAmount;

    } else {

      scale -= zoomAmount;

    }

    scale = Math.max(
      0.5,
      Math.min(scale, 5)
    );

    fullImage.style.transition =
      "transform 0.08s ease-out";

    updateImage();

  }, { passive: false });


  // =======================================================
  // DRAG START
  // =======================================================

  imageFrame.addEventListener("mousedown", function (event) {

    if (event.button !== 0) return;

    dragging = true;

    startX =
      event.clientX - translateX;

    startY =
      event.clientY - translateY;

    imageFrame.style.cursor = "grabbing";

    fullImage.style.cursor = "grabbing";

    fullImage.style.transition = "none";

    event.preventDefault();

  });


  // =======================================================
  // DRAG MOVE
  // =======================================================

  function mouseMoveHandler(event) {

    if (!dragging) return;

    translateX =
      event.clientX - startX;

    translateY =
      event.clientY - startY;

    updateImage();

  }


  document.addEventListener(
    "mousemove",
    mouseMoveHandler
  );


  // =======================================================
  // DRAG END
  // =======================================================

  function mouseUpHandler() {

    if (!dragging) return;

    dragging = false;

    imageFrame.style.cursor = "grab";

    fullImage.style.cursor = "grab";

    fullImage.style.transition =
      "transform 0.08s ease-out";

  }


  document.addEventListener(
    "mouseup",
    mouseUpHandler
  );


  // =======================================================
  // DOUBLE CLICK = RESET
  // =======================================================

  fullImage.addEventListener("dblclick", function (event) {

    event.preventDefault();

    resetImage();

  });


  // =======================================================
  // CLOSE BUTTON
  // =======================================================

  const closeButton = document.createElement("button");

  closeButton.textContent = "×";

  closeButton.setAttribute(
    "aria-label",
    "Close image viewer"
  );

  Object.assign(closeButton.style, {

    position: "absolute",

    top: "15px",
    right: "18px",

    width: "35px",
    height: "35px",

    border: "none",

    borderRadius: "50%",

    color: "white",

    background: "rgba(255, 255, 255, 0.10)",

    fontSize: "24px",

    cursor: "pointer",

    zIndex: "10",

    transition: "0.2s"

  });


  closeButton.addEventListener("mouseenter", function () {

    closeButton.style.background =
      "rgba(255, 255, 255, 0.20)";

  });


  closeButton.addEventListener("mouseleave", function () {

    closeButton.style.background =
      "rgba(255, 255, 255, 0.10)";

  });


  // =======================================================
  // CLOSE VIEWER
  // =======================================================

  function closeViewer() {

    document.removeEventListener(
      "mousemove",
      mouseMoveHandler
    );

    document.removeEventListener(
      "mouseup",
      mouseUpHandler
    );

    viewer.remove();

    // Restore the original Gallery popup.
    oldGui.style.display = "";

  }


  // =======================================================
  // CLOSE BUTTON CLICK
  // =======================================================

  closeButton.addEventListener("click", function (event) {

    event.stopPropagation();

    closeViewer();

  });


  // =======================================================
  // BUILD VIEWER
  // =======================================================

  imageFrame.appendChild(fullImage);

  viewerWindow.appendChild(header);

  viewerWindow.appendChild(imageFrame);

  viewerWindow.appendChild(closeButton);

  viewer.appendChild(viewerWindow);

  galleryModal.appendChild(viewer);


  // =======================================================
  // INITIALIZE
  // =======================================================

  resetImage();

  console.log("IMAGE VIEWER OPENED");

});

});

// =========================================================
// ESCAPE KEY
// =========================================================

document.addEventListener("keydown", function (event) {


if (event.key !== "Escape") return;


// Check if image viewer is open.

const viewer =
  document.querySelector(".image-viewer-window");


if (viewer) {

  viewer.remove();


  const galleryModal = modals.gallery;

  const oldGui =
    galleryModal?.querySelector(".gui-box");


  if (oldGui) {

    oldGui.style.display = "";

  }


  return;

}


// Otherwise close normal modals.

Object.values(modals).forEach(function (modal) {

  closeModal(modal);

});


});

});

document.addEventListener("DOMContentLoaded", function () {

  /* =========================================================
     MODALS
     ========================================================= */

  const modals = {
    about: document.getElementById("aboutModal"),
    projects: document.getElementById("projectsModal"),
    achievements: document.getElementById("achievementsModal"),
    games: document.getElementById("gamesModal"),
    gallery: document.getElementById("galleryModal"),
    socials: document.getElementById("socialsModal")
  };

  const card = document.querySelector(".card");

  let activeModal = null;
  let activeViewer = null;


  /* =========================================================
     CARD POSITION
     ========================================================= */

  function moveCardLeft() {

    if (!card) return;

    card.classList.add("card-shifted");
  }


  function moveCardBack() {

    if (!card) return;

    card.classList.remove("card-shifted");
  }


  /* =========================================================
     CLOSE IMAGE VIEWER
     ========================================================= */

  function closeImageViewer() {

    if (!activeViewer) return;

    if (activeViewer.cleanup) {
      activeViewer.cleanup();
    }

    activeViewer.remove();

    activeViewer = null;
  }


  /* =========================================================
     CLOSE MODAL
     ========================================================= */

  function closeModal(modal) {

    if (!modal) return;

    if (modal === modals.gallery) {
      closeImageViewer();
    }

    modal.classList.remove("active");

    modal.style.display = "none";

    if (activeModal === modal) {
      activeModal = null;
    }

    moveCardBack();
  }


  /* =========================================================
     CLOSE ALL MODALS
     ========================================================= */

  function closeAllModals() {

    Object.values(modals).forEach(function (modal) {

      if (!modal) return;

      modal.classList.remove("active");
      modal.style.display = "none";
    });

    closeImageViewer();

    activeModal = null;

    moveCardBack();
  }


  /* =========================================================
     OPEN MODAL
     ========================================================= */

  function openModal(modal) {

    if (!modal) return;


    /*
     * Close the currently open GUI first.
     *
     * This is what prevents windows from stacking.
     */

    if (activeModal && activeModal !== modal) {
      closeModal(activeModal);
    }


    /*
     * Remove any stale viewer.
     */

    if (modal !== modals.gallery) {
      closeImageViewer();
    }


    modal.classList.add("active");

    modal.style.display = "block";

    activeModal = modal;

    moveCardLeft();


    /*
     * Force the GUI animation to restart.
     */

    const gui = modal.querySelector(".gui-box");

    if (gui) {

      gui.style.animation = "none";

      void gui.offsetWidth;

      gui.style.animation =
        "guiAppear 0.35s cubic-bezier(0.16, 1, 0.3, 1)";
    }
  }


  /* =========================================================
     MAIN BUTTONS
     ========================================================= */

  const buttonMap = {

    aboutButton: "about",
    projectsButton: "projects",
    achievementsButton: "achievements",
    gamesButton: "games",
    galleryButton: "gallery",
    socialsButton: "socials"

  };


  Object.entries(buttonMap).forEach(function ([buttonId, modalName]) {

    const button =
      document.getElementById(buttonId);

    const modal =
      modals[modalName];


    if (!button || !modal) return;


    button.addEventListener("click", function (event) {

      event.preventDefault();
      event.stopPropagation();

      openModal(modal);
    });

  });


  /* =========================================================
     CLOSE BUTTONS
     ========================================================= */

  const closeButtonMap = {

    closeAboutButton: "about",
    closeProjectsButton: "projects",
    closeAchievementsButton: "achievements",
    closeGamesButton: "games",
    closeGalleryButton: "gallery",
    closeSocialsButton: "socials"

  };


  Object.entries(closeButtonMap).forEach(function ([buttonId, modalName]) {

    const button =
      document.getElementById(buttonId);

    const modal =
      modals[modalName];


    if (!button || !modal) return;


    button.addEventListener("click", function (event) {

      event.preventDefault();
      event.stopPropagation();

      closeModal(modal);
    });

  });


  /* =========================================================
     CLICK OUTSIDE GUI
     
     Since the modal itself has pointer-events disabled,
     this only matters if the modal catches an event.
     ========================================================= */

  Object.values(modals).forEach(function (modal) {

    if (!modal) return;


    modal.addEventListener("click", function (event) {

      if (event.target === modal) {
        closeModal(modal);
      }

    });

  });


  /* =========================================================
     IMAGE VIEWER
     ========================================================= */

  document.querySelectorAll(".gallery-image").forEach(function (image) {

    image.addEventListener("click", function (event) {

      event.preventDefault();
      event.stopPropagation();


      const galleryModal =
        modals.gallery;


      if (!galleryModal) return;


      const oldGui =
        galleryModal.querySelector(".gui-box");


      if (!oldGui) return;


      /*
       * Remove an existing viewer.
       * This guarantees only one image viewer exists.
       */

      closeImageViewer();


      oldGui.style.display = "none";


      /* =====================================================
         CREATE VIEWER
         ===================================================== */

      const viewer =
        document.createElement("div");


      viewer.className =
        "image-viewer-window";


      /* =====================================================
         HEADER
         ===================================================== */

      const header =
        document.createElement("div");


      header.className =
        "image-viewer-header";


      const title =
        document.createElement("h2");


      title.textContent =
        image.dataset.title ||
        image.alt ||
        "Gallery Image";


      const description =
        document.createElement("p");


      description.textContent =
        image.dataset.description ||
        "A closer look at this gallery image.";


      header.appendChild(title);
      header.appendChild(description);


      /* =====================================================
         IMAGE FRAME
         ===================================================== */

      const imageFrame =
        document.createElement("div");


      imageFrame.className =
        "image-frame";


      /* =====================================================
         FULL IMAGE
         ===================================================== */

      const fullImage =
        document.createElement("img");


      fullImage.className =
        "zoomable-image";


      fullImage.src =
        image.getAttribute("src");


      fullImage.alt =
        image.alt || "";


      fullImage.draggable =
        false;


      /* =====================================================
         ZOOM / PAN
         ===================================================== */

      let scale = 1;

      let translateX = 0;
      let translateY = 0;

      let dragging = false;

      let startX = 0;
      let startY = 0;


      function updateImage() {

        fullImage.style.transform =
          "translate(" +
          translateX +
          "px, " +
          translateY +
          "px) scale(" +
          scale +
          ")";
      }


      function resetImage() {

        scale = 1;

        translateX = 0;
        translateY = 0;

        fullImage.style.transition =
          "transform 0.2s ease";

        updateImage();
      }


      /* =====================================================
         ZOOM
         ===================================================== */

      imageFrame.addEventListener(
        "wheel",
        function (event) {

          event.preventDefault();
          event.stopPropagation();


          const zoomAmount = 0.15;


          if (event.deltaY < 0) {
            scale += zoomAmount;
          } else {
            scale -= zoomAmount;
          }


          scale =
            Math.max(
              0.5,
              Math.min(scale, 5)
            );


          fullImage.style.transition =
            "transform 0.08s ease-out";


          updateImage();

        },
        { passive: false }
      );


      /* =====================================================
         DRAG START
         ===================================================== */

      imageFrame.addEventListener(
        "mousedown",
        function (event) {

          if (event.button !== 0) return;


          dragging = true;


          startX =
            event.clientX - translateX;


          startY =
            event.clientY - translateY;


          imageFrame.style.cursor =
            "grabbing";


          fullImage.style.cursor =
            "grabbing";


          fullImage.style.transition =
            "none";


          event.preventDefault();
        }
      );


      /* =====================================================
         DRAG MOVE
         ===================================================== */

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


      /* =====================================================
         DRAG END
         ===================================================== */

      function mouseUpHandler() {

        if (!dragging) return;


        dragging = false;


        imageFrame.style.cursor =
          "grab";


        fullImage.style.cursor =
          "grab";


        fullImage.style.transition =
          "transform 0.08s ease-out";
      }


      document.addEventListener(
        "mouseup",
        mouseUpHandler
      );


      /* =====================================================
         DOUBLE CLICK RESET
         ===================================================== */

      fullImage.addEventListener(
        "dblclick",
        function (event) {

          event.preventDefault();

          resetImage();
        }
      );


      /* =====================================================
         CLOSE BUTTON
         ===================================================== */

      const closeButton =
        document.createElement("button");


      closeButton.className =
        "image-viewer-close";


      closeButton.textContent =
        "×";


      closeButton.setAttribute(
        "aria-label",
        "Close image viewer"
      );


      closeButton.addEventListener(
        "click",
        function (event) {

          event.preventDefault();
          event.stopPropagation();

          closeImageViewer();
        }
      );


      /* =====================================================
         CLEANUP
         ===================================================== */

      function cleanup() {

        document.removeEventListener(
          "mousemove",
          mouseMoveHandler
        );


        document.removeEventListener(
          "mouseup",
          mouseUpHandler
        );


        oldGui.style.display = "";
      }


      /*
       * Store cleanup function on the viewer so
       * closeImageViewer() can properly destroy it.
       */

      viewer.cleanup = cleanup;


      /* =====================================================
         BUILD VIEWER
         ===================================================== */

      imageFrame.appendChild(fullImage);

      viewer.appendChild(header);

      viewer.appendChild(imageFrame);

      viewer.appendChild(closeButton);

      document.body.appendChild(viewer);


      activeViewer =
        viewer;


      /* =====================================================
         INITIALIZE
         ===================================================== */

      resetImage();
    });

  });


  /* =========================================================
     ESCAPE KEY
     ========================================================= */

  document.addEventListener(
    "keydown",
    function (event) {

      if (event.key !== "Escape") return;


      /*
       * Image viewer closes first.
       */

      if (activeViewer) {

        closeImageViewer();

        return;
      }


      /*
       * Then normal GUI.
       */

      if (activeModal) {

        closeModal(activeModal);

        return;
      }

    }
  );

});

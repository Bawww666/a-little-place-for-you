
document.addEventListener("DOMContentLoaded", () => {
  // =========================
  // BACKGROUND MUSIC
  // =========================
  const bgMusic = document.getElementById("bgMusic");
  const musicToggle = document.getElementById("musicToggle");

  bgMusic.volume = 0.5;

  function updateMusicButton() {
    musicToggle.textContent = bgMusic.paused
      ? "♫ Music Off"
      : "♫ Music On";
  }

  // Coba putar musik saat halaman selesai dimuat.
  // Browser mungkin menolak autoplay bersuara.
  function tryAutoplay() {
    bgMusic.play()
      .then(() => {
        updateMusicButton();
      })
      .catch(() => {
        updateMusicButton();
        console.log(
          "Autoplay diblokir browser. Tekan tombol Music On untuk memulai."
        );
      });
  }

  tryAutoplay();

  // Tombol musik untuk play/pause.
  musicToggle.addEventListener("click", async () => {
    if (bgMusic.paused) {
      try {
        await bgMusic.play();
        showToast("Music is playing ♡");
      } catch (error) {
        showToast("Musik belum bisa diputar. Periksa file MP3.");
      }
    } else {
      bgMusic.pause();
    }

    updateMusicButton();
  });

  bgMusic.addEventListener("play", updateMusicButton);
  bgMusic.addEventListener("pause", updateMusicButton);

  // Jika autoplay diblokir, interaksi pertama mencoba memulai musik.
  let firstInteractionHandled = false;

  async function startMusicOnFirstInteraction() {
    if (firstInteractionHandled) return;
    firstInteractionHandled = true;

    if (bgMusic.paused) {
      try {
        await bgMusic.play();
        updateMusicButton();
      } catch (error) {
        // Tombol musik tetap tersedia jika browser menolak.
      }
    }
  }

  document.addEventListener(
    "pointerdown",
    startMusicOnFirstInteraction,
    { once: true }
  );

  // =========================
  // TOAST MESSAGE
  // =========================
  const toast = document.getElementById("toast");
  let toastTimeout;

  function showToast(message) {
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 2500);
  }

  // =========================
  // GALLERY FILTER
  // =========================
  const filterButtons = document.querySelectorAll(".filter-button");
  const photoCards = document.querySelectorAll(".photo-card");

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;

      filterButtons.forEach((item) => {
        item.classList.toggle("active", item === button);
      });

      photoCards.forEach((card) => {
        const matches =
          filter === "all" || card.dataset.category === filter;

        card.style.display = matches ? "" : "none";
      });
    });
  });

  // =========================
  // PHOTO LIGHTBOX
  // =========================
  const lightbox = document.getElementById("lightbox");
  const lightboxImage = document.getElementById("lightboxImage");
  const lightboxCaption = document.getElementById("lightboxCaption");
  const lightboxNote = document.getElementById("lightboxNote");
  const closeLightbox = document.getElementById("closeLightbox");
  const prevPhoto = document.getElementById("prevPhoto");
  const nextPhoto = document.getElementById("nextPhoto");

  let currentPhotoIndex = 0;
  let visibleCards = [];

  function getVisibleCards() {
    return Array.from(photoCards).filter(
      (card) => card.style.display !== "none"
    );
  }

  function showPhoto(index) {
    visibleCards = getVisibleCards();

    if (!visibleCards.length) return;

    currentPhotoIndex =
      (index + visibleCards.length) % visibleCards.length;

    const card = visibleCards[currentPhotoIndex];
    const image = card.querySelector("img");
    const title = card.querySelector("h3");

    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = title
      ? title.textContent
      : "A little memory";

    lightboxNote.textContent = card.dataset.note || "";

    lightbox.classList.add("active");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function hideLightbox() {
    lightbox.classList.remove("active");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  photoCards.forEach((card) => {
    card.addEventListener("click", () => {
      visibleCards = getVisibleCards();
      const index = visibleCards.indexOf(card);
      showPhoto(index >= 0 ? index : 0);
    });
  });

  closeLightbox.addEventListener("click", hideLightbox);

  prevPhoto.addEventListener("click", () => {
    showPhoto(currentPhotoIndex - 1);
  });

  nextPhoto.addEventListener("click", () => {
    showPhoto(currentPhotoIndex + 1);
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) {
      hideLightbox();
    }
  });

  // =========================
  // LETTER MODAL
  // =========================
  const letterModal = document.getElementById("letterModal");
  const openLetter = document.getElementById("openLetter");
  const closeLetter = document.getElementById("closeLetter");

  function showLetter() {
    letterModal.classList.add("active");
    letterModal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function hideLetter() {
    letterModal.classList.remove("active");
    letterModal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  openLetter.addEventListener("click", showLetter);
  closeLetter.addEventListener("click", hideLetter);

  letterModal.addEventListener("click", (event) => {
    if (event.target === letterModal) {
      hideLetter();
    }
  });

  // =========================
  // KEYBOARD CONTROLS
  // =========================
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      hideLightbox();
      hideLetter();
    }

    if (lightbox.classList.contains("active")) {
      if (event.key === "ArrowLeft") {
        showPhoto(currentPhotoIndex - 1);
      }

      if (event.key === "ArrowRight") {
        showPhoto(currentPhotoIndex + 1);
      }
    }
  });

  console.log("A Little Place for You is ready ♡");
});

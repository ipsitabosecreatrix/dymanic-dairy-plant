const imageView = document.getElementById("imageView");
const videoView = document.getElementById("videoView");
const backBtn = document.getElementById("backBtn");
const poiContainer = document.getElementById("poiContainer");

const pois = document.querySelectorAll(".poi");

let currentZone = null;
let isTransitioning = false;

window.addEventListener("load", positionPOIs);
window.addEventListener("resize", positionPOIs);

const POI_POSITIONS = {
  cowfarm: { x: 0.40, y: 0.1 },
  milk: { x: 0.15, y: 0.4 },
  rmst: { x: 0.30, y: 0.3 },
  pmst: { x: 0.42, y: 0.2 },
  pasteurisation: { x: 0.40, y: 0.35 },
  cip: { x: 0.51, y: 0.46 },
  office: { x: 0.25, y: 0.46 },
  controlroom: { x: 0.32, y: 0.5 },
  lab: { x: 0.44, y: 0.60 },
  packaging: { x: 0.57, y: 0.67 },
  butter: { x: 0.58, y: 0.45 },
  yogurt: { x: 0.72, y: 0.75 },
  warehouse: { x: 0.80, y: 0.55 },
  shipping: { x: 0.83, y: 0.34 },
  www: { x: 0.65, y: 0.18 },
  ev: { x: 0.26, y: 0.60 },
  grid: { x: 0.15, y: 0.20 },
  chiller: { x: 0.25, y: 0.21 }
};

function positionPOIs() {
  const img = imageView;

  const containerWidth = window.innerWidth;
  const containerHeight = window.innerHeight;

  const imgRatio = img.naturalWidth / img.naturalHeight;
  const containerRatio = containerWidth / containerHeight;

  let displayedWidth, displayedHeight, offsetX, offsetY;

  if (containerRatio > imgRatio) {
    // screen is wider → image fills width
    displayedWidth = containerWidth;
    displayedHeight = containerWidth / imgRatio;
    offsetX = 0;
    offsetY = (containerHeight - displayedHeight) / 2;
  } else {
    // screen is taller → image fills height
    displayedHeight = containerHeight;
    displayedWidth = containerHeight * imgRatio;
    offsetY = 0;
    offsetX = (containerWidth - displayedWidth) / 2;
  }

  document.querySelectorAll(".poi").forEach((btn) => {
    const zone = btn.dataset.zone;
    const pos = POI_POSITIONS[zone];

    if (!pos) return;

    const x = offsetX + pos.x * displayedWidth;
    const y = offsetY + pos.y * displayedHeight;

    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;
  });
}


const zones = {
  cowfarm: {
    image: "/images/cowfarm.png",
    inVideo: "/videos/cowfarmIN.mkv",
    outVideo: "/videos/cowfarmOUT.mkv"
  },
  milk: {
    image: "/images/milk.png",
    inVideo: "/videos/milkIN.mkv",
    outVideo: "/videos/milkOUT.mkv"
  },
  rmst: {
    image: "/images/rmst.png",
    inVideo: "/videos/rmstIN.mkv",
    outVideo: "/videos/rmstOUT.mkv"
  },
  pmst: {
    image: "/images/pmst.png",
    inVideo: "/videos/pmstIN.mkv",
    outVideo: "/videos/pmstOUT.mkv"
  },
  pasteurisation: {
    image: "/images/pasteur.png",
    inVideo: "/videos/pasteurIN.mkv",
    outVideo: "/videos/pasteurOUT.mkv"
  },
  cip: {
    image: "/images/cip.png",
    inVideo: "/videos/cipIN.mkv",
    outVideo: "/videos/cipOUT.mkv"
  },
  office: {
    image: "/images/office.png",
    inVideo: "/videos/officeIN.mkv",
    outVideo: "/videos/officeOUT.mkv"
  },
  controlroom: {
    image: "/images/control.png",
    inVideo: "/videos/controlIN.mkv",
    outVideo: "/videos/controlOUT.mkv"
  },
  lab: {
    image: "/images/lab.png",
    inVideo: "/videos/labIN.mkv",
    outVideo: "/videos/labOUT.mkv"
  },
  packaging: {
    image: "/images/pack.png",
    inVideo: "/videos/packIN.mkv",
    outVideo: "/videos/packOUT.mkv"
  },
  butter: {
    image: "/images/butter.png",
    inVideo: "/videos/butterIN.mkv",
    outVideo: "/videos/butterOUT.mkv"
  },
  yogurt: {
    image: "/images/yogurt.png",
    inVideo: "/videos/yogurtIN.mkv",
    outVideo: "/videos/yogurtOUT.mkv"
  },
  warehouse: {
    image: "/images/ware.png",
    inVideo: "/videos/wareIN.mkv",
    outVideo: "/videos/wareOUT.mkv"
  },
  shipping: {
    image: "/images/ship.png",
    inVideo: "/videos/shipIN.mkv",
    outVideo: "/videos/shipOUT.mkv"
  },
  www: {
    image: "/images/www.png",
    inVideo: "/videos/wwwIN.mkv",
    outVideo: "/videos/wwwOUT.mkv"
  },
  ev: {
    image: "/images/ev.png",
    inVideo: "/videos/evIN.mp4",
    outVideo: "/videos/evOUT.mkv"
  },
  grid: {
    image: "/images/grid.png",
    inVideo: "/videos/gridIN.mkv",
    outVideo: "/videos/gridOUT.mkv"
  },
  chiller: {
    image: "/images/chill.png",
    inVideo: "/videos/chillIN.mkv",
    outVideo: "/videos/chillOUT.mkv"
  }
};

pois.forEach((btn) => {
  btn.addEventListener("click", () => {
    if (isTransitioning) return;

    const zone = btn.dataset.zone;
    playTransition(zone, "in");
  });
});

backBtn.addEventListener("click", () => {
  if (!currentZone || isTransitioning) return;

  playTransition(currentZone, "out");
});

function playTransition(zone, direction) {
  isTransitioning = true;

  const data = zones[zone];
  const videoSrc = direction === "in" ? data.inVideo : data.outVideo;

  // Hide UI
  poiContainer.style.display = "none";
  backBtn.style.display = "none";

  // Set video source
  videoView.src = videoSrc;
  videoView.currentTime = 0;

  // Step 1: wait for enough data
  videoView.onloadeddata = () => {
    // Step 2: force browser to render a frame
    videoView.play().then(() => {
      videoView.pause();

      // Step 3: NOW fade in video (image still visible underneath)
      videoView.style.opacity = "1";

      // Small delay ensures first frame is painted
      setTimeout(() => {
        videoView.play();

        // Step 4: fade out image AFTER video is visible
        imageView.style.opacity = "0";
      }, 50);
    });
  };

  videoView.onended = () => {
    // Prepare next image FIRST
    if (direction === "in") {
      imageView.src = data.image;
      currentZone = zone;
      backBtn.style.display = "block";
    } else {
      imageView.src = "/images/home.png";
      currentZone = null;
      poiContainer.style.display = "block";
    }

    // Show image underneath
    imageView.style.opacity = "1";

    // Fade out video
    videoView.style.opacity = "0";

    isTransitioning = false;
  };
}


function preloadVideos() {
  Object.values(zones).forEach((zone) => {
    const v1 = document.createElement("video");
    v1.src = zone.inVideo;
    v1.preload = "auto";

    const v2 = document.createElement("video");
    v2.src = zone.outVideo;
    v2.preload = "auto";
  });
}

preloadVideos();

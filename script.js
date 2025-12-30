let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    // ---------------------------------------------------------
    // MOUSE & TOUCH MOVE
    // ---------------------------------------------------------
    const moveHandler = (e) => {
      // Check if it's touch or mouse
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      if (!this.rotating) {
        this.mouseX = clientX;
        this.mouseY = clientY;

        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      const dirX = clientX - this.mouseTouchX;
      const dirY = clientY - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (180 * angle) / Math.PI;
      degrees = (360 + Math.round(degrees)) % 360;

      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;

        paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
      }
    };

    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("touchmove", moveHandler, { passive: false });

    // ---------------------------------------------------------
    // MOUSE & TOUCH DOWN
    // ---------------------------------------------------------
    const downHandler = (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;
      
      paper.style.zIndex = highestZ;
      highestZ += 1;

      // Check if it's touch or mouse
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;

      this.mouseTouchX = clientX;
      this.mouseTouchY = clientY;
      this.prevMouseX = clientX;
      this.prevMouseY = clientY;

      // Right click for rotation (Mouse only)
      if (e.button === 2) {
        this.rotating = true;
      }
    };

    paper.addEventListener("mousedown", downHandler);
    paper.addEventListener("touchstart", downHandler, { passive: false });

    // ---------------------------------------------------------
    // MOUSE & TOUCH UP
    // ---------------------------------------------------------
    const upHandler = () => {
      this.holdingPaper = false;
      this.rotating = false;
    };

    window.addEventListener("mouseup", upHandler);
    window.addEventListener("touchend", upHandler);
  }
}

// Disable context menu so right-click rotation works cleanly
document.addEventListener('contextmenu', event => event.preventDefault());

const papers = Array.from(document.querySelectorAll(".paper"));
papers.forEach((paper) => {
  const p = new Paper();
  p.init(paper);
});

/* ================= 🦋 BUTTERFLY LOGIC ================= */

const butterfly = document.getElementById("butterfly");
let direction = 1; // 1 = left → right, -1 = right → left

function flyButterfly() {
  if (!butterfly) return;

  const screenWidth = window.innerWidth;
  // Random height between 50px and window height - 200px
  const randomTop = Math.random() * (window.innerHeight - 200) + 50;

  direction *= -1;
  butterfly.style.top = randomTop + "px";
  // The duration of the flight (12s)
  butterfly.style.transition = "left 12s linear";

  if (direction === 1) {
    // Flying Right
    butterfly.style.left = "-120px"; // Start off-screen left
    butterfly.style.transform = "scaleX(1)"; // Face right
    
    // Trigger the animation to the right
    setTimeout(() => {
      butterfly.style.left = (screenWidth + 120) + "px";
    }, 50); // Small delay to ensure CSS transition catches
    
  } else {
    // Flying Left
    butterfly.style.left = (screenWidth + 120) + "px"; // Start off-screen right
    butterfly.style.transform = "scaleX(-1)"; // Face left
    
    // Trigger the animation to the left
    setTimeout(() => {
      butterfly.style.left = "-120px";
    }, 50);
  }
}

// Start flying
if (butterfly) {
  flyButterfly();
  setInterval(flyButterfly, 13000); // Repeat every 13 seconds

  // ❤️ Click interaction
  butterfly.addEventListener("click", () => {
    alert("i love you 3000 ❤️");
  });
}
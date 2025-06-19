let buttons = [];
let enteredCode = "";
let correctCode = "6924";
let message = "";

let fadeAlpha = 255;      // For fading out the entered code
let fadeStartTime = 0;
let fadeDuration = 3000;  // milliseconds before text fully fades

let spriteImg;
let successImg;           // Image to show on success
let unlocked = false;     // Flag to show success image

function preload() {
  spriteImg = loadImage('legende.png');
  // Replace with your success image file or URL
  successImg = loadImage('success.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  createKeypad();
  noSmooth();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  createKeypad();
}

function createKeypad() {
  buttons = [];
  let btnSize = 60;
  let padding = 10;

  let totalWidth = 3 * btnSize + 2 * padding;
  let totalHeight = 4 * btnSize + 3 * padding;
  let startX = (width - totalWidth) / 2;
  let startY = (height - totalHeight) / 2 ;

  for (let i = 1; i <= 9; i++) {
    let x = startX + ((i - 1) % 3) * (btnSize + padding);
    let y = startY + floor((i - 1) / 3) * (btnSize + padding);
    buttons.push(new KeyButton(x, y, btnSize, str(i)));
  }

  buttons.push(new KeyButton(startX + (btnSize + padding), startY + 3 * (btnSize + padding), btnSize, "0"));
  buttons.push(new KeyButton(startX, startY + 3 * (btnSize + padding), btnSize, "↵", true));
}

function draw() {
  background(0);

  if (unlocked) {
    // Show the success image fullscreen (cover the canvas)
    image(successImg, 0, 0, width, height);
    return; // skip drawing keypad and text
  }

  // Draw sprite at bottom-left corner preserving 4:1 aspect ratio
  let spriteWidth = 600;
  let spriteHeight = spriteWidth / 4;
  image(spriteImg, 10, height - spriteHeight - 10, spriteWidth, spriteHeight);

  // Fade entered code text over time
  if (enteredCode.length > 0) {
    let elapsed = millis() - fadeStartTime;
    fadeAlpha = map(elapsed, 0, fadeDuration, 255, 0);
    fadeAlpha = constrain(fadeAlpha, 0, 255);
  } else {
    fadeAlpha = 255;
  }

  fill(255, fadeAlpha);
  textSize(32);
  textAlign(CENTER, CENTER);
  text(enteredCode, width / 2, 80);

  // Message text (always fully visible)
  fill(255);
  textSize(20);
  text(message, width / 2, 120);

  // Draw buttons
  for (let btn of buttons) {
    btn.display();
  }
}

function mousePressed() {
  if (unlocked) return; // no more input after success

  for (let btn of buttons) {
    if (btn.isMouseOver()) {
      if (btn.isEnter) {
        if (enteredCode === correctCode) {
          message = "Correct!";
          unlocked = true;  // show success image
        } else {
          message = "Wrong Code";
          enteredCode = "";
        }
      } else {
        if (enteredCode.length < 10) {
          enteredCode += btn.label;
        }
        message = "";
        fadeStartTime = millis(); // reset fade timer whenever code changes
        fadeAlpha = 255;
      }
    }
  }
}

class KeyButton {
  constructor(x, y, size, label, isEnter = false) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.label = label;
    this.isEnter = isEnter;
  }

  display() {
    fill(0); // black button
    stroke(255); // white outline
    strokeWeight(2);
    rect(this.x, this.y, this.size, this.size, 10);

    fill(255); // white text
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(24);
    text(this.label, this.x + this.size / 2, this.y + this.size / 2);
  }

  isMouseOver() {
    return (
      mouseX > this.x &&
      mouseX < this.x + this.size &&
      mouseY > this.y &&
      mouseY < this.y + this.size
    );
  }
}
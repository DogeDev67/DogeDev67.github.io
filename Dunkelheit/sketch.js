let timer = 0;
let monsters = [];
let monsterImg;
let flashAlpha = 0;
let flashFadeSpeed = 10;

let gameState = 'intro'; // intro, playing, ended
let survivalTime = 0;

class Monster {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.alpha = 0;
    this.fadeSpeed = 5;
    this.hoverTime = 0;
    this.hoverThreshold = 60; // frames to hold before disappear (1 second)
    this.isHovered = false;
  }

  update() {
    if (this.alpha < 255) {
      this.alpha += this.fadeSpeed;
      if (this.alpha > 255) this.alpha = 255;
    }
  }

  display() {
    push();
    imageMode(CENTER);

    let shakeX = 0;
    let shakeY = 0;

    if (this.isHovered) {
      let shakeAmount = 3;
      shakeX = random(-shakeAmount, shakeAmount);
      shakeY = random(-shakeAmount, shakeAmount);
    }

    tint(255, this.alpha);
    image(monsterImg, this.x + shakeX, this.y + shakeY, this.r * 12, this.r * 12);
    noTint();
    pop();
  }

  isMouseOver(mx, my) {
    let d = dist(mx, my, this.x, this.y);
    return d < this.r;
  }
}

function preload() {
  monsterImg = loadImage('monster.png');
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  noCursor();
  noSmooth();
  textAlign(CENTER, CENTER);
}

function draw() {
  background(10);

  if (gameState === 'intro') {
    fill(255);
    textSize(28);
    text("Du fühlst dich beobachtet.\nNutz deine Taschenlampe um dich zu beschützen...\n\nKlicke um zu starten", width / 2, height / 2);
    return;
  }

  if (gameState === 'playing') {
    timer++;
    survivalTime = timer / 60; // convert frames to seconds assuming 60 fps

    if (timer % 300 === 299 && monsters.length === 0) { // every 5 seconds spawn a monster if none
      monsters.push(new Monster(random(width), random(height), 20));
    }

    // Find max hoverTime for brightness boost
    let maxHover = 0;
    for (let m of monsters) {
      if (m.hoverTime > maxHover) maxHover = m.hoverTime;
    }
    maxHover = constrain(maxHover, 0, monsters[0]?.hoverThreshold || 60);
    let brightnessBoost = map(maxHover, 0, monsters[0]?.hoverThreshold || 60, 0, 30);

    // Draw flashing white overlay if flashAlpha > 0
    if (flashAlpha > 0) {
      fill(255, flashAlpha);
      noStroke();
      rect(0, 0, width, height);
      flashAlpha -= flashFadeSpeed;
      flashAlpha = max(flashAlpha, 0);
    }

    // Draw static background with brightness boost
    let blockSize = 16;
    for (let x = 0; x < width; x += blockSize) {
      for (let y = 0; y < height; y += blockSize) {
        let baseGray = random(10, 11);
        let gray = baseGray + brightnessBoost;
        fill(gray);
        noStroke();
        rect(x, y, blockSize, blockSize);
      }
    }

    fill(255, 255, 255, 20);
    noStroke();
    circle(mouseX, mouseY, 200);

    for (let i = monsters.length - 1; i >= 0; i--) {
      let m = monsters[i];

      m.update();

      if (m.isMouseOver(mouseX, mouseY)) {
        m.isHovered = true;
        m.hoverTime++;
        if (m.hoverTime >= m.hoverThreshold) {
          monsters.splice(i, 1);
          continue;
        }
      } else {
        if (m.hoverTime > 0) {
          flashAlpha = 255;
        }
        m.hoverTime = 0;
        m.isHovered = false;
      }

      m.display();
    }

    textSize(16);
    fill(255);

    if (survivalTime >= 35) {
      gameState = 'ended';
      monsters = [];
    }
  } else if (gameState === 'ended') {
    background(10);
    fill(255);
    textSize(28);
    text("Karte: Links, Rechts, Rechts, Links, Rechts, Links", width / 2, height / 2);
  }
}

function mousePressed() {
  if (gameState === 'intro') {
    gameState = 'playing';
    timer = 0;
    survivalTime = 0;
    monsters = [];
    flashAlpha = 0;
  }
}

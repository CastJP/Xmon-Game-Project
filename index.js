const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
  // 70 stands for width of the map (squares no)
  collisionsMap.push(collisions.slice(i, 70 + i));
}

class Boundary {
  static width = 48;
  static height = 48;
  constructor({ position }) {
    this.position = position;
    this.width = 48; // 12px per tile but we use 400% map
    this.height = 48;
  }

  draw() {
    ctx.fillStyle = 'red';
    canvas.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

const boundaries = [];

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width,
            y: i * Boundary.height,
          },
        })
      );
  });
});

console.log(boundaries);

const mapImage = new Image();
mapImage.src = './images/XmonMap-Area1.png';

const playerImage = new Image();
playerImage.src = './images/playerDown.png';

class Sprite {
  constructor({ position, velocity, mapImage }) {
    this.position = position;
    this.mapImage = mapImage;
  }

  draw() {
    ctx.drawImage(this.mapImage, this.position.x, this.position.y);
  }
}

const background = new Sprite({
  position: {
    x: -64,
    y: -410,
  },
  mapImage: mapImage,
});

const keys = {
  w: {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  s: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
};

function animate() {
  window.requestAnimationFrame(animate);
  background.draw();
  ctx.drawImage(
    playerImage,
    0, // Cropping starting point on X axis
    0, // Cropping starting point on Y axis
    playerImage.width / 4, // Crop width
    playerImage.height, // Crop height
    canvas.width / 2 - playerImage.width / 4 / 2, // 4 below - actual position of render on the screen
    canvas.height / 2 - playerImage.height / 2,
    playerImage.width / 4,
    playerImage.height
  );

  if (keys.w.pressed && lastKey === 'w') background.position.y += 2;
  else if (keys.a.pressed && lastKey === 'a') background.position.x += 2;
  else if (keys.s.pressed && lastKey === 's') background.position.y -= 2;
  else if (keys.d.pressed && lastKey === 'd') background.position.x -= 2;
}
animate();

let lastKey = '';
window.addEventListener('keydown', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = true;
      lastKey = 'w';
      break;
    case 'a':
      keys.a.pressed = true;
      lastKey = 'a';
      break;
    case 's':
      keys.s.pressed = true;
      lastKey = 's';
      break;
    case 'd':
      keys.d.pressed = true;
      lastKey = 'd';
      break;
  }
});

window.addEventListener('keyup', (e) => {
  switch (e.key) {
    case 'w':
      keys.w.pressed = false;
      break;
    case 'a':
      keys.a.pressed = false;
      break;
    case 's':
      keys.s.pressed = false;
      break;
    case 'd':
      keys.d.pressed = false;
      break;
  }
});

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
    this.width = 36; // 12px per tile but we use 400% map
    this.height = 36;
  }

  draw() {
    ctx.fillStyle = 'rgba(255, 0, 0, 0.0)';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

const boundaries = [];
const offset = {
  x: -64,
  y: -430,
};

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x + 6,
            y: i * Boundary.height + offset.y,
          },
        })
      );
  });
});

const mapImage = new Image();
mapImage.src = './images/XmonMap-Area1.png';

const playerImage = new Image();
playerImage.src = './images/playerDown.png';

class Sprite {
  constructor({ position, velocity, image, frames = { max: 1 } }) {
    this.position = position;
    this.image = image;
    this.frames = frames;
    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
    };
  }

  draw() {
    ctx.drawImage(
      this.image,
      0, // Cropping starting point on X axis
      0, // Cropping starting point on Y axis
      this.image.width / this.frames.max, // Crop width
      this.image.height, // Crop height
      this.position.x,
      this.position.y,
      this.image.width / this.frames.max,
      this.image.height
    );
  }
}

//
//       ,

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2, // actual position of render on the screen,
    y: canvas.height / 2 - 68 / 2,
  },
  image: playerImage,
  frames: {
    max: 4,
  },
});

const background = new Sprite({
  position: {
    x: offset.x,
    y: offset.y,
  },
  image: mapImage,
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

// All objects that will be moved on the map
const movables = [background, ...boundaries];

function rectangularCollision({ rect1, rect2 }) {
  return (
    rect1.position.x + rect1.width >= rect2.position.x &&
    rect1.position.x <= rect2.position.x + rect2.width &&
    rect1.position.y + 24 <= rect2.position.y + rect2.height &&
    rect1.position.y + rect1.height >= rect2.position.y
    // + 24 = player's head can now be a bit 'above' certain objects - matter of more immersive perspective
  );
}

function animate() {
  window.requestAnimationFrame(animate);
  background.draw();
  boundaries.forEach((boundary) => {
    boundary.draw();
  });
  player.draw();

  let moving = true;
  if (keys.w.pressed && lastKey === 'w') {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rect1: player,
          rect2: {
            ...boundary,
            position: { x: boundary.position.x, y: boundary.position.y + 2 },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.y += 2;
      });
  } else if (keys.a.pressed && lastKey === 'a') {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rect1: player,
          rect2: {
            ...boundary,
            position: { x: boundary.position.x + 2, y: boundary.position.y },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.x += 2;
      });
  } else if (keys.s.pressed && lastKey === 's') {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rect1: player,
          rect2: {
            ...boundary,
            position: { x: boundary.position.x, y: boundary.position.y - 2 },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.y -= 2;
      });
  } else if (keys.d.pressed && lastKey === 'd') {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rect1: player,
          rect2: {
            ...boundary,
            position: { x: boundary.position.x - 2, y: boundary.position.y },
          },
        })
      ) {
        moving = false;
        break;
      }
    }
    if (moving)
      movables.forEach((movable) => {
        movable.position.x -= 2;
      });
  }
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

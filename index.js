const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);

const mapImage = new Image();
mapImage.src = './images/XmonMap-Area1.png';

const playerImage = new Image();
playerImage.src = './images/playerDown.png';

mapImage.onload = () => {
  ctx.drawImage(mapImage, -64, -410);
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
};

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;
console.log(ctx);

ctx.fillStyle = 'white';
ctx.fillRect(0, 0, canvas.width, canvas.height);

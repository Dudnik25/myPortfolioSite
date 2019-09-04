'use strict';

window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame   ||
        window.mozRequestAnimationFrame      ||
        window.oRequestAnimationFrame        ||
        window.msRequestAnimationFrame       ||
        function(callback, element){
            window.setTimeout(function(){
                callback(+new Date);
            }, 1000 / 60);
        };
})();

const content = document.querySelector('.content');

const canvas = document.getElementById('canvasB');
const ctx = canvas.getContext('2d');

let width = window.innerWidth;
let height = window.innerHeight;
ctx.canvas.width = width;
ctx.canvas.height = height;

let center = {x: width / 2, y: height / 2};
const stars = [];
let starsCount = 0;
if (width < 1000) {
    starsCount = 200;
} else {
    starsCount = 600;
}

let Z = 0.1;
let WarpZ = 12;
let alpha = 0.25;
let lineW = 5;
let WarpDrive = false;

let cx = (center.x - width / 2) + (width / 2);
let cy = (center.y - height / 2) + (height / 2);

let cycle = 0;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

let speed = 0;

window.addEventListener('keypress', warp);
canvas.addEventListener('touchstart', warp);
canvas.addEventListener('touchend', warp);
window.addEventListener('resize', resize);
canvas.addEventListener('animationend', function (e) {
    if (e.animationName === 'scale') {
        content.classList.remove('animscale');
        content.classList.add('hidden');
    }
    if (e.animationName === 'scale2') {
        content.style.opacity = 1;
        content.classList.remove('animscale2');
    }

});

function warp(e) {
    if (e.code === 'KeyW' || e.keyCode === 119 || e.type === 'touchstart') {
        console.log('KeyW' + WarpDrive);
        if (WarpDrive === false && speed === 0) {
            WarpDrive = true;
            console.log('Warp Drive On!');
            let speedup = setInterval(function () {
                speed += 1;
                console.log('Warp Drive Speed: ' + speed);
                Z += 0.08;
                alpha -= 0.015;
                starsCount += 50;
                lineW += 0.25;
                if (speed >= 10) clearInterval(speedup);
            }, 200);
        }
    }

    if (e.code === 'KeyS' || e.keyCode === 115 || e.type === 'touchend') {
        console.log('KeyS' + WarpDrive);
        if (WarpDrive === true && speed === 10) {
            WarpDrive = false;
            console.log('Warp Drive Off!');
            let speeddown = setInterval(function () {
                speed -= 1;
                console.log('Warp Drive Speed: ' + speed);
                Z -= 0.08;
                alpha += 0.015;
                starsCount -= 50;
                lineW -= 0.25;
                if (speed <= 0) clearInterval(speeddown);
            }, 100);
        }
    }

}

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    ctx.canvas.width = width;
    ctx.canvas.height = height;

    center = {x: width / 2, y: height / 2};
    cx = (center.x - width / 2) + (width / 2);
    cy = (center.y - height / 2) + (height / 2);
}

function starMove() {
    for (let i=0; i< stars.length; i++) {
        if ((stars[i].px <= width && stars[i].px + cx >= 0) && (stars[i].py <= height && stars[i].py + cy >= 0) && stars[i].z > Z) {
            // console.log(stars[i].px + " : " + stars[i].py);
            stars[i].px = stars[i].x / stars[i].z;
            stars[i].py = stars[i].y/ stars[i].z;
            stars[i].o += Z;
            stars[i].z -= Z;

        } else {
            stars.splice(i, 1);
            //console.log(stars.length);
        }
    }
}

function StarCreate() {
    if (stars.length < starsCount) {
        for (let i = stars.length; i < starsCount; i++) {
            let star = {};
            star.x = (Math.random() * width - (width * 0.5)) * WarpZ;
            star.y = (Math.random() * height - (height * 0.5)) * WarpZ;
            star.z = WarpZ;
            star.c = 'rgba(' + 140 +  ',' + getRandomInt(220, 255)+ ',' + 255 + ', 1)';
            star.px = 0;
            star.py = 0;
            stars.push(star);

        }
    }
}

function drawStars() {
    for (let i=0; i < stars.length; i++) {
        let star = stars[i];

        let color = 'rgba(' + (Math.random() * 255) +  ',' + 255 + ',' + 255 + ',' + 1 +')';
        if (star.px !== 0) {
            let xx = star.x / star.z;
            let xy = star.y / star.z;
            ctx.strokeStyle = star.c;
            ctx.lineWidth = getRandomInt(1, 5);
            ctx.beginPath();
            ctx.moveTo(star.px + cx, star.py + cy);
            ctx.lineTo(xx + cx, xy + cy);
            ctx.stroke();
        }
    }
}

function drawBackground() {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fillRect(0, 0, width, height);
}

function timer() {
    ctx.font = "48px serif";
    ctx.fillStyle = 'white';
    ctx.fillText(cycle, 50, 50);

    cycle = (cycle >= 60) ? 1 : ++cycle;
}

function drawHUD() {
    // ctx.globalAlpha = 1;
    // ctx.beginPath();
    // ctx.lineWidth = 10;
    // ctx.strokeStyle = '#05e6ff';
    // ctx.arc(300, 300, 200, 0, 2 * Math.PI);
    // ctx.stroke();

    drawSpeed();
}
let step = 10;
function drawSpeed() {
    let speedometerWidth = (width / 3 < 300) ? 300 : width / 3;
    let speedometerHeight = height / 20;
    let startWidth = center.x - (speedometerWidth / 2);
    let startHeight = height - (speedometerHeight + 50);
    let stepHeight = speedometerHeight - 10;
    let stepMargin = (speedometerWidth - 5) / step;
    let stepWidth = ((speedometerWidth - 5) / step) - 5;
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#05e6ff';
    ctx.rect(startWidth, startHeight, speedometerWidth, speedometerHeight);
    ctx.stroke();


    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    ctx.fillStyle = '#05e6ff';
    ctx.rect(startWidth + 5, startHeight + 5, stepWidth, stepHeight);
    ctx.fill();
    if (speed !== 0) {
        let stepC = step / 10 * speed;
        for (let i = 1; i < stepC; i++) {
            ctx.beginPath();
            ctx.fillStyle = '#05e6ff';
            ctx.rect(startWidth + (stepMargin * i) + 5, startHeight + 5, stepWidth, stepHeight);
            ctx.fill();
        }
    }
}

function render() {

    drawBackground();
    StarCreate();
    starMove();
    drawStars();
    drawHUD();

    timer();
    requestAnimationFrame(render);
}

let input = document.getElementById('speed');
input.addEventListener('input', function (e) {
    step = e.target.value;
});

render();



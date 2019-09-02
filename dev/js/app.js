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

// let Z = 0.105;
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
window.addEventListener('touchstart', warp);
window.addEventListener('touchend', warp);
window.addEventListener('resize', resize);
content.addEventListener('animationend', function (e) {
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
            //content.classList.add('animscale');
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
            //content.style.opacity = 0;
            //content.classList.add('animscale2');
            //  content.classList.remove('hidden');
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
            star.w =  getRandomInt(1, 5);
            star.px = 0;//getRandomInt(0, width);
            star.py = 0;//getRandomInt(0, height);
            stars.push(star);
            //console.log(stars);

        }
    }
}

function render() {
    ctx.globalAlpha = alpha;
    ctx.fillStyle = "rgba(0, 0, 0, 1)";
    ctx.fillRect(0, 0, width, height);

    StarCreate();
    starMove();

    for (let i=0; i < stars.length; i++) {
        let star = stars[i];

        let color = 'rgba(' + (Math.random() * 255) +  ',' + 255 + ',' + 255 + ',' + star.o +')';
        //console.log(color);
        //ctx.globalAlpha = 0.25;
        //ctx.globalAlpha = alpha;
        if (star.px !== 0) {
            let xx = star.x / star.z;
            let xy = star.y / star.z;
            //ctx.strokeStyle = '#8eaaff';
            ctx.strokeStyle = star.c;
            ctx.lineWidth = getRandomInt(1, 5);
            //ctx.lineWidth = star.w;
            ctx.beginPath();
            ctx.moveTo(xx + cx, xy + cy);
            ctx.lineTo(star.px + cx, star.py + cy);
            ctx.stroke();
        }
    }

    // ctx.globalAlpha = 1;
    // ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    // ctx.beginPath();
    // ctx.arc(center.x, center.y, 30, 0, Math.PI*2);
    // ctx.fill();
    // ctx.closePath();

    //ctx.font = "48px serif";
    //ctx.fillText("Cycle: " + cycle, 10, 50);



    cycle += 0.01;
    requestAnimationFrame(render);
}

render();




console.log(stars);
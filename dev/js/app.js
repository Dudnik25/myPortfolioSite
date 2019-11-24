'use strict';

let canvas2DSupported = !!window.CanvasRenderingContext2D;
if (canvas2DSupported) init();

function init() {

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

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }

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
        starsCount = 100;
    } else {
        starsCount = 500;
    }

    let Z = 0.125;
    let WarpZ = 50;
    let alpha = 0.25;
    let lineW = 3;
    let WarpDrive = false;

    let cx = (center.x - width / 2) + (width / 2);
    let cy = (center.y - height / 2) + (height / 2);

    let cycle = 0;

    let speed = 0;
    let maxSpeed = 20;
    let step = 30;

    //window.addEventListener('keypress', warp);
    window.addEventListener('resize', resize);
    //window.addEventListener('mousemove', mousemove);
    //window.addEventListener('touchstart', warp);
    //window.addEventListener('touchend', warp);


    function mousemove(e) {
        let cir = document.getElementById('cursor');

        cir.style.top = e.clientY + 'px';
        cir.style.left = e.clientX + 'px';
        }

    function warp(e) {
        //if (e.code === 'KeyA') render();

        if (e.code === 'KeyW' || e.keyCode === 119 || e.type === 'touchstart') {
            if (WarpDrive === false && speed === 0) {
                WarpDrive = true;
                console.log('Warp Drive On!');

                let speedup = setInterval(function () {
                    speed += 1;
                    console.log('Warp Drive Speed: ' + speed);
                    Z += 0.3;
                    alpha -= 0.01;
                    starsCount += 50;

                    if (speed >= maxSpeed) clearInterval(speedup);
                }, 80);
            }
        }

        if (e.code === 'KeyS' || e.keyCode === 115 || e.type === 'touchend') {
            if (WarpDrive === true && speed === maxSpeed) {
                WarpDrive = false;
                console.log('Warp Drive Off!');

                let speeddown = setInterval(function () {
                    speed -= 1;
                    console.log('Warp Drive Speed: ' + speed);
                    Z -= 0.3;
                    alpha += 0.01;
                    starsCount -= 50;
                    if (speed <= 0) clearInterval(speeddown);
                }, 50);
            }
        }
    }

    function warpOn(callback) {
        if (WarpDrive === false && speed === 0) {
            WarpDrive = true;
            console.log('Warp Drive On!');

            let speedup = setInterval(function () {
                speed += 1;
                console.log('Warp Drive Speed: ' + speed);
                Z += 0.3;
                alpha -= 0.01;
                starsCount += 50;

                if (speed >= maxSpeed) {
                    clearInterval(speedup);
                    setTimeout(function () {
                        warpOff(callback);
                    }, 1000);
                }
            }, 80);
        }
    }

    function warpOff(callback) {
        if (WarpDrive === true && speed === maxSpeed) {
            WarpDrive = false;
            console.log('Warp Drive Off!');

            let speeddown = setInterval(function () {
                speed -= 1;
                console.log('Warp Drive Speed: ' + speed);
                Z -= 0.3;
                alpha += 0.01;
                starsCount -= 50;

                if (speed <= 0) {
                    clearInterval(speeddown);
                    if (typeof callback === 'function') callback();
                }
            }, 50);
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
        for (let i = 0; i < stars.length; i++) {
            let star = stars[i];
            let realpx = star.px + cx;
            let realpy = star.py + cy;

            if (realpx <= width && realpx >= 0 && realpy <= height && realpy >= 0 && star.z > Z) {
                star.px = star.x / star.z;
                star.py = star.y / star.z;
                star.z -= Z;
            } else {
                starCreate(i);
            }
        }
    }

    function starCreate(id = null) {
        let star = {};

        star.x = (Math.random() * width - (width * 0.5)) * WarpZ;
        star.y = (Math.random() * height - (height * 0.5)) * WarpZ;
        star.z = WarpZ;
        star.c = `hsl(203, 100%, ${getRandomInt(75, 95)}%)`;
        star.px = 0;
        star.py = 0;

        if (id !== null) {
            stars[id] = star;
        }

        if (stars.length < starsCount) {
            stars.push(star);
            starCreate();
        } else if(stars.length > starsCount) {
            stars.splice(starsCount, stars.length - starsCount);
        }
    }

    function drawStars() {
        for (let i = 0; i < stars.length; i++) {
            let star = stars[i];

            ctx.globalAlpha = 0.6;

            if (star.px !== 0) {
                let xx = star.x / star.z;
                let xy = star.y / star.z;

                ctx.strokeStyle = star.c;
                ctx.lineWidth = getRandomInt(1, lineW);
                ctx.beginPath();
                ctx.moveTo(star.px + cx, star.py + cy);
                ctx.lineTo(xx + cx, xy + cy);
                ctx.stroke();
            }
        }
    }

    function drawBackground() {
        ctx.globalAlpha = alpha;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, width, height);
    }

    function timer() {
        ctx.font = "48px serif";
        ctx.fillStyle = 'white';
        ctx.fillText(cycle, 50, 150);
        ctx.fillText(width, 50, 200);
        ctx.fillText(height, 50, 250);

        cycle = (cycle >= 60) ? 0 : ++cycle;
    }

    function drawHUD() {
        let hudMarginTop = (height / 20) + 20;
        let hudMarginBottom = height - hudMarginTop;
        let speedometerWidth = (width / 3 < 240) ? 240 : width / 3;
        let speedometerHeight = height / 20;

        ctx.globalAlpha = 1;
        ctx.fillStyle = '#02B7CC';
        ctx.strokeStyle = '#05e6ff';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.moveTo(0, height + 2);
        ctx.lineTo(0, height - 320);
        ctx.lineTo(100, height - 320);
        ctx.lineTo(center.x - (speedometerWidth / 2) + 30, hudMarginBottom - 10);
        ctx.lineTo(center.x + (speedometerWidth / 2) - 30, hudMarginBottom - 10);
        ctx.lineTo(width - 100, height - 320);
        ctx.lineTo(width + 2, height - 320);
        ctx.lineTo(width + 2, height + 2);
        ctx.lineTo(0, height + 2);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(0, -2);
        ctx.lineTo(0, 100);
        ctx.lineTo(center.x - (width / 4), 100);
        ctx.lineTo(center.x - (width / 8), 50);
        ctx.lineTo(center.x + (width / 8), 50);
        ctx.lineTo(center.x + (width / 4), 100);
        ctx.lineTo(width + 2, 100);
        ctx.lineTo(width + 2, -2);
        ctx.lineTo(0, -2);
        ctx.fill();

        drawSpeed(hudMarginBottom);
        drawSkills("HTML", 100, height - 200, 40, 90);
        drawSkills("CSS", 260, height - 100, 40, 80);
        drawSkills("JS", width - 100, height - 200, 40, 65, true, 'right');
        drawSkills("PHP", width - 260, height - 100, 40, 45, true, 'right');
    }

    function drawSpeed(hudMarginBottom) {
        let speedometerWidth = (width / 3 < 240) ? 240 : width / 3;
        let speedometerHeight = height / 20;
        let startWidth = center.x - (speedometerWidth / 2);
        let startHeight = height - (speedometerHeight + 10);
        let stepHeight = speedometerHeight - 10;
        let stepMargin = (speedometerWidth - 5) / step;
        let stepWidth = ((speedometerWidth - 5) / step) - 5;
        let fillpatch = {
            x1: center.x - (speedometerWidth / 2) - 50,
            y1: height,
            x2: center.x - (speedometerWidth / 2) - 10,
            y2: hudMarginBottom,
            x3: center.x + (speedometerWidth / 2) + 10,
            y3: hudMarginBottom,
            x4: center.x + (speedometerWidth / 2) + 50,
            y4: height
        };

        ctx.globalAlpha = 1;
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#05e6ff';
        ctx.rect(startWidth, startHeight, speedometerWidth, speedometerHeight);
        ctx.stroke();

        ctx.beginPath();
        ctx.fillStyle = '#05e6ff';
        ctx.strokeStyle = 'black';
        ctx.moveTo(fillpatch.x1, fillpatch.y1);
        ctx.lineTo(fillpatch.x2, fillpatch.y2);
        ctx.lineTo(fillpatch.x3, fillpatch.y3);
        ctx.lineTo(fillpatch.x4, fillpatch.y4);
        ctx.fill();
        ctx.stroke();

        ctx.globalAlpha = 1;
        ctx.fillStyle = "black";
        ctx.fillRect(startWidth, startHeight, speedometerWidth, speedometerHeight);

        ctx.beginPath();
        ctx.fillStyle = '#05e6ff';
        ctx.rect(startWidth + 5, startHeight + 5, stepWidth, stepHeight);
        ctx.fill();

        if (speed !== 0) {
            let stepC = step / maxSpeed * speed;

            for (let i = 1; i < stepC; i++) {
                ctx.beginPath();
                ctx.fillStyle = '#05e6ff';
                ctx.rect(startWidth + (stepMargin * i) + 5, startHeight + 5, stepWidth, stepHeight);
                ctx.fill();
            }
        }
    }
    
    function drawSkills(text, startX, startY, radius, percentage, fill = true, outline = 'left') {
        let startPosX = startX;
        let startPosY = startY;
        let fontSize = 20;
        let startOutline = (outline === 'right') ? 330 : 280;

        if (fill === true) {
            ctx.globalAlpha = 1;
            ctx.fillStyle = "black";
            ctx.beginPath();
            ctx.arc(startX, startY,radius + 50, 0, Math.PI * 2);
            ctx.fill();
        }

        ctx.beginPath();
        ctx.strokeStyle = '#05e6ff';
        ctx.lineWidth = 3;
        ctx.arc(startPosX, startPosY, radius, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(startPosX, startPosY, radius + 30, 0, 2 * Math.PI);
        ctx.stroke();

        ctx.lineWidth = 20;

        for(let i = 0, step = 9, startPos = 270; i < percentage / 3; i++, startPos += (step + 1.8)) {
            ctx.beginPath();
            ctx.arc(startPosX, startPosY, radius + 15, (Math.PI * startPos) / 180, (Math.PI * (startPos + step)) / 180);
            ctx.stroke();
        }

        ctx.lineWidth = 5;

        for(let i = 0, step = 9, startPos = startOutline; i < 10; i++, startPos += (step + 1.8)) {
            ctx.beginPath();
            ctx.arc(startPosX, startPosY, radius + 40, (Math.PI * startPos) / 180, (Math.PI * (startPos + step)) / 180);
            ctx.stroke();
        }

        for(let i = 0, step = 9, startPos = startOutline + 180; i < 10; i++, startPos += (step + 1.8)) {
            ctx.beginPath();
            ctx.arc(startPosX, startPosY, radius + 40, (Math.PI * startPos) / 180, (Math.PI * (startPos + step)) / 180);
            ctx.stroke();
        }

        ctx.font = `${fontSize}px serif`;
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(text, startPosX, startPosY + (fontSize / 3), radius * 2);

    }

    function render() {
        let cir = document.getElementById('cursor');

        cx = cir.offsetLeft;
        cy = cir.offsetTop;
        timer();

        drawBackground();
        starMove();
        drawStars();
        drawHUD();


        requestAnimationFrame(render);
    }

    starCreate();
    render();


    //Страницы
    let sections = document.querySelectorAll('.internalLinks');
    let currentPage = window.location.hash.replace('#', '');

    try {
        showPage(null, currentPage);
    } catch (Error) {
        showPage(null, 'menu');
    }

    function showPage(prevSection, nextSectionName) {
        let nextSection = document.getElementById(nextSectionName);
        let items = nextSection.querySelectorAll('ul > li');

        if (prevSection !== null) prevSection.classList.add('hidden');
        nextSection.classList.remove('hidden');

        for (let i = 0; i < items.length; i++) {
            setTimeout(function () {
                items[i].classList.add('visible');
            }, i * 100);
        }
    }

    function hidePage(section, callback) {
        let items = section.querySelectorAll('ul > li');

        for (let i = 0; i < items.length; i++) {
            setTimeout(function () {
                items[i].classList.remove('visible');

                if (i >= items.length - 1) warpOn(callback);
            }, i * 100);
        }

    }

    //Вешаем обработчики на кнопки
    for (let section of sections) {
        let items = section.querySelectorAll('ul > li');
        for(let item of items) {
            let link = item.querySelector('a').getAttribute('href').replace('#', '');

            if (link === '') link = 'menu';

            item.addEventListener('click', function () {
                hidePage(section, function () {
                    return showPage(section, link);
                });
            });
        }
    }

}




(function () {
    var then;
    var w = window;
    var requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

    // Create the canvas
    var gameCanvas = document.createElement('canvas');
    var ctx = gameCanvas.getContext('2d');

    gameCanvas.width = 512;
    gameCanvas.height = 480;

    document.body.appendChild(gameCanvas);

    // Background Image
    var bgReady = false;
    var bgImage = new Image();
    bgImage.onload = function () {
      bgReady = true;
    };
    bgImage.src = 'background.png';

    var heroReady = false;
    var heroImage = new Image();
    heroImage.onload = function () {
        heroReady = true;
    };
    heroImage.src = 'hero.png';

    var monsterReady = false;
    var monsterImage = new Image();
    monsterImage.onload = function () {
        monsterReady = true;
    };
    monsterImage.src = 'monster.png';

    // Player
    var hero = {
        speed: 256,
        x: 0,
        y: 0
    };

    // Monster
    var monster = {
        x: 0,
        y: 0
    };

    var monstersCaught = 0;

    // Keyboard controls
    var keysDown = {};

    addEventListener('keydown', function (e) {
       keysDown[e.keyCode] = true;
    });

    addEventListener('keyup', function (e) {
       delete keysDown[e.keyCode];
    });

    var reset = function () {
        hero.x =  gameCanvas.width / 2;
        hero.y =  gameCanvas.height / 2;

        monster.x = 32 + (Math.random() * (gameCanvas.width - 64));
        monster.y = 32 + (Math.random() * (gameCanvas.height - 64));
    };

    var update = function (modifier) {
        if (38 in keysDown) { // Up
            if (hero.y - hero.speed * modifier > 32) {
                hero.y -= hero.speed * modifier;
            } else {
                hero.y = 32;
            }
        }
        if (40 in keysDown) { // Down
            if (hero.y + hero.speed * modifier > gameCanvas.height - heroImage.height - 32) {
                hero.y = gameCanvas.height - heroImage.height - 32;
            } else {
                hero.y += hero.speed * modifier;
            }
        }
        if (37 in keysDown) { // Left
            if (hero.x - hero.speed * modifier < 32) {
                hero.x = 32;
            } else {
                hero.x -= hero.speed * modifier;
            }
        }
        if (39 in keysDown) { // Right
            if (hero.x + hero.speed * modifier > gameCanvas.width - heroImage.width - 32) {
                hero.x = gameCanvas.width - heroImage.width - 32;
            } else {
                hero.x += hero.speed * modifier;
            }
        }

        if (hero.x <= monster.x + 32
            && monster.x <= (hero.x + 32)
            && hero.y <= (monster.y + 32)
            && monster.y <= (hero.y + 32)) {
            ++monstersCaught;
            reset();
        }
    };

    var render = function () {
        if (bgReady) {
            ctx.drawImage(bgImage, 0, 0);
        }
        if (heroReady) {
            ctx.drawImage(heroImage, hero.x, hero.y);
        }
        if (monsterReady) {
            ctx.drawImage(monsterImage, monster.x, monster.y);
        }
        ctx.fillStyle = 'rgb(250, 250, 250)';
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText('Monster Caught: ' + monstersCaught, 32, 32);
    };

    var main = function () {
        var now = Date.now();
        var delta = now - then;

        update(delta / 1000);
        render();

        then = now;

        requestAnimationFrame(main);
    };

    then = Date.now();
    reset();
    main();
})();
//var width = 1000, height = 800;
var width = screen.width / 2, height = 720;
var pi = Math.PI;
var UpArrow = 38, DownArrow = 40;
var WKey = 87, SKey = 83;
var canvas, ctx, keystate;
var player, ai, ball;
var pscore = 0, ascore = 0;
var modeN;

function mode(n) { modeN = n; main(); }

player = {
    x: null,
    y: null,
    width: 20,
    height: 100,

    update: function() {
        if(modeN == 1 || modeN == 2) {
            if(keystate[WKey]) this.y -= 7;
            if(keystate[SKey]) this.y += 7;
            this.y = Math.max(Math.min(this.y, height - this.height), 0);
        } else if(modeN == 3) {
            var desty = ball.y - (this.height - ball.side) * 0.5;
            this.y += (desty - this.y) * 0.1;
            this.y = Math.max(Math.min(this.y, height - this.height), 0);
        }
    },
    draw: function() {
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}


ai = {
    x: null,
    y: null,
    width: 20,
    height: 100,

    update: function() {
        if(modeN == 1 || modeN == 3) {
            var desty = ball.y - (this.height - ball.side)*0.5;
            this.y += (desty - this.y) * 0.1;
            this.y = Math.max(Math.min(this.y, height - this.height), 0);
        } else if(modeN == 2) {
            if(keystate[UpArrow]) this.y -= 7;
            if(keystate[DownArrow]) this.y += 7;
            this.y = Math.max(Math.min(this.y, height - this.height), 0);
        }
    },
    draw: function() {
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

ball = {
    x: null,
    y: null,
    vel: null,
    side: 20,
    speed: 12,

    serve: function(side) {
        var r = Math.random();
        this.x = side === 1 ? player.x + player.width : ai.x - this.side;
        this.y = (height - this.side)*r;
        var phi = 0.1 * pi * (1 - 2 * r);
        this.vel = {
            x: side * this.speed * Math.cos(phi),
            y: this.speed * Math.sin(phi)
        }
    },

    update: function() {
        this.x += this.vel.x;
        this.y += this.vel.y;

        if(0 > this.y || this.y + this.side > height) {
            var offset = this.vel.y < 0 ? 0 - this.y : height - (this.y + this.side);
            this.y += 2 * offset;
            this.vel.y *= -1;
        }

        var AABBIntersect = function(ax, ay, aw, ah, bx, by, bw, bh) {
			return ax < bx + bw && ay < by + bh && bx < ax + aw && by < ay + ah;
		};

        var pdle = this.vel.x < 0 ? player : ai;
		if (AABBIntersect(pdle.x, pdle.y, pdle.width, pdle.height,
				this.x, this.y, this.side, this.side)
		) {	
			this.x = pdle === player ? player.x + player.width : ai.x - this.side;
			var n = (this.y + this.side - pdle.y) / (pdle.height + this.side);
			var phi = 0.25 * pi * (2 * n - 1);
			var smash = Math.abs(phi) > 0.2 * pi ? 1.5 : 1;
			this.vel.x = smash * (pdle === player ? 1 : -1) * this.speed * Math.cos(phi);
			this.vel.y = smash * this.speed * Math.sin(phi);
		}

		if (0 > this.x + this.side || this.x > width) {
            this.serve(pdle === player ? 1 : -1);
            if(pdle !== player) pscore++;
            else ascore++;    
        }
    },
    draw: function() {
        ctx.fillRect(this.x, this.y, this.side, this.side);
    }
}

function main() {
    canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);
    
    dugme = document.createElement("button");
    dugme.innerHTML = "Exit"
    dugme.classList.add("dugme");
    document.body.appendChild(dugme);

    dugme.onclick = function() { window.location = "../index.html" }

    keystate = {};

    document.addEventListener("keydown", function(evt) {
        keystate[evt.keyCode] = true;
    });

    document.addEventListener("keyup", function(evt) {
        delete keystate[evt.keyCode];
    });

    init();

    var loop = function() {
        update();
        draw();

        window.requestAnimationFrame(loop, canvas);
    };
    window.requestAnimationFrame(loop, canvas);
}

function init() {
    player.x = player.width;
    player.y = (height - player.height) / 2;

    ai.x = width - (player.width + ai.width);
    ai.y = (height - ai.height) / 2;

    ball.x = (width - ball.side) / 2;
    ball.y = (height - ball.side) / 2;

    ball.serve(1);
}

function update() {
    ball.update();
    player.update();
    ai.update();
}

function drawIcon(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "28px FontAwesome";
    ctx.globalAlpha = 0.2;
    ctx.fillText(text, x, y);
}

function drawTextIcon(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "28px Bit9";
    ctx.globalAlpha = 0.2;
    ctx.fillText(text, x, y);
}

function drawTextIconLogo(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "18px Roboto";
    ctx.globalAlpha = 0.2;
    ctx.fillText(text, x, y);
}

function drawText(text, x, y, color) {
    ctx.fillStyle = color;
    ctx.font = "60px Bit9";
    ctx.globalAlpha = 1;
    ctx.fillText(text, x, y);
}

function draw() {
    ctx.fillRect(0, 0, width, height);

    ctx.save();

    ctx.fillStyle = "#fff";

    ball.draw();
    player.draw();
    ai.draw();

    var w = 4;
    var x = (width - w) * 0.5;
    var y = 0;
    var step = height / 20;

    while(y < height) {
        ctx.fillRect(x, y + step * 0.25, w, step * 0.5);
        y += step;
    }

    if(modeN != 3) {
        drawIcon("\uF0c8", canvas.width / 5, 8 * canvas.height / 9, "GRAY");
        drawTextIconLogo("W", canvas.width / 5 + 4, 8 * canvas.height / 9 - 4, "GRAY");
        drawTextIcon("Up", canvas.width / 5 + 35, 8 * canvas.height / 9 - 3, "GRAY");
        drawIcon("\uF0c8", canvas.width / 5, 8 * canvas.height / 9 + 30, "GRAY");
        drawTextIconLogo("S", canvas.width / 5 + 7, 8 * canvas.height / 9 + 26, "GRAY");
        drawTextIcon("Down", canvas.width / 5 + 35, 8 * canvas.height / 9 + 27, "GRAY");
    
        if(modeN == 2) {
            drawIcon("\uF151", 4 * canvas.width / 6, 8 * canvas.height / 9, "GRAY");
            drawTextIcon("Up", 4 * canvas.width / 6 + 35, 8 * canvas.height / 9 - 3, "GRAY");
            drawIcon("\uF150", 4 * canvas.width / 6, 8 * canvas.height / 9 + 30, "GRAY");
            drawTextIcon("Down", 4 * canvas.width / 6 + 35, 8 * canvas.height / 9 + 27, "GRAY");
        }
    }
    

    drawText(pscore, canvas.width / 4, canvas.height / 5, "WHITE");
    drawText(ascore, 3 * canvas.width / 4, canvas.height / 5, "WHITE");

    ctx.restore();
}
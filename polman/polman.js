
$(document).ready(function(){

var debug = location.search.indexOf("?debug") > -1;

var brain = {};

var IMG_PATH = 'img/';
var UP = 'UP';
var DOWN = 'DOWN';
var LEFT = 'LEFT';
var RIGHT = 'RIGHT';

var GRID_BLOCK = 1;
var GRID_PELLET = 0;
var GRID_EMPTY = 2; //unused
var grid_blocks = [
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	[1,2,0,0,0,0,0,1,0,0,0,0,0,0,1],
	[1,0,1,1,0,1,0,1,0,1,0,1,1,0,1],
	[1,0,0,0,0,1,0,0,0,1,0,0,0,0,1],
	[1,0,1,1,0,1,0,1,0,1,0,1,1,0,1],
	[1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
	[1,1,0,1,1,0,1,1,1,0,1,1,0,1,1],
	[1,1,0,1,1,0,1,1,1,0,1,1,0,1,1],
	[1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
	[1,0,1,1,1,1,0,1,0,1,1,1,1,0,1],
	[1,0,1,2,2,1,0,0,0,0,0,0,0,0,1],
	[1,0,1,1,1,1,0,1,0,1,1,1,1,0,1],
	[1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
	[1,0,1,1,1,0,1,1,1,1,0,1,1,0,1],
	[1,0,1,2,1,0,1,2,2,1,0,0,0,0,1],
	[1,0,1,1,1,0,1,2,1,1,0,1,1,0,1],
	[1,0,0,0,0,0,1,2,1,0,0,0,0,0,1],
	[1,1,0,1,1,0,1,2,1,0,1,1,0,1,1],
	[1,1,0,1,1,0,1,1,1,0,1,1,0,1,1],
	[1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
	[1,0,1,1,1,1,0,1,0,1,1,1,1,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];
var grid_x = grid_blocks[0].length;
var grid_y = grid_blocks.length;

var height = $(document).height() - 30;
var width = $(document).width() - 30;
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
canvas.height = height;
canvas.width = width;

var grid_size = parseInt(height/grid_y);
var half_grid_size = parseInt(grid_size/2);
var grid_x_real = grid_size*grid_x;
var grid_y_real = grid_size*grid_y;

var TIMEOUT = parseInt(8*20/grid_size);
var TURNS_PER_SEC = parseInt(1000/TIMEOUT);
var DRAW_BUFFER = 2;
var DRAW_COUNT = 0;

var makeKeyin = function() {
	var self = {};

	var buffer = grid_size;

	var buttons = {
		UP: 0,
		DOWN: 0,
		LEFT: 0,
		RIGHT: 0
	};
	self.buttons = buttons;

	self.empty = function(){
		for(var dir in buttons){
			buttons[dir] = 0;
		}
	};

	self.get = function(){
		var max = 0;
		var res = null;
		for(var dir in buttons){
			if(buttons[dir] > max){
				res = dir;
				max = buttons[dir];
			}
		}
		return res;
	};

	self.step = function(){
		for(var dir in buttons){
			if(buttons[dir] > 0){
				buttons[dir] -= 1;
			}
		}
	}

	window.onkeydown = function(e) {
    	var key = e.keyCode ? e.keyCode : e.which;

    	var pressed = null;
    	if (key == 38){
    		pressed = UP;
    	} else if (key == 40){
    		pressed = DOWN;
    	} else if (key == 37){
    		pressed = LEFT;
    	} else if (key == 39){
    		pressed = RIGHT;
    	} else if (key == 67){ // c
    		brain.tryChariot = true;
		} else if (key == 82){ // r
			brain.gameover = true;
		} else if (key == 49){ // 1
			brain.pelletCount += 10;
		} else if (key == 73){ // I
			brain.invuln = !brain.invuln;
		}

    	if(pressed){
    		buttons[pressed] = buffer;
    	}
	}

	var handleTouch = function(e){
		e.preventDefault();
		if(e.changedTouches){
			e = e.changedTouches[0];
		}
		// brain.latestEvent = e;

		if (e.pageX > width/4 &&
			e.pageX < width/4*3 &&
			e.pageY > height/4 &&
			e.pageY < height/4*3){
			brain.tryChariot = true;
		} else {
			var slope = height/width;
			var f = function(x){
				return -1*slope*x + height;
			}
			var g = function(x){
				return slope*x;
			}
			var possible = {
				UP: true,
				DOWN: true,
				LEFT: true,
				RIGHT: true
			};
			if(f(e.pageX) > e.pageY){
				possible[DOWN] = false;
				possible[RIGHT] = false;
			} else {
				possible[UP] = false;
				possible[LEFT] = false;
			}
			if(g(e.pageX) > e.pageY){
				possible[DOWN] = false;
				possible[LEFT] = false;
			} else {
				possible[UP] = false;
				possible[RIGHT] = false;
			}
			// brain.latestPossible = possible;
			for(var dir in possible){
				if(possible[dir]){
					buttons[dir] = buffer;
				}
			}
		}
	}

	document.addEventListener("mousedown", handleTouch, false);
	document.addEventListener("touchend", handleTouch, false);

	return self;
};

function pair(x,y){
	var self = {};
	self.x = x;
	self.y = y;
	self.equals = function(other){
		return self.x == other.x && self.y == other.y;
	}
	return self;
};

var dir_pairs = [
	pair(-1,0),
	pair(1,0),
	pair(0,-1),
	pair(0,1),
]

var coord = function(x, y) {
	return pair(parseInt(x/grid_size), parseInt(y/grid_size));
};

var reverseCoord = function (n) {
	return n*grid_size + half_grid_size;
}

var get_grid = function(coord){
	if(coord.x < 0 || coord.x >= grid_x || coord.y < 0 || coord.y >= grid_y){
		return -1;
	}
	return grid_blocks[coord.y][coord.x];
}

var is_grid = function(coord){
	return get_grid(coord) == GRID_BLOCK;
};

var is_pellet = function(coord){
	return brain.pellets[coord.y][coord.x];
};

var eatPellet = function(coord){
	if(is_pellet(coord)){
		brain.pellets[coord.y][coord.x] = false;
		brain.pelletCount++;
	}
};

var will_overlap_grid = function(x, y, dx, dy){
	if(atIntersection(x,y)){
		var far_x = x + (dx*grid_size);
		var far_y = y + (dy*grid_size);
		return is_grid(coord(far_x, far_y));
	} else {
		if(x % grid_size == half_grid_size){
			return dx != 0;
		} else if(y % grid_size == half_grid_size){
			return dy != 0;
		}
	}

	throw 'impossible scenario';
};

var atIntersection = function(x, y){
	return x % grid_size == half_grid_size && y % grid_size == half_grid_size;
}

var makeBody = function(asset) {

	var self = {};

	self.img = asset.img; //store so we can dynamically change it
	self.spawn = asset.spawn;

	self.alive = true;
	self.dx = 0;
	self.dy = 0;

	self.step_sum = 0.0;
	self.step_freq = asset.step_freq;

	self.get_step_freq = function(){
		throw 'implemented by children';
	};

	self.respawn = function(){
		self.x = reverseCoord(self.spawn.x);
		self.y = reverseCoord(self.spawn.y);
	};

	self.atIntersection = function(){
		return atIntersection(self.x, self.y);
	};

	self.get_coord = function(){
		return coord(self.x, self.y);
	};

	self.base_step = function(){
		if(will_overlap_grid(self.x, self.y, self.dx, self.dy)){
			return;
		}

		self.x += self.dx;
		self.y += self.dy;
	};

	self.step = function(){
		self.step_sum += self.get_step_freq();
		while(self.step_sum > 1){
			self.step_sum--;
			self.inner_step();
		}
	};

	self.draw = function(){
		if(self.dx < 0 || self.dy < 0){
			img = self.img.leftImg;
		} else {
			img = self.img.rightImg;
		}

		var half = grid_size;
		var full = half*2;

		if(!self.alive){
			ctx.globalAlpha = 0.5;
		}
		ctx.drawImage(
			img,
			self.x - half,
			self.y - half,
			full, full
		);
		if(!self.alive){
			ctx.globalAlpha = 1;
		}
	};

	self.respawn();
	return self;
}

var makeEnemy = function(asset, chaseFunc) {

	var self = makeBody(asset);

	self.kill = function(){
		if(self.alive){
			self.alive = false;
			self.dx = 0;
			self.dy = 0;
		}
	}

	self.is_still = function(){
		return self.dx == 0 && self.dy == 0;
	}

	self.is_home = function(){
		return self.get_coord().equals(self.spawn);
	}

	self.panic = function(){
		self.dx *= -1;
		self.dy *= -1;
	}

	var possibleDirections = function(){
		good_dirs = [];
		dir_pairs.forEach(function (d){
			if(d.x == -1*self.dx && d.y == -1*self.dy){
				//do nothing
			}
			else if(!will_overlap_grid(self.x, self.y, d.x, d.y)){
				good_dirs.push(d);
			}
		})
		return good_dirs;
	}

	var determineDirection = function(){
		if(self.atIntersection() || self.is_still()){
			var chosen_dir;
			var valid_dirs = possibleDirections();
			if(self.alive){
				var result_dirs = chaseFunc(self, valid_dirs);
				chosen_dir = result_dirs[0];
				if(brain.isChariot){
					chosen_dir = result_dirs[1];
				}
			} else {
				chosen_dir = get_home(self, valid_dirs);
			}
			self.dx = chosen_dir.x;
			self.dy = chosen_dir.y;
		}
	};

	self.get_step_freq = function(){
		if(!self.alive){
			return 0.5;
		}
		return self.step_freq;
	}

	self.inner_step = function(){
		determineDirection();
		self.base_step();
		if(self.is_home()){
			self.alive = true;
		}
	}

	return self;
}

var makeProtag = function(asset) {

	var self = makeBody(asset);

	self.keyin = function(input){
		if(!input){
			return;
		}

		var new_dx = 0;
		var new_dy = 0;
		if(input == UP){
			new_dy = -1;
		} else if (input == DOWN){
			new_dy = 1;
		} else if (input == LEFT){
			new_dx = -1;
		} else if (input == RIGHT){
			new_dx = 1;
		}

		if(will_overlap_grid(self.x, self.y, new_dx, new_dy)){
			return;
		}

		self.dx = new_dx;
		self.dy = new_dy;
	};

	self.get_step_freq = function(){
		if(brain.isChariot){
			return 2;
		}
		return self.step_freq;
	}

	self.inner_step = function(){
		if(self.atIntersection()){
			eatPellet(self.get_coord());
		}
		self.base_step();
	}

	return self;
}

var pythagoreanDistance = function(coord1, coord2){
	return Math.sqrt(
		Math.pow(coord1.x - coord2.x, 2) + Math.pow(coord1.y - coord2.y, 2)
	);
}

var _chaseToCoord = function(self, dirs, destination){
	var min = null;
	var best_dir = null;
	var max = null;
	var worst_dir = null;
	dirs.forEach(function (d){
		var next = self.get_coord();
		next.x += d.x;
		next.y += d.y;
		var distance = pythagoreanDistance(destination, next);
		if(!best_dir || min > distance){
			min = distance;
			best_dir = d;
		}
		if(!worst_dir || max < distance){
			max = distance;
			worst_dir = d;
		}
	});
	return [best_dir, worst_dir];
}

var get_home = function(self, dirs){
	return _chaseToCoord(self, dirs, self.spawn)[0];
}

var chaseProtag = function(self, dirs){
	var destination = brain.protag.get_coord();
	return _chaseToCoord(self, dirs, destination);
}

var predictProtag = function(self, dirs){
	var destination = brain.protag.get_coord();
	destination.x += brain.protag.dx * 3;
	destination.y += brain.protag.dy * 3;
	return _chaseToCoord(self, dirs, destination);
}

var vectorProtagFactory = function(ally){
	var chaseFunc = function(self, dirs){
		var pivot = brain.protag.get_coord();
		var other = ally.get_coord();
		var destination = pair(
			pivot.x*2 - other.x,
			pivot.y*2 - other.y
		);
		return _chaseToCoord(self, dirs, destination);
	};
	return chaseFunc;
}

function drawGridSquare(crd){
	ctx.fillRect(
		crd.x*grid_size + grid_size*7/16,
		crd.y*grid_size + grid_size*7/16,
		grid_size/8, grid_size/8
	);
	if(is_grid(pair(crd.x, crd.y - 1))){
		ctx.fillRect(
			crd.x*grid_size + grid_size*7/16,
			crd.y*grid_size,
			grid_size/8, grid_size/2
		);
	}
	if(is_grid(pair(crd.x, crd.y + 1))){
		ctx.fillRect(
			crd.x*grid_size + grid_size*7/16,
			crd.y*grid_size + grid_size/2,
			grid_size/8, grid_size/2
		);
	}
	if(is_grid(pair(crd.x - 1, crd.y))){
		ctx.fillRect(
			crd.x*grid_size,
			crd.y*grid_size + grid_size*7/16,
			grid_size/2, grid_size/8
		);
	}
	if(is_grid(pair(crd.x + 1, crd.y))){
		ctx.fillRect(
			crd.x*grid_size + grid_size/2,
			crd.y*grid_size + grid_size*7/16,
			grid_size/2, grid_size/8
		);
	}
}

function drawBaseGrid(color){
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, width, height);

	ctx.fillStyle = color;
	for(var x = 0; x < grid_x; x++){
		for(var y = 0; y < grid_y; y++){
			crd = pair(x,y);
			if(is_grid(crd)){
				drawGridSquare(crd);
			}
		}
	}

	var img_url = canvas.toDataURL();
	console.log(img_url);
	return img_url;
};

function drawGrid(){

	var base_img = brain.base_grid;
	if(brain.isChariot){
		base_img = brain.base_grid_chariot;
	}
	ctx.drawImage(
		base_img,
		0, 0, width, height
	);

	ctx.fillStyle = brain.asset.chariot.img.color;
	for(var x = 0; x < grid_x; x++){
		for(var y = 0; y < grid_y; y++){
			crd = pair(x,y);
			if(is_pellet(crd)){
				ctx.fillRect(
					crd.x*grid_size + grid_size*7/16,
					crd.y*grid_size + grid_size*7/16,
					grid_size/8, grid_size/8
				);
			}
		}
	}

	ctx.fillStyle = "#DDDDDD";
	ctx.font = grid_size + "px serif";
	ctx.fillText("Pellet count: " + brain.pelletCount, 10, grid_size/6*5);
	if(!brain.isChariot && brain.pelletCount >= CHARIOT_PELLET_MIN){
		ctx.fillText("PRESS C TO ACTIVATE STAND", 10, grid_y_real - grid_size/6);
	}
	if(debug){
		ctx.fillText("GS:" + grid_size, grid_x_real/2, grid_size/6*5);
		ctx.fillText(
			JSON.stringify(brain.keyreader.buttons),
			10, grid_y_real - 50
		);
	}
};

function checkCollisions(){
	var protag_coord = brain.protag.get_coord();
	brain.enemies.forEach(function (e){
		var collision = e.get_coord().equals(protag_coord);
		if(collision && e.alive){
			if(brain.isChariot){
				e.kill();
			} else if(brain.invuln){
				// do nothing
			} else {
				brain.gameover = true;
			}
		}
	});
}

var CHARIOT_PELLET_MIN = 20;
var CHARIOT_COUNTDOWN_BUFFER = parseInt(TURNS_PER_SEC/20);
var CHARIOT_COUNTDOWN_COUNT = 0;

function stepChariot(){
	if(brain.tryChariot && !brain.isChariot){
		if(brain.pelletCount >= CHARIOT_PELLET_MIN){
			brain.isChariot = true;
			brain.protag.img = brain.asset.chariot.img;
			brain.enemies.forEach(function (e){
				e.panic();
			});
		}
	}
	brain.tryChariot = false;

	if(brain.pelletCount == 0){
		brain.isChariot = false;
		brain.protag.img = brain.asset.polnareff.img;
	}

	if(brain.isChariot){
		if(CHARIOT_COUNTDOWN_COUNT == 0){
			CHARIOT_COUNTDOWN_COUNT = CHARIOT_COUNTDOWN_BUFFER;
			brain.pelletCount--;
		}
		CHARIOT_COUNTDOWN_COUNT--;
	}
}

function turn(){
	if(brain.gameover){
		return start();
	}

	window.setTimeout(turn, TIMEOUT);

	brain.protag.keyin(brain.keyreader.get());

	stepChariot();

	brain.everybody.forEach(function(e){
		e.step()
	});

	brain.keyreader.step();

	checkCollisions();

	if(DRAW_COUNT == 0){
		DRAW_COUNT = DRAW_BUFFER;
		drawGrid();
		brain.everybody.forEach(function(e){
			e.draw()
		});
	}
	DRAW_COUNT--;
};


function start(){
	brain.gameover = false;

	brain.keyreader.empty();

	brain.protag = makeProtag(brain.asset.polnareff);
	var red = makeEnemy(brain.asset.iggy, chaseProtag);
	var pink = makeEnemy(brain.asset.iggy_pink, predictProtag);
	var blue = makeEnemy(brain.asset.toilet, vectorProtagFactory(red));
	brain.enemies = [red, pink, blue];
	brain.everybody = [brain.protag].concat(brain.enemies);

	var pellets = []
	for(var b = 0; b < grid_y; b++){
		pellets[b] = [];
		for(var a = 0; a < grid_x; a++){
			var p = pair(a,b);
			pellets[b][a] = get_grid(p) == GRID_PELLET;
		}
	}
	brain.pellets = pellets;
	brain.pelletCount = 0;
	brain.tryChariot = false;
	brain.isChariot = false;
	brain.invuln = debug;
	if(debug){
		brain.pelletCount = 50;
	}

	turn();
};

function sprite(color, leftImg, rightImg){
	var self = {};
	self.color = color;
	self.leftImg = leftImg;
	self.rightImg = rightImg;
	return self;
}

// run

brain.asset = {};
brain.keyreader = makeKeyin();

var pol_left = new Image();
pol_left.src = IMG_PATH + "pol_left2.png";
var pol_right = new Image();
pol_right.src = IMG_PATH + "pol_right2.png";
brain.asset.polnareff = {};
brain.asset.polnareff.img = sprite('white', pol_left, pol_right);
brain.asset.polnareff.spawn = pair(1, 1);
brain.asset.polnareff.step_freq = 1.0;

var char_left = new Image();
char_left.src = IMG_PATH + "char_left.png";
var char_right = new Image();
char_right.src = IMG_PATH + "char_right.png";
brain.asset.chariot = {};
brain.asset.chariot.img = sprite('#bbbb00', char_left, char_right);

var iggy_left = new Image();
iggy_left.src = IMG_PATH + "iggy_left.png";
var iggy_right = new Image();
iggy_right.src = IMG_PATH + "iggy_right.png";
brain.asset.iggy = {};
brain.asset.iggy.img = sprite('red', iggy_left, iggy_right);
brain.asset.iggy.spawn = pair(grid_x - 2, 1);
brain.asset.iggy.step_freq = 0.9;

//todo find original sprite
brain.asset.iggy_pink = {};
brain.asset.iggy_pink.img = sprite('pink', iggy_left, iggy_right);
brain.asset.iggy_pink.spawn = pair(1, grid_y - 2);
brain.asset.iggy_pink.step_freq = 0.9;

var toilet_left = new Image();
toilet_left.src = IMG_PATH + "toilet_left.png";
var toilet_right = new Image();
toilet_right.src = IMG_PATH + "toilet_right.png";
brain.asset.toilet = {};
brain.asset.toilet.img = sprite('blue', toilet_left, toilet_right);
brain.asset.toilet.spawn = pair(grid_x - 2, grid_y - 2);
brain.asset.toilet.step_freq = 0.9;

brain.base_grid = new Image();
brain.base_grid.src = drawBaseGrid('#551a8b');
brain.base_grid_chariot = new Image();
brain.base_grid_chariot.src = drawBaseGrid(brain.asset.chariot.img.color);

start();

});

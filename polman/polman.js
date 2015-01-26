ctx = null;

brain = null;

grid_size = 60;
TIMEOUT = 5;
DRAW_BUFFER = 3;
DRAW_COUNT = 0;

UP = 'UP';
DOWN = 'DOWN';
LEFT = 'LEFT';
RIGHT = 'RIGHT';

var makeKeyin = function() {
	var self = {};

	var buffer = grid_size;

	var buttons = {
		UP: 0,
		DOWN: 0,
		LEFT: 0,
		RIGHT: 0
	};

	self.empty = function(){
		for(var dir in buttons){
			buttons[dir] = 0;
		}
	};

	self.get = function(){
		max = 0;
		res = null;
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

    	pressed = null;
    	if (key == 38){
    		pressed = UP;
    	} else if (key == 40){
    		pressed = DOWN;
    	} else if (key == 37){
    		pressed = LEFT;
    	} else if (key == 39){
    		pressed = RIGHT;
    	}

    	if(pressed){
    		buttons[pressed] = buffer;
    	}
	}

	return self;
};


grid_blocks = [
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
	[1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
	[1,0,1,1,0,1,0,1,0,1,0,1,1,0,1],
	[1,0,0,0,0,1,0,0,0,1,0,0,0,0,1],
	[1,0,1,1,0,1,0,1,0,1,0,1,1,0,1],
	[1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
	[1,1,0,1,1,0,1,1,1,0,1,1,0,1,1],
	[1,1,0,1,1,0,1,1,1,0,1,1,0,1,1],
	[1,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
	[1,0,1,1,1,1,0,1,0,1,1,1,1,0,1],
	[1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
	[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];
grid_x = grid_blocks[0].length;
grid_y = grid_blocks.length;

function pair(x,y){
	var self = {};
	self.x = x;
	self.y = y;

	self.equals = function(other){
		return self.x == other.x && self.y == other.y;
	}

	return self;
};

var coord = function(x, y) {
	return pair(parseInt(x/grid_size), parseInt(y/grid_size));
};

var is_grid = function(coord){
	return grid_blocks[coord.y][coord.x];
};

var is_pellet = function(coord){
	return brain.pellets[coord.y][coord.x];
};

var eatPellet = function(coord){
	brain.pellets[coord.y][coord.x] = false;
};

var will_overlap_grid = function(x, y, dx, dy){
	if(atIntersection(x,y)){
		var far_x = x + (dx*grid_size);
		var far_y = y + (dy*grid_size);
		return is_grid(coord(far_x, far_y));
	} else {
		if(x % grid_size == grid_size/2){
			return dx != 0;
		} else if(y % grid_size == grid_size/2){
			return dy != 0;
		}
	}

	throw 'impossible scenario';
};

var atIntersection = function(x, y){
	return x % grid_size == grid_size/2 && y % grid_size == grid_size/2;
}

var makeBody = function() {

	var self = {};

	self.dx = 0;
	self.dy = 0;

	self.x = grid_size*1.5;
	self.y = grid_size*1.5;

	self.atIntersection = function(){
		return atIntersection(self.x, self.y);
	}

	self.get_coord = function(){
		return coord(self.x, self.y);
	};

	self.step = function(){
		if(will_overlap_grid(self.x, self.y, self.dx, self.dy)){
			return;
		}

		self.x += self.dx;
		self.y += self.dy;
	};

	self.draw = function(){
		throw 'child must implement';
	};

	return self;
}

var makeEnemy = function(style, chaseFunc) {

	var self = makeBody();

	self.x = grid_size*grid_x - self.x;
	self.y = grid_size*grid_y - self.y;

	var possibleDirections = function(){
		dirs = [
			pair(-1,0),
			pair(1,0),
			pair(0,-1),
			pair(0,1),
		]
		good_dirs = [];

		dirs.forEach(function (d){
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
		if(self.atIntersection()){
			valid_dirs = possibleDirections();
			result_dir = chaseFunc(self, valid_dirs);
			self.dx = result_dir.x;
			self.dy = result_dir.y;
		}
	};

	self._step = self.step;
	self.step = function(){
		determineDirection();
		self._step();
	}

	self.draw = function(){
		if(self.dx < 0 || self.dy < 0){
			img = brain.iggy_left;
		} else {
			img = brain.iggy_right;
		}
		ctx.drawImage(
			img,
			self.x - grid_size/2,
			self.y - grid_size/2,
			grid_size, grid_size
		);

		ctx.beginPath();
		ctx.strokeStyle=style;
		ctx.rect(
			self.x - grid_size/2,
			self.y - grid_size/2,
			grid_size, grid_size
		);
		ctx.stroke();
	}

	return self;
}

var makeProtag = function() {

	var self = makeBody();

	self.keyin = function(input){
		if(!input){
			return;
		}

		new_dx = 0;
		new_dy = 0;
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

	self._step = self.step;
	self.step = function(){
		if(self.atIntersection()){
			eatPellet(self.get_coord());
		}
		self._step();
	}

	self.draw = function(){
		if(self.dx < 0 || self.dy < 0){
			img = brain.pol_left;
		} else {
			img = brain.pol_right;
		}
		ctx.drawImage(
			img,
			self.x - grid_size/2,
			self.y - grid_size/2,
			grid_size, grid_size
		);

		ctx.beginPath();
		ctx.strokeStyle="white";
		ctx.rect(
			self.x - grid_size/2,
			self.y - grid_size/2,
			grid_size, grid_size
		);
		ctx.stroke();
	};

	return self;
}

var pythagoreanDistance = function(coord1, coord2){
	return Math.sqrt(
		Math.pow(coord1.x - coord2.x, 2) + Math.pow(coord1.y - coord2.y, 2)
	);
}

var chaseProtag = function(self, dirs){
	var best_min = null;
	var best_dir = null;
	dirs.forEach(function (d){
		var next = self.get_coord();
		next.x += d.x;
		next.y += d.y;
		var distance = pythagoreanDistance(brain.protag.get_coord(), next);
		if(!best_dir || best_min > distance){
			best_min = distance;
			best_dir = d;
		}
	});
	return best_dir;
}

function drawGrid(){
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0,grid_size*grid_x,grid_size*grid_y);

	for(var x = 0; x < grid_x; x++){
		for(var y = 0; y < grid_y; y++){
			crd = pair(x,y);
			if(is_grid(crd)){
				ctx.fillStyle = "#888888";
				ctx.fillRect(
					x*grid_size, y*grid_size,
					grid_size, grid_size
				);
			} else if(is_pellet(crd)){
				ctx.fillStyle = "#bbbb00";
				ctx.fillRect(
					x*grid_size + grid_size/2 - grid_size/16,
					y*grid_size + grid_size/2 - grid_size/16,
					grid_size/8, grid_size/8
				);
			}
		}
	}
};

function isGameOver(){
	var protag_coord = brain.protag.get_coord();
	var collision = false;
	brain.enemies.forEach(function (e){
		collision |= e.get_coord().equals(protag_coord);
	});
	return collision;
}

function turn(){
	if(brain.gameover){
		return start();
	}

	window.setTimeout(turn, TIMEOUT);

	brain.protag.keyin(brain.keyreader.get());

	brain.everybody.forEach(function(e){
		e.step()
	});

	brain.keyreader.step();

	brain.gameover |= isGameOver();

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

	brain.protag = makeProtag();
	var red = makeEnemy('red', chaseProtag);
	brain.enemies = [red];
	brain.everybody = [brain.protag].concat(brain.enemies);

	var pellets = []
	for(var b = 0; b < grid_y; b++){
		pellets[b] = [];
		for(var a = 0; a < grid_x; a++){
			var p = pair(a,b);
			pellets[b][a] = !is_grid(p);
		}
	}
	brain.pellets = pellets;

	turn();
};

IMG_PATH = 'img/'

$(document).ready(function(){
	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");

	brain = {};
	brain.keyreader = makeKeyin();

	brain.pol_left = new Image();
	brain.pol_left.src = IMG_PATH + "pol_left.png";
	brain.pol_right = new Image();
	brain.pol_right.src = IMG_PATH + "pol_right.png";

	brain.iggy_left = new Image();
	brain.iggy_left.src = IMG_PATH + "iggy_left.png";
	brain.iggy_right = new Image();
	brain.iggy_right.src = IMG_PATH + "iggy_right.png";

	start();
});

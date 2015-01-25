ctx = null;

brain = null;

grid_size = 50;
TIMEOUT = 10;

UP = 'UP';
DOWN = 'DOWN';
LEFT = 'LEFT';
RIGHT = 'RIGHT';

var makeKeyin = function() {
	var self = {};

	var buffer = grid_size/2;

	var buttons = {
		UP: 0,
		DOWN: 0,
		LEFT: 0,
		RIGHT: 0
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
	[1,1,1,1,1,1,1],
	[1,0,0,1,0,1,1],
	[1,0,1,0,0,0,1],
	[1,0,1,1,0,1,1],
	[1,0,0,0,0,0,1],
	[1,1,1,1,1,1,1]
];
grid_x = grid_blocks[0].length;
grid_y = grid_blocks.length;

function pair(x,y){
	var self = {};
	self.x = x;
	self.y = y;
	return self;
};

var coord = function(x, y) {
	return pair(parseInt(x/grid_size), parseInt(y/grid_size));
};

var is_grid = function(coord){
	return grid_blocks[coord.y][coord.x];
};

var will_overlap_grid = function(x, y, dx, dy){
	var ret = false;

	var far_x = x + dx + (dx*grid_size/2);
	var far_y = y + dy + (dy*grid_size/2);
	ret = ret || is_grid(coord(far_x, far_y));

	if(dx == 0){
		far_x = x - 1 + (grid_size/2);
		ret = ret || is_grid(coord(far_x, far_y));
		far_x = x + 1 - (grid_size/2);
		ret = ret || is_grid(coord(far_x, far_y));
	} else {
		far_y = y - 1 + (grid_size/2);
		ret = ret || is_grid(coord(far_x, far_y));
		far_y = y + 1 - (grid_size/2);
		ret = ret || is_grid(coord(far_x, far_y));		
	}

	return ret
};

var makeBody = function() {

	var self = {};

	self.dx = 0;
	self.dy = 0;

	self.x = grid_size*1.5;
	self.y = grid_size*1.5;

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

var makeEnemy = function() {

	var self = makeBody();

	var possibleDirections = function(){
		dirs = [
			pair(-1,0),
			pair(1,0),
			pair(0,-1),
			pair(0,1),
		]
		good_dirs = [];

		dirs.forEach(function (d){
			if(d.x == self.dx && d.y == self.dy){
				continue;
			}
			if(!will_overlap_grid(self.x, self.y, d.x, d.y)){
				good_dirs.append(d);
			}
		})

		return good_dirs;
	}

	var determineDirection = function(){
		if(will_overlap_grid(self.x, self.y, self.dx, self.dy)){
			//present course will hit a wall
			self.dx *= -1;
			self.dy *= -1;
			return;
		}
		valid_dirs = possibleDirections();
		if(valid_dirs.length > 1){
			
		}
	};

	self._step = self.step;
	self.step = function(){
		determineDirection();
		self._step();
	}
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

	// animation_duration = 1000/TIMEOUT;
	// animation_step = animation_duration;
	// animation_frame = false;

	self.draw = function(){
		// animation_step--;
		// if(animation_step == 0){
		// 	animation_step = animation_duration;
		// 	animation_frame = !animation_frame;
		// }

		// mouth = grid_size;
		// if(animation_frame){
		// 	mouth *= 0.7;
		// }


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
	};

	return self;
}

function drawGrid(){
	ctx.fillStyle = "#000000";
	ctx.fillRect(0,0,grid_size*grid_x,grid_size*grid_y);

	ctx.fillStyle = "#888888";
	for(var x = 0; x < grid_x; x++){
		for(var y = 0; y < grid_y; y++){
			crd = pair(x,y);
			if(is_grid(crd)){
				ctx.fillRect(
					x*grid_size, y*grid_size,
					grid_size, grid_size
				);
			}
		}
	}
};

function turn(){

	brain.protag.keyin(brain.keyreader.get());

	brain.everybody.forEach(function(e){
		e.step()
	});

	brain.keyreader.step();

	drawGrid();
	brain.everybody.forEach(function(e){
		e.draw()
	});

	window.setTimeout(turn, TIMEOUT);
};


function start(){
	turn();
};

$(document).ready(function(){
	canvas = document.getElementById("myCanvas");
	ctx = canvas.getContext("2d");

	brain = {};
	brain.keyreader = makeKeyin();
	brain.protag = makeProtag();
	brain.everybody = [brain.protag];

	brain.pol_left = new Image();
	brain.pol_left.src = "pol_left.png";
	brain.pol_right = new Image();
	brain.pol_right.src = "pol_right.png";

	start();
});

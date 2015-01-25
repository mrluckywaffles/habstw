ctx = null;

brain = null;

grid_size = 50;
TIMEOUT = 10;

UP = 'UP';
DOWN = 'DOWN';
LEFT = 'LEFT';
RIGHT = 'RIGHT';

var makeKeyin = function() {
	self = {};

	buffer = grid_size/2;

	buttons = {
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
	self = {};
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

	far_x = x + dx + (dx*grid_size/2);
	far_y = y + dy + (dy*grid_size/2);
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

makeBody = function() {

	self = {};

	dx = 0;
	dy = 0;

	x = grid_size*1.5;
	y = grid_size*1.5;

	self.get_coord = function(){
		return coord(x,y);
	};

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

		if(will_overlap_grid(x, y, new_dx, new_dy)){
			return;
		}

		dx = new_dx;
		dy = new_dy;
	};

	self.step = function(){
		if(will_overlap_grid(x, y, dx, dy)){
			return;
		}

		x += dx;
		y += dy;
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


		if(dx < 0 || dy < 0){
			img = brain.pol_left;
		} else {
			img = brain.pol_right;
		}
		ctx.drawImage(
			img,
			x - grid_size/2,
			y - grid_size/2,
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

	keyin = brain.keyreader.get();

	brain.protag.keyin(keyin);

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
	brain.protag = makeBody();
	brain.everybody = [brain.protag];

	brain.pol_left = new Image();
	brain.pol_left.src = "pol_left.png";
	brain.pol_right = new Image();
	brain.pol_right.src = "pol_right.png";

	start();
});

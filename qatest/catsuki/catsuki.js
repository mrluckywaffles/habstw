var current = 0;
function fillCats(){
	var catPercent = 100 / current;
	$('body').css('background-size', catPercent+'%');
}
	
function randomSize(){
	var numCatsAcross = current;
	while(numCatsAcross == current){
		numCatsAcross = Math.floor(Math.random()*20) + 4;
	}
	current = numCatsAcross;
	fillCats();
}

function increasingSize(){
	current--;
	if(current < 1){
		current = 40;
	}
	fillCats();
}

function decreasingSize(){
	current++;
	if(current > 40){
		current = 1;
	}
	fillCats();
}

var allFuncs = [
// 				randomSize,
	increasingSize,
	decreasingSize
];

var currentFunc = 0;
function catFunc(){
	allFuncs[currentFunc]();
};

function incrementFunc(){			
	if(currentFunc >= allFuncs.length - 1){
		currentFunc = 0;
	}
	else{
		currentFunc++;
	}
};

$('body').on('click', incrementFunc);

$(document).ready(function(){
	setInterval(catFunc, 50);
});
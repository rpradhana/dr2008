/**
 * Helper functions
 */
var $ = function(selector, context) {
	return (context || document).querySelector(selector);
}

/**
 * Global variables
 */
var
	COL_COUNT = 9,
	ROW_COUNT = 6,
	SPACING   = 16,
	SIZE      = 64,
	INITIAL_INTERVAL = 2000,
	BOOST_PER_STEP   = INITIAL_INTERVAL / (COL_COUNT * ROW_COUNT) * 0.9,
	STEPS_TRESHOLD = ROW_COUNT * COL_COUNT;

var
	counter = 0,
	scrambledRow = [],
	scrambledCol = []
	queue = [];

var end = false;

/**
 * Jellyfish Object
 */
var Jellyfish = function(xPosition, yPosition) {
	this.x = xPosition;
	this.y = yPosition;
	this.on = false;

	Jellyfish.prototype.activate = function(x) {
		console.log('yay');
	};

	Jellyfish.prototype.draw = function() {
		this.spawn(
			'<div> TEST </div>',
			$('#container'),
		);
	};

	Jellyfish.prototype.spawn = function(content, target, parentClass, parentId, cb) {
		console.log('Jellyfish spawned');
		// Definitions
		var el = document.createElement("div");

		// Add content and attributes to the modal
		if (parentId) {
			el.setAttribute("id", parentId)
		};
		if (parentClass) {
			el.setAttribute("class", parentClass)
		};
		el.innerHTML = content;
		target.insertBefore(el, target.firstChild);

		if (cb) return cb(el);
	}

	Jellyfish.prototype.setSelector = function(selector) {
		this.selector = selector;
	};

	Jellyfish.prototype.activate = function() {
		if (this.on) {
			console.error('jellyfish is already active!');
			return false;
		}

		var colors = anime({
			targets: this.selector,
			backgroundColor: function() {
				return ['rgb(255, 255, 255)']
			},
			easing: 'easeOutSine',
			direction: 'alternate',
			duration: function() {
				return INITIAL_INTERVAL - (BOOST_PER_STEP * counter);
			},
			loop: true
		});
		console.log('jellyfish[' + this.x + '][' + this.y + '] activated');
		console.log(this.selector);
		this.on = true;
		return true;
	}

	Jellyfish.prototype.stop = function() {
		$('#container').style.opacity = 0;
	}
}

/**
 * Initialize jellyfish matrix
 */

var jellyfish = new Array(COL_COUNT);
for (var col = 0; col < COL_COUNT; col++) {
	jellyfish[col] = new Array(ROW_COUNT);

	// Instantiate jellyfish
	for (var row = 0; row < ROW_COUNT; row++) {
		jellyfish[col][row] = new Jellyfish(col * (SIZE + SPACING), row * (SIZE + SPACING));

		jellyfish[col][row].spawn(
			`<div class="square-` + col + '-' + row + `"
			      style="left:   ` + jellyfish[col][row].x + `px;
			             top:    ` + jellyfish[col][row].y + `px;
			             width:  ` + SIZE + `px;
			             height: ` + SIZE + `px">
				
			</div>`,
			$('#container')
		);

		jellyfish[col][row].setSelector('.square-' + col + '-' + row);
	}
}

/**
 * Scrambler
 */
for (ii = 0; ii < COL_COUNT; ++ii) scrambledCol[ii] = ii;
for (ii = 0; ii < ROW_COUNT; ++ii) scrambledRow[ii] = ii;

// http://stackoverflow.com/questions/962802#962890
var shuffle = function(array) {
	var tmp, current, top = array.length;
	if(top) while(--top) {
		current = Math.floor(Math.random() * (top + 1));
		tmp = array[current];
		array[current] = array[top];
		array[top] = tmp;
	}
	return array;
}

/**
 * Scramble queue
 */

// TO DO: auto generate this based on col count & row count!
queue = [
	[0, 0],
	[1, 0],
	[2, 0],
	[3, 0],
	[4, 0],
	[5, 0],
	[6, 0],
	[7, 0],
	[8, 0],

	[0, 1],
	[1, 1],
	[2, 1],
	[3, 1],
	[4, 1],
	[5, 1],
	[6, 1],
	[7, 1],
	[8, 1],

	[0, 2],
	[1, 2],
	[2, 2],
	[3, 2],
	[4, 2],
	[5, 2],
	[6, 2],
	[7, 2],
	[8, 2],

	[0, 3],
	[1, 3],
	[2, 3],
	[3, 3],
	[4, 3],
	[5, 3],
	[6, 3],
	[7, 3],
	[8, 3],

	[0, 4],
	[1, 4],
	[2, 4],
	[3, 4],
	[4, 4],
	[5, 4],
	[6, 4],
	[7, 4],
	[8, 4],

	[0, 5],
	[1, 5],
	[2, 5],
	[3, 5],
	[4, 5],
	[5, 5],
	[6, 5],
	[7, 5],
	[8, 5]
]

shuffle(queue);

/**
 * Background Color handler
 */
var
	MAX_RED  = 255,
	MAX_BLUE = 255,
	r = 0,
	b = 255,
	rIncrement = (MAX_RED/(COL_COUNT * ROW_COUNT)),
	bIncrement = (MAX_BLUE/(COL_COUNT * ROW_COUNT));

var handleColor = function() {
	if (r >= 0 && counter <= COL_COUNT * ROW_COUNT) r+=rIncrement;
	if (b >= 0 && counter <= COL_COUNT * ROW_COUNT) b-=bIncrement;

	if (counter <= ROW_COUNT * COL_COUNT) $('body').style.background = 'rgb(' + r + ', 0, ' + b + ')';
}


/**
 * Step handler
 */

var step = function() {
	if (end) return;
	if (counter >= STEPS_TRESHOLD) {
		counter = 0;
		reset();
		return;
	}

	console.log(counter);
	jellyfish[queue[counter][0]][queue[counter][1]].activate();
	console.log(queue[counter][0] + '-'+ queue[counter][1]);
	if (counter < STEPS_TRESHOLD) {
		counter++;
		$('#counter').innerHTML = counter;
	}

	handleColor();
	return counter;
}

var step10 = function() {
	step();
	step();
	step();
	step();
	step();
	step();
	step();
	step();
	step();
	step();
}

/**
 * Reset all
 */

var reset = function() {
	console.log('Reset');
	for (var col = 0; col < COL_COUNT; col++) {
		for (var row = 0; row < ROW_COUNT; row++) {
			jellyfish[col][row].stop();
		}
	}
	$('body').style.background = 'rgb(0, 0, 0)';
	end = true;
	return false;
}

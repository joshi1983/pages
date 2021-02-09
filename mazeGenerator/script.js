document.addEventListener('DOMContentLoaded', function() {
	var canvas = document.querySelector('canvas');
	var maze = Maze.createEmpty(20, 15);
	var width = document.getElementById('width');
	var height = document.getElementById('height');
	var header = document.querySelector('header');
	var showSolutionCheckbox = document.getElementById('show-solution');
	var generateButton = document.getElementById('generate');
	var generators = [
		new RecursiveDepthFirstGenerator(),
		new IterativeDepthFirstGenerator()
	];
	var algorithmSelect = document.getElementById('generator-index');
	var generator;

	function redraw() {
		maze.draw(showSolutionCheckbox.checked);
	}

	function algorithmSelected() {
		generator = generators[algorithmSelect.value];
	}

	function populateAlgorithmSelector() {
		generators.forEach(function(generator, index) {
			var option = document.createElement('option');
			option.setAttribute('value', index);
			option.innerText = generator.name;
			algorithmSelect.appendChild(option);
		});
		algorithmSelected();
	}

	function generate() {
		var w = parseInt(width.value.trim());
		var h = parseInt(height.value.trim());
		if (!isNaN(w) && !isNaN(h)) {
			maze.setSize(w, h);
			generator.generate(maze);
			redraw();
		}
	}

	function resized() {
		var w = window.innerWidth;
		var h = window.innerHeight - header.clientHeight;
		canvas.setAttribute('width', w);
		canvas.setAttribute('height', h);
		redraw();
	}

	populateAlgorithmSelector();
	window.addEventListener('resize', resized);
	width.addEventListener('input', generate);
	height.addEventListener('input', generate);
	generateButton.addEventListener('click', generate);
	algorithmSelect.addEventListener('change', algorithmSelected);
	showSolutionCheckbox.addEventListener('change', redraw);
	generate();
	resized();
});
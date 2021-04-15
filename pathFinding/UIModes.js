function initUIModes(canvas, settings, render) {
	const modes = [
		new LineSegmentMode(settings),
		new CircleMode(settings),
		new StartPointMode(settings),
		new EndPointMode(settings)
	];
	settings.mode = modes[0];

	function createSetModeCallback(newMode) {
		return function() {
			var btn = document.getElementById(settings.mode.id);
			btn.classList.remove('active');
			settings.mode = newMode;
			btn = document.getElementById(settings.mode.id);
			btn.classList.add('active');
		};
	}
	function canvasClicked(event) {
		if (typeof settings.mode.click === 'function') {
			settings.mode.click(event);
			render();
		}
	}
	function canvasMoved(event) {
		if (typeof settings.mode.moved === 'function') {
			if (settings.mode.moved(event))
				render();
		}
	}

	canvas.addEventListener('click', canvasClicked);
	canvas.addEventListener('mousemove', canvasMoved);
	canvas.addEventListener('touchmove', canvasMoved);
	modes.forEach(function(mode) {
		const button = document.getElementById(mode.id);
		button.addEventListener('click', createSetModeCallback(mode));
	});
}
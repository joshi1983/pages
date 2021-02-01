function initUI(renderer) {
	var resetPointsButton = document.getElementById('reset-points');
	resetPointsButton.addEventListener('click', function() {
		renderer.removeAllPoints();
	});
	var canvas = document.querySelector('canvas');
	// when clicking a point, add it.
	canvas.addEventListener('mousedown', function(event) {
		var rect = canvas.getBoundingClientRect();
		var x = event.clientX - rect.left;
		var y = event.clientY - rect.top;
		renderer.addPoint([x, y]);
	});
	canvas.addEventListener('touchstart', function(event) {
		if (event.touches !== undefined && event.touches[0] !== undefined) {
			var touch = event.touches[0];
			var rect = canvas.getBoundingClientRect();
			var x = touch.clientX - rect.left;
			var y = touch.clientY - rect.top;
			renderer.addPoint([x, y]);
		}
	});
}
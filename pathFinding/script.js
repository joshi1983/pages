"use strict";
document.addEventListener('DOMContentLoaded', function() {
	const settings = {
		'obstacles': [
			new LineSegment(new Point(0, 0), new Point(350, 120))
		],
		'startPoint': new Point(10, 10),
		'endPoint': new Point(100, 100),
		'mode': undefined
	};
	const canvas = document.querySelector('canvas');
	const g = canvas.getContext('2d');
	const clearButton = document.getElementById('clear');
	const showVertices = document.getElementById('show-keypoints');
	const footer = document.querySelector('footer');
	function render() {
		var r = canvas.getBoundingClientRect();
		var w = Math.floor(r.width);
		var h = Math.floor(r.height);
		var isShowingKeyPoints = showVertices.checked;
		canvas.setAttribute('width', w);
		canvas.setAttribute('height', h);
		g.clearRect(0, 0, w, h);
		g.strokeStyle = '#000';
		settings.obstacles.forEach(function(o) {
			o.draw(g);
			if (isShowingKeyPoints) {
				o.getKeyPoints().forEach(function(p) {
					p.draw(g);
				});
			}
		});
		settings.startPoint.draw(g, '#900');
		settings.endPoint.draw(g, '#080');
		if (typeof settings.mode.draw === 'function')
			settings.mode.draw(g);
	}
	function clearObstacles() {
		settings.obstacles.length = 0;
		render();
	}

	initUIModes(canvas, settings, render);
	clearButton.addEventListener('click', clearObstacles);
	showVertices.addEventListener('change', render);
	window.addEventListener('resize', render);
	var resizeObserver = new ResizeObserver(render);
	resizeObserver.observe(canvas);
});
class StatsMode {
	constructor(renderer) {
		this.renderer = renderer;
		this.statistics = document.getElementById('statistics');
		this.canvas = document.querySelector('#stats canvas');
		this.g = this.canvas.getContext('2d');
		this.display = document.getElementById('display');
		var displayModeToggler = document.getElementById('display-mode-toggler');
		var outer = this;
		displayModeToggler.addEventListener('click', function() {
			outer.display.classList.toggle('stats');
			if (outer.display.classList.contains('stats')) {
				setTimeout(function() {
					outer.updateStatistics();
				}, 0);
			}
			else {
				outer.canvas.removeAttribute('width');
				outer.canvas.removeAttribute('height');
			}
		});
		this.renderer.addEventListener('trianglesChanged', function() {
			outer.cachedRanges = undefined;
			outer.updateStatistics();
		});
		this.canvasAxis = {'x': 0, 'y': 1};
		this._initAxisControl();
		var zoom = document.getElementById('scale-factor');
		function updateZoomFactor() {
			outer.zoomFactor = 100 * zoom.value;
		}
		updateZoomFactor();
		zoom.addEventListener('input', function() {
			updateZoomFactor();
			outer._quickDraw();
		});
		zoom.addEventListener('change', function() {
			outer.draw();
		});
		this._initSignButtons();
		this._initCursorCoordinates();
	}

	_initCursorCoordinates() {
		var span = document.getElementById('cursor-coordinates');
		var outer = this;
		function updateCursorCoordinates(event) {
			var drawInfo = outer._getDrawInfo();
			var x = event.clientX, y = event.clientY;
			if (event.targetTouches !== undefined && event.targetTouches.length > 0) {
				x = event.targetTouches[0].clientX;
				y = event.targetTouches[0].clientY;
			}
			var targetRect = event.target.getBoundingClientRect();
			x -= targetRect.left;
			y -= targetRect.top;
			x = (drawInfo.middleX + (x - drawInfo.w/2) / drawInfo.scale) * outer.xSign;
			y = (drawInfo.middleY + (y - drawInfo.h/2) / drawInfo.scale) * outer.ySign;
			var xName = 'xyz'.charAt(outer.canvasAxis.x);
			var yName = 'xyz'.charAt(outer.canvasAxis.y);
			var msg = xName + ' = ' + x + ', ' + yName + ' = ' + y;
			span.innerText = msg;
		}
		this.canvas.addEventListener('mousemove', updateCursorCoordinates);
		this.canvas.addEventListener('touchmove', updateCursorCoordinates);
	}

	_initSignButtons() {
		this.xSign = 1;
		this.ySign = 1;
		var xSignButton = document.getElementById('flip-horizontal');
		var ySignButton = document.getElementById('flip-vertical');
		var outer = this;
		function redraw() {
			outer._needsDraw = true;
			outer.cachedRanges = undefined;
			outer.draw();
		}
		xSignButton.addEventListener('click', function() {
			outer.xSign *= -1;
			redraw();
		});
		ySignButton.addEventListener('click', function() {
			outer.ySign *= -1;
			redraw();
		});
	}

	_initAxisControl() {
		var axisSelect = document.getElementById('display-axis');
		['xy', 'xz', 'yx', 'yz', 'zx', 'zy'].forEach(function(key) {
			var option = document.createElement('option');
			option.setAttribute('value', key);
			option.innerText = (key.charAt(0) + '-' + key.charAt(1)).toUpperCase();
			axisSelect.appendChild(option);
		});
		var outer = this;
		axisSelect.addEventListener('input', function() {
			function letterToNumber(letter) {
				return 'xyz'.indexOf(letter);
			}
			var selectedValue = axisSelect.value;
			outer.canvasAxis = {
				'x': letterToNumber(selectedValue.charAt(0)),
				'y': letterToNumber(selectedValue.charAt(1))
			};
			outer.cachedRanges = undefined;
			outer._needsDraw = true;
			outer.draw();
		});
	}

	_getData() {
		var ranges = [];
		for (var i = 0; i < 3; i++)
			ranges.push([Number.MAX_VALUE, -Number.MAX_VALUE]);
		this.renderer.originalTriangles.forEach(function(triangle) {
			for (var axisIndex = 0; axisIndex < 3; axisIndex++) {
				triangle.vertices.forEach(function(v) {
					ranges[axisIndex][0] = Math.min(ranges[axisIndex][0], v.position[axisIndex]);
					ranges[axisIndex][1] = Math.max(ranges[axisIndex][1], v.position[axisIndex]);
				});
			}
		});
		return {
			'Total_Triangles': this.renderer.originalTriangles.length,
			'Total_Vertices': this.renderer.originalTriangles.length * 3,
			'Max_X': ranges[0][1],
			'Max_Y': ranges[1][1],
			'Max_Z': ranges[2][1],
			'Min_X': ranges[0][0],
			'Min_Y': ranges[1][0],
			'MIN_Z': ranges[2][0]
		};
	}

	updateStatistics() {
		this.statistics.innerHTML = '';
		var data = this._getData();
		for (var key in data) {
			var div = document.createElement('div');
			var label = document.createElement('label');
			label.innerText = key.replaceAll(/_/g, ' ');
			var span = document.createElement('span');
			span.innerText = data[key];
			div.appendChild(label);
			div.appendChild(span);
			this.statistics.appendChild(div);
		}
		this._needsDraw = true;
		this.draw();
	}

	_getDrawInfo() {
		var outer = this;
		if (this.cachedRanges === undefined) {
			this.cachedRanges = {
				'minX': Number.MAX_VALUE,
				'minY': Number.MAX_VALUE,
				'maxX': -Number.MAX_VALUE,
				'maxY': -Number.MAX_VALUE,
			};
			this.renderer.originalTriangles.forEach(function(triangle) {
				triangle.vertices.forEach(function(v) {
					outer.cachedRanges.minX = Math.min(outer.cachedRanges.minX, v.position[outer.canvasAxis.x] * outer.xSign);
					outer.cachedRanges.minY = Math.min(outer.cachedRanges.minY, v.position[outer.canvasAxis.y] * outer.ySign);
					outer.cachedRanges.maxX = Math.max(outer.cachedRanges.maxX, v.position[outer.canvasAxis.x] * outer.xSign);
					outer.cachedRanges.maxY = Math.max(outer.cachedRanges.maxY, v.position[outer.canvasAxis.y] * outer.ySign);
				});
			});
		}
		var bound = this.canvas.getBoundingClientRect();
		var w = Math.floor(bound.width), h = Math.floor(bound.height);
		if (w > 0 && h > 0 && w != this.canvas.getAttribute('width') && h != this.canvas.getAttribute('height')) {
			this.canvas.setAttribute('width', w);
			this.canvas.setAttribute('height', h);
		}
		var canvasAspectRatio = w / h;
		var xRange = outer.cachedRanges.maxX - outer.cachedRanges.minX;
		var yRange = outer.cachedRanges.maxY - outer.cachedRanges.minY;
		var modelAspectRatio = xRange / yRange;
		var scale = this.zoomFactor * Math.min(canvasAspectRatio, modelAspectRatio) * ((w + h)/(xRange + yRange));
		var middleX = (outer.cachedRanges.maxX + outer.cachedRanges.minX) * 0.5;
		var middleY = (outer.cachedRanges.maxY + outer.cachedRanges.minY) * 0.5;
		return {
			'w': w, 'h': h,
			'maxX': outer.cachedRanges.maxX, 'minX': outer.cachedRanges.minX, 
			'maxY': outer.cachedRanges.maxY, 'minY': outer.cachedRanges.minY,
			'middleX': middleX,
			'middleY': middleY,
			'scale': scale
		};
	}

	_quickDraw() {
		if (this.renderer.originalTriangles.length < 500) {
			this._needsDraw = true;
			this.draw();
		}
		else {
			this._needsDraw = true;
			var drawInfo = this._getDrawInfo();
			this.g.clearRect(0, 0, drawInfo.w, drawInfo.h);
			this.g.fillStyle = '#fff';
			var width = drawInfo.scale * (drawInfo.maxX - drawInfo.minX);
			var height = drawInfo.scale * (drawInfo.maxY - drawInfo.minY);
			var left = drawInfo.w/2 - width / 2;
			var top = drawInfo.h/2 - height / 2;
			this.g.beginPath();
			this.g.rect(left, top, width, height);
			this.g.closePath();
			this.g.fill();
		}
	}

	draw() {
		if (!this._needsDraw || !this.display.classList.contains('stats')) {
			return;
		}
		this._needsDraw = false;
		var drawInfo = this._getDrawInfo();
		var outer = this;
		function positionToXY(position) {
			return {
				'x': drawInfo.scale * (position[outer.canvasAxis.x] * outer.xSign - drawInfo.middleX) + drawInfo.w/2,
				'y': drawInfo.scale * (position[outer.canvasAxis.y] * outer.ySign - drawInfo.middleY) + drawInfo.h/2
			};
		}
		var alpha = Math.max(0.1, Math.min(0.9, 500 / this.renderer.originalTriangles.length));
		this.g.clearRect(0, 0, drawInfo.w, drawInfo.h);
		this.g.strokeStyle = 'rgba(255, 255, 255, ' + alpha + ')';
		this.renderer.originalTriangles.forEach(function(triangle) {
			outer.g.beginPath();
			triangle.vertices.forEach(function(v, index) {
				var p = positionToXY(v.position);
				if (index === 0)
					outer.g.moveTo(p.x, p.y);
				else
					outer.g.lineTo(p.x, p.y);
			});
			outer.g.closePath();
			outer.g.stroke();
		});
	}
}

export { StatsMode };
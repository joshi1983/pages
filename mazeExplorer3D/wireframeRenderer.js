class WireframeRenderer {
	constructor(solidRenderer) {
		this.solidRenderer = solidRenderer;
		this.canvas = document.querySelector('canvas');
		this.wireCanvas = document.createElement('canvas');
		this.wireCanvas.setAttribute('class', 'wire');
		this.isActive = false;
	}

	_get2DigitHex(value) {
		value = Math.max(0, Math.min(255, Math.round(value)));
		value = value.toString(16);
		if (value.length === 1)
			value = '0' + value;
		return value;
	}

	/*
	v is an Array of 3 numbers.
	*/
	_transform(v) {
		if (!(v instanceof Array) || v.length !== 3)
			throw new Error('_transform requires an Array of length 3.');
		v = v.slice(0); // create a clone so the original isn't modified.
		for (var i = 0; i < 3; i++) {
			v[i] -= this.solidRenderer.viewpoint[i];
		}
		
		var result = math.multiply(v, this.transformMatrix);
		return result;
	}

	/*
	v1 and v2 should be Arrays of numbers.
	v1[0] should be negative.
	*/
	_findMinPositionWithPositiveZ(v1, v2) {
		if (v1[2] > 0.001)
			throw new Error('_findMinPositionWithPositiveZ expects v1[2] to be negative.  Not: ' + v1[2]);
		var delta = [v2[0] - v1[0], v2[1] - v1[1], v2[2] - v1[2]];
		var scale = - (v1[2] - 0.001) / delta[2];
		for (var i = 0; i < 3; i++) {
			delta[i] *= scale;
		}
		return [v1[0] + delta[0], v1[1] + delta[1], v1[2] + delta[2]];
	}

	_drawLineSegment(g, v1, v2) {
		var v1p = this._transform(v1.position);
		var v2p = this._transform(v2.position);
		if (v1p[2] < 0 && v2p[2] < 0)
			return; // nothing to draw.
		
		// Make sure both points are in the front-direction.
		if (v1p[2] < 0) {
			v1p = this._findMinPositionWithPositiveZ(v1p, v2p);
		}
		else if (v2p[2] < 0) {
			v2p = this._findMinPositionWithPositiveZ(v2p, v1p);
		}

		// get a colour from v1 and v2.
		var c = mixVectors(v1.colour, v2.colour, 0.5);
		var cHTML = '#';
		for (var i = 0; i < 3; i++) {
			cHTML += this._get2DigitHex(c[i] * 255);
		}
		g.strokeStyle = cHTML;
		g.beginPath();
		// draw the line.
		var p = this._2DTransform(v1p);
		//console.log(p);
		g.moveTo(p[0], p[1]);
		p = this._2DTransform(v2p);
		//console.log(p);
		g.lineTo(p[0], p[1]);
		
		g.stroke();
	}

	_2DTransform(p3d) {
		if (isNaN(p3d[0]))
			throw new Error('p3d[0] = ' + p3d[0]);
		if (isNaN(p3d[1]))
			throw new Error('p3d[1] = ' + p3d[1]);
		return [p3d[0] * this.scale[0] / p3d[2] + this.centre[0], -p3d[1] * this.scale[0] / p3d[2] + this.centre[1]];
	}

	activate() {
		var body = document.querySelector('body');
		body.appendChild(this.wireCanvas);
		this.isActive = true;
		var outer = this;

		function updateDrawing() {
			if (!outer.isActive)
				return;
			outer.draw();
			requestAnimationFrame(updateDrawing);
		}
		
		updateDrawing();
	}

	deactivate() {
		var body = document.querySelector('body');
		body.removeChild(this.wireCanvas);
		this.isActive = false;
	}

	draw() {
		var w = this.canvas.getAttribute('width');
		var h = this.canvas.getAttribute('height');
		this.wireCanvas.setAttribute('width', w);
		this.wireCanvas.setAttribute('height', h);
		var g = this.wireCanvas.getContext('2d');
		var outer = this;
		this.centre = [w / 2, h / 2];
		this.scale = this.solidRenderer.getScale();
		for (var i = 0; i < 2; i++) {
			this.scale[i] *= (w + h) * 0.0005;
		}
		this.transformMatrix = getRotationMatrix(this.solidRenderer.rotation, false);
		
		// loop through triangles.
		this.solidRenderer.triangles.forEach(function(triangle) {
			// draw the 3 edges.
			outer._drawLineSegment(g, triangle.vertices[0], triangle.vertices[1]);
			outer._drawLineSegment(g, triangle.vertices[1], triangle.vertices[2]);
			outer._drawLineSegment(g, triangle.vertices[2], triangle.vertices[0]);
		});
	}
}
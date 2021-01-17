class Viewport {
	constructor(gl, program, canvas) {
		this.gl = gl;
		this.canvas = canvas;
		this.uniforms = {
			'centre': gl.getUniformLocation(program, 'centre'),
			'scale': gl.getUniformLocation(program, 'scale')
		};
		var outer = this;
		window.addEventListener('resize', function() {
			outer._resized();
		});
		this._resized();
		this._initScaleUI();
		this._refreshScaleFactor();
	}

	_initScaleUI() {
		var settings = document.querySelector('#settings section');
		var div = document.createElement('div');
		div.setAttribute('class', 'labelled-range');
		div.innerHTML = `<label for="scale-factor">Scale</label>
			<input type="range" id="scale-factor" min="-10.0" max="-0.01" step="0.00001" value="-0.5">`;
		settings.appendChild(div);
		var scaleInput = document.getElementById('scale-factor');
		var outer = this;
		scaleInput.addEventListener('input', function() {
			outer._refreshScaleFactor();
		});
	}
	
	_refreshScaleFactor() {
		var scaleInput = document.getElementById('scale-factor');
		var newValue = parseFloat(scaleInput.value);
		if (!isNaN(newValue)) {
			this.scaleFactor = newValue;
			this._resized();
		}
	}

	_getScaleFromDimensions() {
		var w = this.canvas.clientWidth;
		var h = this.canvas.clientHeight;
		return this.scaleFactor /(w + h);
	}

	_resized() {
		var w = this.canvas.clientWidth;
		var h = this.canvas.clientHeight;
		this.canvas.setAttribute('width', w);
		this.canvas.setAttribute('height', h);		
		var centre = [w * 0.5, h * 0.5];
		var scale = this._getScaleFromDimensions();
		this.gl.uniform2fv(this.uniforms.centre, centre);
		this.gl.uniform1f(this.uniforms.scale, scale);
		this.draw();
	}

	draw() {
		var w = this.canvas.clientWidth;
		var h = this.canvas.clientHeight;
		this.gl.viewport(0, 0, w, h);
		this.gl.clearColor(0, 0, 0, 0);
		this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
	}

}
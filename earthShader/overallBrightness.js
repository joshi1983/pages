class OverallBrightness {
	constructor(gl, program, viewport) {
		this.gl = gl;
		this.viewport = viewport;
		this.uniforms = {
			'overallBrightnessCoefficient': gl.getUniformLocation(program, 'overallBrightnessCoefficient')
		};
		this._initUI();
	}

	_initUI() {
		var settings = document.querySelector('#settings section');
		var div = document.createElement('div');
		div.setAttribute('class', 'labelled-range');
		div.innerHTML = `
			<label for="overall-brightness-coefficient">Brightness</label>
			<input id="overall-brightness-coefficient" type="range" min="0.01" max="4.0" step="0.0001" value="1.5">
		`;
		settings.appendChild(div);
		this.input = document.getElementById("overall-brightness-coefficient");
		var outer = this;
		this.input.addEventListener('input', function() {
			outer._brightnessUpdated();
		});
		this._brightnessUpdated();
	}

	_brightnessUpdated() {
		var val = parseFloat(this.input.value);
		if (!isNaN(val)) {
			this.gl.uniform1f(this.uniforms.overallBrightnessCoefficient, val);
			this.viewport.draw();
		}
	}
}
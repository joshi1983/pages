
class SampleOpacity {
	constructor(gl, pid, peakOpacity, realtimeRenderer) {
		this.locationOfPeakSampleOpacity = gl.getUniformLocation(pid, 'peakSampleOpacity');
		this.lightObstructionRatio = 0.3;
		this.mainGL = gl;
		this.peakOpacity = peakOpacity;
		this.realtimeRenderer = realtimeRenderer;
		this.locationOfOpacityCutOff = gl.getUniformLocation(pid, "opacityCutOff");
		this.setValueFromLightObstructionRatio(0.3);
	}

	_updated() {
		var newOpacity = this.peakOpacity.getPeakOpacityForLightObstructionDeltaRatio(this.lightObstructionRatio);
		this.mainGL.uniform1f(this.locationOfPeakSampleOpacity, newOpacity);
		this.mainGL.uniform1f(this.locationOfOpacityCutOff, this.peakOpacity.getOpacityCutOffFromPeakSampleOpacity(newOpacity));
		this.realtimeRenderer.redraw();
	}

	setValueFromLightObstructionRatio(lightObstructionRatio) {
		this.lightObstructionRatio = lightObstructionRatio;
		this._updated();
	}
}

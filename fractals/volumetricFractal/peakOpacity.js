class PeakOpacity {
	constructor() {
		this.inputElement = document.getElementById('peak-opacity');
	}
	
	setLightObstructionDeltaRatio(lightObstructionDeltaRatio) {
		this.lightObstructionDeltaRatio = lightObstructionDeltaRatio;
		this.inputElement.addEventListener('input', function() {
			lightObstructionDeltaRatio.peakOpacityInputChanged();
		});
	}

	set(newValue, forceChange) {
		var val = this.get();
		if (forceChange || val !== newValue) {
			this.inputElement.value = newValue;
			if (this.lightObstructionDeltaRatio !== undefined)
				this.lightObstructionDeltaRatio.peakOpacityInputChanged();
		}
	}
	
	get() {
		return sanitizeFloat(this.inputElement.value, 2.0);
	}
	
	getPeakOpacityForLightObstructionDeltaRatio(lightObstructionDeltaRatio) {
		return lightObstructionDeltaRatio * this.get();
	}

	getOpacityCutOffFromPeakSampleOpacity(newOpacity) {
		return 0.05 * newOpacity;
	}
}
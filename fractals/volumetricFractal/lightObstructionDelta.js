	class LightObstructionDelta {
		constructor(gl, pid, sampleOpacity) {
			this.LOWEST_QUALITY = 0.3;
			this.LOWEST_1_PIXELSTRETCH_QUALITY = 0.2;
			this.DEFAULT_QUALITY = 0.1;
			this.DOWNLOAD_QUALITY = 0.01;
			this.ratio = this.DEFAULT_QUALITY;
			this.gl = gl;
			this.sampleOpacity = sampleOpacity;
			this.uniformLocation = gl.getUniformLocation(pid, "lightObstructionDeltaRatio");
			this._ratioUpdated();
		}
		
		peakOpacityInputChanged() {
			this._ratioUpdated();
		}
		
		_ratioUpdated() {
			if (typeof this.ratio !== 'number' || isNaN(this.ratio) || this.ratio < this.DOWNLOAD_QUALITY) {
				throw new Error('Invalid ratio: ' + this.ratio);
			}
			this.sampleOpacity.setValueFromLightObstructionRatio(this.ratio);
			this.gl.uniform1f(this.uniformLocation, this.ratio);
		}
		
		decreaseQuality() {
			if (this.ratio < this.DEFAULT_QUALITY) {
				this.ratio = this.DEFAULT_QUALITY;
			}
			else if (this.ratio < this.LOWEST_1_PIXELSTRETCH_QUALITY) {
				this.ratio = this.LOWEST_1_PIXELSTRETCH_QUALITY;
			}
			else {
				this.ratio = this.LOWEST_QUALITY;
			}
			this._ratioUpdated();
		}
		
		increaseQuality() {
			if (this.ratio > this.DEFAULT_QUALITY)
				this.ratio = this.DEFAULT_QUALITY;
			else
				this.ratio = Math.max(this.DOWNLOAD_QUALITY, this.ratio * 0.9);
			this._ratioUpdated();
		}

		isLowestQuality() {
			return this.ratio >= this.LOWEST_QUALITY - 0.0001;
		}
		
		isLowest1PixelStretchQuality() {
			return this.ratio >= this.LOWEST_1_PIXELSTRETCH_QUALITY - 0.0001;
		}
		
		setToDefaultQuality() {
			this.ratio = this.DEFAULT_QUALITY;
			this._ratioUpdated();
		}

		setToLowestQuality() {
			this.ratio = this.LOWEST_QUALITY;
			this._ratioUpdated();
		}
		
		setToDownloadQuality() {
			this.ratio = this.DOWNLOAD_QUALITY;
			this._ratioUpdated();
		}
	}

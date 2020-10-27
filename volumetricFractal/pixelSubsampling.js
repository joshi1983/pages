
class PixelSubsampling {
	constructor(gl, pid) {
		this.DEFAULT_QUALITY = 1;
		this.DOWNLOAD_QUALITY = 2;
		this.MAX_QUALITY = 5;
		this.value = this.DEFAULT_QUALITY;
		this.mainGL = gl;
		this.locationOfPixelSubsampling = gl.getUniformLocation(pid, "pixelSubsampling");
		this._valueUpdated();
	}
	
	_valueUpdated() {
		this.mainGL.uniform1i(this.locationOfPixelSubsampling, this.value);
	}
	
	useLowestQuality() {
		this.value = this.DEFAULT_QUALITY;
		this._valueUpdated();
	}
	
	decreaseQuality() {
		this.value = Math.max(this.DEFAULT_QUALITY, this.value - 1);
		this._valueUpdated();
	}
	
	increaseQuality() {
		this.value = Math.min(this.MAX_QUALITY, this.value + 1);
		this._valueUpdated();
	}
}
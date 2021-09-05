
export class Rect {
	constructor(offsetXRatio, offsetYRatio, sampleWidth, sampleHeight, widthRatio, heightRatio) {
		this.offsetXRatio = offsetXRatio;
		this.offsetYRatio = offsetYRatio;
		this.widthRatio = widthRatio;
		this.heightRatio = heightRatio;
		this.imageData = new ImageData(sampleWidth, sampleHeight);
		this.pixels = this.imageData.data;
		this.sampleWidth = sampleWidth;
		this.sampleHeight = sampleHeight;
	}

	/* dispose() helps the JavaScript garbage collector clean memory associated with this Rect.
	Do not call unless you're done using this Rect since the data structure changes 
	will violate assumptions and likely cause JavaScript errors.
	*/
	dispose() {
		this.imageData = undefined;
		this.pixels = undefined;
		this.imagePromise = undefined;
		this.image = undefined;
	}

	equalsBasic(offsetXRatio, offsetYRatio, sampleWidth, sampleHeight, widthRatio, heightRatio) {
		return this.offsetXRatio === offsetXRatio &&
			this.offsetYRatio === offsetYRatio &&
			this.widthRatio === widthRatio &&
			this.heightRatio === heightRatio &&
			this.sampleWidth === sampleWidth &&
			this.sampleHeight === sampleHeight;
	}

	getImage() {
		if (this.imagePromise === undefined) {
			this.imagePromise = createImageBitmap(this.imageData, 0, 0, this.sampleWidth, this.sampleHeight);
			this.imagePromise.then(i => this.image = i);
		}
		return this.imagePromise;
	}

/*
The caller must ensure that x, y are in a valid range.
setPixel is the same as setPixelChecked except faster without the validation checks.
*/
	setPixel(x, y, red, green, blue, alpha) {
		let i = (y * this.sampleWidth + x) << 2;
		this.pixels[i] = red;
		this.pixels[++i] = green;
		this.pixels[++i] = blue;
		this.pixels[++i] = alpha;
	}

	setPixelChecked(x, y, red, green, blue, alpha) {
		if (x < 0 || x >= this.sampleWidth)
			throw new Error(`x must be in 0..${this.sampleWidth - 1} but got ${x}`);
		if (y < 0 || y >= this.sampleHeight)
			throw new Error(`y must be in 0..${this.sampleHeight - 1} but got ${y}`);
		let i = (y * this.sampleWidth + x) << 2;
		this.pixels[i] = red;
		this.pixels[++i] = green;
		this.pixels[++i] = blue;
		this.pixels[++i] = alpha;
	}
};
/*
Represents a rotated rectangle.

Much simpler than a Rect since SimpleRect2D doesn't have
associated ImageData or procedure.
*/
export class SimpleRect2D {
	constructor(x, y, width, height, headingRadians) {
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.headingRadians = headingRadians;
	}

	clone() {
		return new SimpleRect2D(this.x, this.y,
			this.width, this.height, this.headingRadians);
	}
};
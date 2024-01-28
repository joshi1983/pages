export class GradientStopPoint {
	constructor(colour, easing) {
		this.colour = colour;
		this.easing = easing;
	}

	equals(other) {
		if (!(other instanceof GradientStopPoint))
			return false;
		return other.colour.equals(this.colour) &&
			other.easing.equals(this.easing);
	}
};
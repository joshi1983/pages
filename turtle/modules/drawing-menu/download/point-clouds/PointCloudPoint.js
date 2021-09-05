export class PointCloudPoint {
	/*
	vector must be a Vector3D.
	colour must either be a Colour or AlphaColour.
		colour must not be Transparent.
	*/
	constructor(vector, colour) {
		this.vector = vector;
		this.colour = colour;
	}
};
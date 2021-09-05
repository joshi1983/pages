/*
Represents something like an invisible colour.
*/

class PrivateTransparent {
	toString() {
		return "transparent";
	}

	equals(other) {
		if (this === other)
			return true;
		return other.constructor.name === 'AlphaColour' && other.rgbArray[0] === 0;
	}
};

const Transparent = new PrivateTransparent();
export { Transparent };
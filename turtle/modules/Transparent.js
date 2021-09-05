/*
Represents something like an invisible colour.
*/

class PrivateTransparent {
	toString() {
		return "transparent";
	}

	equals(other) {
		return this === other;
	}
};

const Transparent = new PrivateTransparent();
export { Transparent };
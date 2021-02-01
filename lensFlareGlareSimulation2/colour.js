class Colour {
	constructor() {
		this.r = document.getElementById('current-colour-red');
		this.g = document.getElementById('current-colour-green');
		this.b = document.getElementById('current-colour-blue');
	}

	getColour() {
		return [
			parseFloat(this.r.value),
			parseFloat(this.g.value),
			parseFloat(this.b.value)
		];
	}
}
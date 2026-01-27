class PrivateScore {
	constructor() {
		this.reset();
	}

	getNumber() {
		return this.state;
	}

	increment() {
		this.state++;
	}

	render(context2D, width, height) {
		const fontSize = (width + height) * 0.1;
		const s = `bold ${Math.ceil(fontSize)}px Arial`;
		context2D.font = s;
		const text = '' + this.state;
		const m = context2D.measureText(text);
		const x = width - m.width;
		const y = fontSize;
		context2D.fillStyle = 'white';
		context2D.fillText(text, x, y);
	}

	reset() {
		this.state = 0;
	}
};

const Score = new PrivateScore();

export { Score };
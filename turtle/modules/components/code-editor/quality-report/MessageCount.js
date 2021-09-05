export class MessageCount {
	constructor(element) {
		if (!(element instanceof Element))
			throw new Error(`element must be an Element but got ${element}`);
		this.element = element;
		this.setCount(0);
	}

	dispose() {
		this.element = undefined;
	}

	increment() {
		this.setCount(this.count + 1);
	}

	setCount(newCount) {
		if (newCount !== this.count) {
			this.count = newCount;
			this.element.innerText = `Got ${newCount} message${newCount === 1 ? '' : 's'}`;
		}
	}
};
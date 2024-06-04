export class ClickableName {
	constructor(name, click, typedIndex) {
		if (typeof name !== 'string')
			throw new Error(`name must be a string. not: ${name}`);
		if (typeof click !== 'function')
			throw new Error(`click must be a function. not: ${click}`);
		if (!Number.isInteger(typedIndex))
			throw new Error(`typedIndex must be an integer.  not: ${typedIndex}`);
		this.name = name;
		this.click = click;
		this.typedIndex = typedIndex;
	}

	// to help the JavaScript garbage collector clean up unneeded information
	dispose() {
		if (this.div !== undefined) {
			this.div.removeEventListener('click', this.click);
			this.div = undefined;
		}
		this.click = undefined;
		this.name = undefined;
		this.typedIndex = undefined;
	}

	getDiv() {
		if (this.div === undefined) {
			this.div = document.createElement('div');
			this.div.addEventListener('click', this.click);
			this.refreshNameInDiv();
		}
		return this.div;
	}

	refreshNameInDiv() {
		this.div.innerText = '';
		if (this.typedIndex > 0) {
			const typedSpan = document.createElement('span');
			typedSpan.classList.add('typed');
			typedSpan.innerText = this.name.substring(0, this.typedIndex);
			this.div.appendChild(typedSpan);
		}
		const untypedSpan = document.createElement('span');
		untypedSpan.classList.add('untyped');
		untypedSpan.innerText = this.name.substring(this.typedIndex);
		this.div.appendChild(untypedSpan);
	}

	setTypedIndex(index) {
		this.typedIndex = index;
		if (this.div !== undefined) {
			this.refreshNameInDiv();
		}
	}
};
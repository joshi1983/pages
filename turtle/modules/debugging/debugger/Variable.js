import { valueToString } from '../../valueToString.js';

export class Variable {
	constructor(name, getValue) {
		if (typeof name !== 'string')
			throw new Error('name must be a string');
		if (typeof getValue !== 'function')
			throw new Error('getValue must be a function');

		this.name = name;
		this.getValue = getValue;
	}

	getDiv() {
		if (this.div === undefined) {
			const div = document.createElement('div');
			div.classList.add('variable');
			const nameE = document.createElement('div');
			nameE.classList.add('name');
			nameE.innerText = this.name;
			div.appendChild(nameE);
			this.valueE = document.createElement('div');
			this.valueE.classList.add('value');
			div.appendChild(this.valueE);
			this.div = div;
		}
		this.refreshDiv();
		return this.div;
	}

	refreshDiv() {
		if (this.div !== undefined)
			this.valueE.innerText = valueToString(this.getValue());
	}
};
import { formatNumber } from '../../../debugging/formatNumber.js';

export class NamedNumber {
	constructor(key, value) {
		this.key = key;
		this.value = value;
		this.isExpanded = false;
	}

	setExpanded(isExpanded) {
		if (this.valueElement !== undefined) {
			if (isExpanded)
				this.valueElement.innerText = formatNumber(this.value);
			else
				this.valueElement.innerText = formatNumber(this.value);
		}
		this.isExpanded = isExpanded;
	}

	toDiv() {
		if (this.div === undefined) {
			this.div = document.createElement('div');
			this.div.classList.add('named-number');
			const nameElement = document.createElement('div');
			nameElement.classList.add('name');
			nameElement.innerText = this.key;
			const valueElement = document.createElement('div');
			valueElement.classList.add('number');
			valueElement.innerText = formatNumber(this.value);
			this.div.appendChild(nameElement);
			this.div.appendChild(valueElement);
			this.valueElement = valueElement;
			this.nameElement = nameElement;
			this.setExpanded(this.isExpanded);
		}
		return this.div;
	}
};
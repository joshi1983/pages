export class RepcountStackItem {
	constructor(repcountObject) {
		if (typeof repcountObject !== 'object')
			throw new Error('repcountObject must be an object');
		if (typeof repcountObject.current !== 'number')
			throw new Error('repcountObject.current must be a number');
		if (typeof repcountObject.max !== 'number')
			throw new Error('repcountObject.max must be a number');

		this.repcountObject = repcountObject;
	}

	static createColumnLabels() {
		const result = document.createElement('div');
		result.classList.add('headings');
		['Max', 'Current'].forEach(function(title) {
			const e = document.createElement('div');
			e.innerText = title;
			result.appendChild(e);
		});
		return result;
	}

	getDiv() {
		if (this.div === undefined) {
			const div = document.createElement('div');
			const maxE = document.createElement('div');
			maxE.innerText = this.repcountObject.max;
			this.currentE = document.createElement('div');
			div.appendChild(maxE);
			div.appendChild(this.currentE);
			this.div = div;
		}
		this.refresh();
		return this.div;
	}

	refresh() {
		this.currentE.innerText = this.repcountObject.current;
	}
};
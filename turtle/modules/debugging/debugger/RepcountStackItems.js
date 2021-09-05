import { RepcountStackItem } from './RepcountStackItem.js';

export class RepcountStackItems {
	constructor(stack) {
		this.items = new Map();
		this.setStack(stack);
	}

	getDivs() {
		const outer = this;
		return this.stack.map(function(repcountObject) {
			if (!outer.items.has(repcountObject))
				outer.items.set(repcountObject, new RepcountStackItem(repcountObject));
			return outer.items.get(repcountObject).getDiv();
		});
	}

	refreshContainer(container) {
		if (!(container instanceof Element))
			throw new Error('container must be an Element');

		const divs = this.getDivs();
		if (divs.length === 0)
			container.innerHTML = 'No repeats executing';
		else {
			container.innerHTML = '';
			container.appendChild(RepcountStackItem.createColumnLabels());
			divs.forEach(function(div) {
				container.appendChild(div);
			});
		}
	}

	setStack(stack) {
		if (!(stack instanceof Array))
			throw new Error('stack must be an Array');

		this.items.clear();
		this.stack = stack;
	}
};
import { EventDispatcher } from '../EventDispatcher.js';

function getInitialIndex(optionsInfo) {
	let result = -1;
	optionsInfo.forEach(function(optionInfo, index) {
		if (optionInfo.selected === true)
			result = index;
	});
	if (result === -1)
		result = 0;
	return result;
}

export class OptionList extends EventDispatcher {
	constructor(id, optionsInfo) {
		if (typeof id !== 'string')
			throw new Error(`id must be a string but got ${id}`);
		if (!(optionsInfo instanceof Array))
			throw new Error(`optionsInfo must be an Array but got ${optionsInfo}`);
		super(['selection-changed']);
		const e = document.getElementById(id);
		if (e === null)
			throw new Error(`Unable to find element with id ${id}`);
		const selectedIndex = getInitialIndex(optionsInfo);
		e.classList.add('option-list');
		this.e = e;
		this.selectedOption;
		this.itemsInfo = optionsInfo;
		this.items = [];
		const outer = this;
		optionsInfo.forEach(function(optionInfo, index) {
			const item = document.createElement('a');
			item.innerText = optionInfo.text;
			if (optionInfo.value !== undefined)
				item.dataset.val = optionInfo.value;
			if (selectedIndex === index) {
				item.classList.add('selected');
				outer.selectedOption = item;
			}
			item.addEventListener('click', function(event) {
				const option = event.target;
				if (option === outer.selectedOption)
					return; // no change happened.
				const index = outer.items.indexOf(option);
				outer._selectedIndex(index);
			});
			outer.items.push(item);
			e.appendChild(item);
		});
	}

	_selectedIndex(index_) {
		const selectedItem = this.items[index_];
		if (selectedItem === undefined)
			throw new Error(`Unable to select an item at index ${index_}.`);
		if (!selectedItem.classList.contains('selected')) {
			this._unselectAll();
			selectedItem.classList.add('selected');
			this.selectedOption = selectedItem;
			this._dispatchEvent('selection-changed', {
				'element': selectedItem,
				'optionInfo': this.itemsInfo[index_]
			});
		}
	}

	_unselectAll() {
		this.items.forEach(function(item) {
			item.classList.remove('selected');
		});
	}

	dispose() {
		this.items.forEach(function(item) {
			item.remove();
		});
		this.items = undefined;
		this.itemsInfo = undefined;
		this.e.classList.remove('option-list');
		this.e = undefined;
	}

	setSelectedInnerText(innerText) {
		let index_;
		this.items.forEach(function(e, index) {
			if (e.innerText === innerText) {
				index_ = index;
			}
		});
		const selectedItem = this.items[index_];
		if (selectedItem === undefined)
			throw new Error(`Unable to find an option with innerText "${innerText}"`);
		this._selectedIndex(index_);
	}
};
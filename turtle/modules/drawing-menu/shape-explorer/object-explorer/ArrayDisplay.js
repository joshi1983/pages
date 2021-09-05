import { Listener } from './Listener.js';
import { Listeners } from './Listeners.js';
import { valueToDisplay } from './valueToDisplay.js';

export class ArrayDisplay {
	constructor(array, path) {
		if (!(array instanceof Array))
			throw new Error('array must be an Array.  Not: ' + array);
		if (typeof path !== 'string')
			throw new Error('path must be a string.  Not: ' + path);
		this.path = path;
		this.array = array;
		this._listeners = new Listeners();
		this._valueDisplays = [];
	}

	toDiv() {
		if (this.div === undefined) {
			this.div = document.createElement('div');
			this.div.classList.add('array');
			this.expandElement = document.createElement('span');
			this.expandElement.classList.add('expand-button', 'fa', 'fa-plus', 'clickable');
			const outer = this;
			const expandListener = new Listener('click', function() {
				outer.toggleExpanded();
			}, this.expandElement);
			this._listeners.add(expandListener);
			this.div.appendChild(this.expandElement);
			for (let i = 0; i < this.array.length; i++) {
				const e = document.createElement('div');
				const label = document.createElement('label');
				label.innerText = '' + i;
				e.appendChild(label);
				const valueDisplay = valueToDisplay(this.array[i], this.path + `[${i}]`);
				this._valueDisplays.push(valueDisplay);
				e.appendChild(valueDisplay.toDiv());
				this.div.appendChild(e);
				const listener = new Listener('click', function() {
					if (typeof valueDisplay.toggleExpanded === 'function')
						valueDisplay.toggleExpanded();
				}, label);
				this._listeners.add(listener);
			}
		}
		return this.div;
	}

	toggleExpanded() {
		if (this.div !== undefined)
			this.div.classList.toggle('expanded');
	}

	unbind() {
		if (this.div !== undefined) {
			this._listeners.unbind(this.div);
			for (let i = 0; i < this._valueDisplays.length; i++) {
				const e = this._valueDisplays[i];
				if (typeof e.unbind === 'function')
					e.unbind();
			}
			this._valueDisplays.length = 0;
			this.div.remove();
			this.div = undefined;
		}
		this._valueDisplays = undefined;
		this._listeners = undefined;
	}
};
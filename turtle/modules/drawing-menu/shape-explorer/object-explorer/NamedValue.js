import { Listener } from './Listener.js';
import { Listeners } from './Listeners.js';
import { valueToDisplay } from './valueToDisplay.js';

export class NamedValue {
	constructor(key, value, path) {
		if (typeof key !== 'string')
			throw new Error('key must be a string.  Not: ' + key);
		if (typeof path !== 'string')
			throw new Error('path must be a string.  Not: ' + path);
		this.path = path;
		this.key = key;
		this.value = value;
		this._listeners = new Listeners();
	}

	toDiv() {
		if (this.div === undefined) {
			this.div = document.createElement('div');
			this.div.classList.add('named-value');
			const notch = document.createElement('span');
			notch.classList.add('notch2');
			this.div.appendChild(notch);
			const nameElement = document.createElement('label');
			nameElement.classList.add('name');
			nameElement.innerText = this.key;
			this.valueDisplay = valueToDisplay(this.value, this.path + '.' + this.key);
			const outer = this;
			if (typeof this.valueDisplay.toggleExpanded === 'function') {
				const clickListener = new Listener('click', function() {
					outer.valueDisplay.toggleExpanded();
				});
				nameElement.classList.add('clickable');
				nameElement.addEventListener(clickListener.key, clickListener.callback);
			}
			this.div.appendChild(nameElement);
			this.valueElement = this.valueDisplay.toDiv();
			this.div.appendChild(this.valueElement);
			this.nameElement = nameElement;
		}
		return this.div;
	}

	unbind() {
		if (this.div !== undefined) {
			if (typeof this.valueDisplay.unbind === 'function')
				this.valueDisplay.unbind();
			this.valueDisplay = undefined;
			this.div.remove();
			this.div = undefined;
			this._listeners.unbind(this.nameElement);
			this._listeners = undefined;
		}
	}
};
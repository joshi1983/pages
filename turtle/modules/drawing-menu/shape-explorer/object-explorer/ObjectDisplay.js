import { Listener } from './Listener.js';
import { Listeners } from './Listeners.js';
import { NamedValue } from './NamedValue.js';

export class ObjectDisplay {
	constructor(object, path) {
		if (typeof object !== 'object')
			throw new Error('object must be an object.  Not: ' + object);
		if (typeof path !== 'string')
			throw new Error('path must be a string.  Not: ' + path);

		this.path = path;
		this.object = object;
		this._namedValues = [];
		this._listeners = new Listeners();
	}

	setExpanded(isExpanded) {
		this.isExpanded = isExpanded;
		if (this.div !== undefined) {
			if (isExpanded)
				this.div.classList.add('expanded');
			else
				this.div.classList.remove('expanded');
		}
	}

	toDiv() {
		if (this.div === undefined) {
			this.div = document.createElement('div');
			this.div.classList.add('object');
			this.expandElement = document.createElement('span');
			this.expandElement.classList.add('expand-button', 'fa', 'fa-plus');
			const outer = this;
			const expandListener = new Listener('click', function() {
				outer.setExpanded(true);
			}, this.expandElement);
			this._listeners.add(expandListener);
			this.div.appendChild(this.expandElement);
			for (const key in this.object) {
				const namedValue = new NamedValue(key, this.object[key], `${this.path}.${key}`);
				this._namedValues.push(namedValue);
				this.div.appendChild(namedValue.toDiv());
			}
		}
		return this.div;
	}

	toggleExpanded() {
		this.setExpanded(!this.isExpanded);
	}

	unbind() {
		if (this.div !== undefined) {
			this._namedValues.forEach(nv => nv.unbind());
			this._namedValues.length = 0;
			this._namedValues = undefined;
			this._listeners.unbind(this.expandElement);
			this._listeners = undefined;
			this.div.remove();
			this.div = undefined;
		}
	}
};
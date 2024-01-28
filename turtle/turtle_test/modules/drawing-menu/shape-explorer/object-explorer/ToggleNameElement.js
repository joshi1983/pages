import { EventDispatcher } from '../../../EventDispatcher.js';
import { Listener } from './Listener.js';
import { Listeners } from './Listeners.js';

export class ToggleNameElement extends EventDispatcher {
	constructor(name) {
		if (typeof name !== 'string')
			throw new Error('name must be a string.  Not: ' + name);
		super(['blur', 'focus']);
		this.name = name;
		this._listeners = new Listeners();
	}

	toDiv() {
		if (this.div === undefined) {
			this.div = document.createElement('div');
			const outer = this;
			const clickListener = new Listener('click', function() {
				outer._toggleExpand();
			});
			this._listeners.add(clickListener);
			const nameSpan = document.createElement('span');
			nameSpan.innerText = this.name;
			this.arrowElement = document.createElement('span');
			this.arrowElement.classList.add('fa', 'fa-angle-down');
			this.div.appendChild(this.arrowElement);
			this.div.appendChild(nameSpan);
		}
		return this.div;
	}

	toggleExpand() {
		this.isExpanded = !this.isExpanded;
		if (this.arrowElement !== undefined) {
			const classList = this.arrowElement.classList;
			if (this.isExpanded) {
				classList.remove('fa-angle-down');
				classList.add('fa-angle-right');
			}
			else {
				classList.add('fa-angle-down');
				classList.remove('fa-angle-right');
			}
		}
		if (this.isExpanded) {
			this._dispatchEvent('focus', {});
		}
		else {
			this._dispatchEvent('blur', {});
		}
	}

	unbind() {
		this._listeners.unbind(this.div);
		super.removeAllEventListeners();
	}
};
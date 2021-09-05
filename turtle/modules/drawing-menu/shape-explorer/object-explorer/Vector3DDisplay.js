import { EventDispatcher } from '../../../EventDispatcher.js';
import { Listener } from './Listener.js';
import { Listeners } from './Listeners.js';
import { NamedNumber } from './NamedNumber.js';
import { Vector3D } from '../../../drawing/vector/Vector3D.js';

export class Vector3DDisplay extends EventDispatcher {
	constructor(v) {
		if (!(v instanceof Vector3D))
			throw new Error('v must be a Vector3D.  Not: ' + v);

		super(['focus']);
		this.v = v;
		this._listeners = new Listeners();
		this.namedNumbers = [];
	}

	_addListener(listener) {
		if (this.div === undefined) {
			this.div = document.createElement('div');
			this.div.classList.add('vector');
		}
		this.div.addEventListener(listener.key, listener.callback);
		this._listeners.add(listener);
	}

	blur() {
		this.namedNumbers.forEach(namedNumber => namedNumber.setExpanded(false));
		if (this.div !== undefined)
			this.div.classList.remove('expanded');
	}

	toDiv() {
		if (this.div === undefined) {
			const outer = this;
			this._addListener(new Listener('click', function() {
				outer.div.classList.toggle('expanded');
				const isExpanded = outer.div.classList.contains('expanded');
				outer.namedNumbers.forEach(function(namedNumber) {
					namedNumber.setExpanded(isExpanded);
				});
				if (isExpanded)
					outer._dispatchEvent('focus', {});
			}));
			for (let i = 0; i < 3; i++) {
				const namedNumber = new NamedNumber('xyz'.charAt(i) + ':', this.v.coords[i]);
				this.div.appendChild(namedNumber.toDiv());
				this.namedNumbers.push(namedNumber);
			}
		}
		return this.div;
	}

	/* Call unbind() when finished using to help JavaScript's garbage 
	collector recognize things as safe to dispose.
	*/
	unbind() {
		if (this.div !== undefined) {
			this._listeners.unbind(this.div);
			this.namedNumbers.length = 0;
		}
		super.removeAllEventListeners();
	}
};
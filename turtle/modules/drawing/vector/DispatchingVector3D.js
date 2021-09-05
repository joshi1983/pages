import { EventDispatcher } from '../../EventDispatcher.js';
import { Vector3D } from './Vector3D.js';

/*
This is a very unique vector that is used by the Camera class.

The dispatching of change events was not added to all vectors in case it 
hurt performance or memory usage for the many vectors used in complex drawings 
which don't need to be observed for changes.
*/
export class DispatchingVector3D extends Vector3D {
	constructor() {
		super();
		this._dispatcher = new EventDispatcher(['change']);
	}

	_dispatchChange() {
		this._dispatcher._dispatchEvent('change');
	}

	addEventListener() {
		this._dispatcher.addEventListener(...arguments);
	}

	assign(other) {
		super.assign(other);
		this._dispatchChange();
	}

	removeEventListener() {
		this._dispatcher.removeEventListener(...arguments);
	}

	setX(x) {
		super.setX(x);
		this._dispatchChange();
	}

	setY(y) {
		super.setY(y);
		this._dispatchChange();
	}

	setZ(z) {
		super.setZ(z);
		this._dispatchChange();
	}
}
import { formatNumber } from '../../../formatNumber.js';
import { Listener } from './Listener.js';
import { Listeners } from './Listeners.js';
import { MathCommands } from '../../../command-groups/MathCommands.js';

/*
Shows an angle and toggles between degrees and radians
*/
export class AngleDisplay {
	constructor(angleValueDegrees) {
		this.angleDegrees = angleValueDegrees;
		this.isDegrees = true;
		this._listeners = new Listeners();
	}

	_updateDiv() {
		if (this.div !== undefined) {
			if (this.isDegrees) {
				this.unitElement.innerHTML = '&deg;';
				this.valueElement.innerText = formatNumber(this.angleDegrees, 1);
			}
			else {
				this.unitElement.innerHTML = '<sup>rad</sup>';
				this.valueElement.innerText = formatNumber(this.angleDegrees * MathCommands.degToRadianScale, 2);
			}
		}
	}

	toDiv() {
		if (this.div === undefined) {
			this.div = document.createElement('div');
			this.div.classList.add('angle-display');
			this.valueElement = document.createElement('span');
			this.valueElement.classList.add('number');
			this.unitElement = document.createElement('span');
			this.div.appendChild(this.valueElement);
			this.div.appendChild(this.unitElement);
			const outer = this;
			const listener = new Listener('click', function() {
				outer.toggleUnit();
			});
			this.div.addEventListener(listener.key, listener.callback);
			this._updateDiv();
		}
		return this.div;
	}

	toggleUnit() {
		this.isDegrees = !this.isDegrees;
		this._updateDiv();
	}

	unbind() {
		if (this.div !== undefined) {
			this._listeners.unbind(this.div);
		}
	}
};
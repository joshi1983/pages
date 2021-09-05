import { EventDispatcher } from '../../EventDispatcher.js';
import { getShapeTypeNameElement } from './getShapeTypeNameElement.js';
import { indexToElement } from './indexToElement.js';
import { isNumber } from '../../isNumber.js';
import { shapeToDetailsDTO } from './serialization/shapeToDetailsDTO.js';
import { valueToDisplay } from './object-explorer/valueToDisplay.js';
import { Vector3DDisplay } from './object-explorer/Vector3DDisplay.js';

function shapeToShapeDetailsDisplay(shape) {
	const dto = shapeToDetailsDTO(shape);
	return valueToDisplay(dto, '');
}

export class ShapeDisplay extends EventDispatcher {
	constructor(shape, index) {
		if (!isNumber(index))
			throw new Error('index must be a number.  Not: ' + index);
		super(['focus']);
		this.shape = shape;
		this.index = index;
	}

	blur() {
		if (this.positionDisplay !== undefined)
			this.positionDisplay.blur();
		this.details.classList.remove('expanded');
	}

	toDiv() {
		if (this.div === undefined) {
			this.positionDisplay = new Vector3DDisplay(this.shape.position);
			const outer = this;
			this.positionDisplay.addEventListener('focus', function() {
				outer._dispatchEvent('focus', {});
				outer.details.classList.add('expanded');
			});
			const result = document.createElement('div');
			result.classList.add('shape');
			result.appendChild(indexToElement(this.index));
			result.appendChild(getShapeTypeNameElement(this.shape));
			result.appendChild(this.positionDisplay.toDiv());
			this.detailsDisplay = shapeToShapeDetailsDisplay(this.shape);
			this.details = document.createElement('div');
			this.details.classList.add('details', 'object-explorer');
			this.details.appendChild(this.detailsDisplay.toDiv());
			result.appendChild(this.details);
			this.div = result;
		}
		return this.div;
	}

	unbind() {
		if (this.positionDisplay !== undefined)
			this.positionDisplay.unbind();
		if (this.detailsDisplay !== undefined && typeof this.detailsDisplay.unbind === 'function')
			this.detailsDisplay.unbind();
		super.removeAllEventListeners();
		this.details.remove();
		this.div.remove();
		this.div = undefined;
		this.details = undefined;
	}
};
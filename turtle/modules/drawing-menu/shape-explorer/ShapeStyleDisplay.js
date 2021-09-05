import { Shape } from '../../drawing/vector/shapes/Shape.js';

export class ShapeDetailsDisplay {
	constructor(shape) {
		if (!(shape instanceof Shape))
			throw new Error('shape must be a Shape.  Not: ' + shape);
		this.shape = shape;
		this.isExpanded = false;
	}

	setExpanded(isExpanded) {
		this.isExpanded = isExpanded;
		if (this.div !== undefined) {
			if (isExpanded) {
				this.div.classList.add('expanded');
			}
			else {
				this.div.classList.remove('expanded');
			}
		}
	}

	toDiv() {
		if (this.div === undefined) {
			this.div = document.createElement('div');
			this.setExpanded(this.isExpanded);
		}
		return this.div;
	}
};
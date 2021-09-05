import { Colour } from '../../../Colour.js';
import { colourToElement } from './colourToElement.js';

export class ColourDisplay {
	constructor(colour) {
		if (!(colour instanceof Colour))
			throw new Error('colour must be a Colour.  Not: ' + colour);
		this.colour = colour;
	}

	toDiv() {
		if (this.div === undefined) {
			this.div = colourToElement(this.colour);
		}
		return this.div;
	}
};
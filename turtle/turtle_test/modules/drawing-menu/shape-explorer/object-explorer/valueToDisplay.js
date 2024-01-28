import { AngleDisplay } from './AngleDisplay.js';
import { ArrayDisplay } from './ArrayDisplay.js';
import { Colour } from '../../../Colour.js';
import { ColourDisplay } from './ColourDisplay.js';
import { isAnglePath } from './isAnglePath.js';
import { ObjectDisplay } from './ObjectDisplay.js';
import { SimpleDisplay } from './SimpleDisplay.js';
import { Vector3D } from '../../../drawing/vector/Vector3D.js';
import { Vector3DDisplay } from './Vector3DDisplay.js';

export function valueToDisplay(val, path) {
	if (typeof path !== 'string')
		throw new Error('valueToDisplay requires path to be a string.  Not: ' + path);

	const valType = typeof val;
	if (valType === 'number' && isAnglePath(path))
		return new AngleDisplay(val);

	if (val instanceof Colour)
		return new ColourDisplay(val);
	else if (val instanceof Array)
		return new ArrayDisplay(val, path);
	else if (val instanceof Vector3D)
		return new Vector3DDisplay(val);
	else if (valType === 'object')
		return new ObjectDisplay(val, path);
	else if (valType === 'string' || valType === 'number' || valType === 'boolean')
		return new SimpleDisplay(val);
	else
		throw new Error('Unable to create a display for val: ' + val);
};
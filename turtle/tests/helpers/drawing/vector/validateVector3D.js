import { isNumber } from '../../../../modules/isNumber.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

export function validateVector3D(vector, logger) {
	if (!(vector instanceof Vector3D)) {
		let details = ``;
		if (typeof vector === 'object' && vector.constructor !== undefined)
			details = vector.constructor.name;
		logger(`Expected a Vector3D but got ${vector}, typeof is ${typeof vector}${details}`);
	}
	else {
		if (!(vector.coords instanceof Array))
			logger(`Expected coords to be an Array but got ${vector.coords}`);
		else if (vector.coords.length !== 3) {
			logger(`Expected coords.length to be 3 but got ${vector.coords.length}`);
		}
		else {
			for (let i = 0; i < 3; i++) {
				if (!isNumber(vector.coords[i]))
					logger(`Expected vector.coords[${i}] to be a number but got ${vector.coords[i]}`);
			}
		}
	}
};
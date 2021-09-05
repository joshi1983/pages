import { validateArcShape } from './validateArcShape.js';
import { validateCircleShape } from './validateCircleShape.js';
import { validateEllipseArcShape } from './validateEllipseArcShape.js';
import { validateEllipseShape } from './validateEllipseShape.js';
import { validateLineSegmentShape } from './validateLineSegmentShape.js';
import { validatePathShape } from './validatePathShape.js';
import { validateShape } from './validateShape.js';
import { validateSphereShape } from './validateSphereShape.js';
import { validateTextShape } from './validateTextShape.js';

const validators = [
	validateArcShape,
	validateCircleShape,
	validateEllipseArcShape,
	validateEllipseShape,
	validateLineSegmentShape,
	validatePathShape,
	validateSphereShape,
	validateTextShape
];
const validatorsMap = new Map();
validators.forEach(function(validator) {
	const name = validator.constructor.name.substring('validate'.length);
	validatorsMap.set(name, validator);
});

export function validateShapeGeneric(shape, logger) {
	const validator = validatorsMap.get(shape.name);
	if (validator === undefined)
		validateShape(shape, logger);
	else
		validator(shape, logger);
};
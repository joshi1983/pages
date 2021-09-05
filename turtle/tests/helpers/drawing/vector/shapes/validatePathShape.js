import { ArcShape } from '../../../../../modules/drawing/vector/shapes/ArcShape.js';
import { validateArcShape } from './validateArcShape.js';
import { validateShape } from './validateShape.js';
import { validateVector3D } from '../validateVector3D.js';
import { Vector3D } from '../../../../../modules/drawing/vector/Vector3D.js';

export function validatePathShape(pathShape, logger) {
	validateShape(pathShape, logger);
	if (typeof pathShape.isClosed !== 'boolean')
		logger(`pathShape.isClosed expected to be boolean but got ${pathShape.isClosed} which has a type of ${typeof pathShape.isClosed}`);
	if (!(pathShape.elements instanceof Array))
		logger(`pathShape.elements expected to be an Array but got ${pathShape.elements}`);
	else {
		pathShape.elements.forEach(function(element, index) {
			const plogger = prefixWrapper(`pathShape.elements[${index}]`, logger);
			if (element instanceof Vector3D)
				validateVector3D(element, plogger);
			else if (element instanceof ArcShape) {
				validateArcShape(element, plogger);
			}
		});
	}
};
import { validateShape } from './validateShape.js';
import { validateVector3D } from '../validateVector3D.js';

export function validateLineSegmentShape(lineShape, logger) {
	validateShape(lineShape, logger);
	validateVector3D(lineShape.endPoint, prefixWrapper('lineShape.endPoint', logger));
};
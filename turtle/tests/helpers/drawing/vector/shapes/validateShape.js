import { prefixWrapper } from '../../../prefixWrapper.js';
import { validateShapeStyle } from './style/validateShapeStyle.js';
import { validateVector3D } from '../validateVector3D.js';

export function validateShape(shape, logger) {
	validateShapeStyle(shape.style);
	validateVector3D(shape.position, prefixWrapper(`position`, logger));
};
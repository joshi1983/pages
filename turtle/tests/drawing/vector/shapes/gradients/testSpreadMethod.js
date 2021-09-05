import { SpreadMethod } from '../../../../../modules/drawing/vector/shapes/gradients/SpreadMethod.js';

export function testSpreadMethod(logger) {
	const val = SpreadMethod.parse('pad');
	if (val !== 0)
		logger(`Expected 0 but got ${val}`);
	const reflectName = SpreadMethod.getNameFor(1);
	if (reflectName !== 'reflect')
		logger(`Expected "reflect" but got "${reflectName}"`);
};
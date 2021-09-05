import { Model3D } from '../../../modules/drawing/vector/Model3D.js';

export function testModel3D(logger) {
	const model = new Model3D();
	if (model.shapes.length !== 0)
		logger('Expected 0 shapes but got ' + model.shapes.length);
	if (model.hasAnythingToClear())
		logger('Expected false for hasAnythingToClear() but got ' + model.hasAnythingToClear());
};
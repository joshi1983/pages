import { BoundingBox } from '../../../modules/drawing/vector/BoundingBox.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { Vector3D } from '../../../modules/drawing/vector/Vector3D.js';

function check123Box(box, logger) {
	if (box.min.getX() !== 1)
		logger('min x expected to be 1 but got ' + box.min.getX());
	if (box.min.getY() !== 2)
		logger('min y expected to be 2 but got ' + box.min.getY());
	if (box.min.getZ() !== 3)
		logger('min z expected to be 3 but got ' + box.min.getZ());
	if (box.max.getX() !== 1)
		logger('max x expected to be 1 but got ' + box.max.getX());
	if (box.max.getY() !== 2)
		logger('max y expected to be 2 but got ' + box.max.getY());
	if (box.max.getZ() !== 3)
		logger('max z expected to be 3 but got ' + box.max.getZ());
}

function testAverageMethods(logger) {
	const box = new BoundingBox();
	const v = new Vector3D(1, 2, 3);
	box.include(v);
	box.include(new Vector3D(0, 0, 0));
	const averageX = box.getAverageX();
	const averageY = box.getAverageY();
	if (averageX !== 0.5)
		logger(`averageX expected to be 0.5 but got ${averageX}`);
	if (averageY !== 1)
		logger(`averageY expected to be 1 but got ${averageY}`);
}

function testGetMaxDimensionSize(logger) {
	const box = new BoundingBox();
	const v = new Vector3D(1, 2, 3);
	box.include(v);
	if (box.getMaxDimensionSize() !== 0)
		logger(`getMaxDimensionSize() expected to return 0 but got ${box.getMaxDimensionSize()}`);
	box.include(new Vector3D(0, 0, 0));
	if (box.getMaxDimensionSize() !== 3)
		logger(`getMaxDimensionSize() expected to return 3 but got ${box.getMaxDimensionSize()}`);
}

function testIncludeBoundingBox(logger) {
	const box = new BoundingBox();
	const otherBox = new BoundingBox();
	otherBox.include(new Vector3D(1, 2, 3));
	box.include(otherBox);
	check123Box(box, logger);
}

function testIncludeVector(logger) {
	const box = new BoundingBox();
	const v = new Vector3D(1, 2, 3);
	box.include(v);
	check123Box(box, logger);

	box.include(new Vector3D(-5, 9, 12));
	if (box.min.getX() !== -5)
		logger('min x expected to be -5 but got ' + box.min.getX());
	if (box.min.getY() !== 2)
		logger('min y expected to be 2 but got ' + box.min.getY());
	if (box.min.getZ() !== 3)
		logger('min z expected to be 3 but got ' + box.min.getZ());
	if (box.max.getX() !== 1)
		logger('max x expected to be 1 but got ' + box.max.getX());
	if (box.max.getY() !== 9)
		logger('max y expected to be 9 but got ' + box.max.getY());
	if (box.max.getZ() !== 12)
		logger('max z expected to be 12 but got ' + box.max.getZ());
}

export function testBoundingBox(logger) {
	testAverageMethods(prefixWrapper('testAverageMethods', logger));
	testGetMaxDimensionSize(prefixWrapper('testGetMaxDimensionSize', logger));
	testIncludeBoundingBox(prefixWrapper('testIncludeBoundingBox', logger));
	testIncludeVector(prefixWrapper('testIncludeVector', logger));
};
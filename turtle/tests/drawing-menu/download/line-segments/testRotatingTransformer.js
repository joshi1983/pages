import { isNumber } from '../../../../modules/isNumber.js';
import { LineSegmentsPreviewer } from '../../../../modules/drawing-menu/download/line-segments/LineSegmentsPreviewer.js';
import { RotatingTransformer } from '../../../../modules/drawing-menu/download/line-segments/RotatingTransformer.js';
import { Vector3D } from '../../../../modules/drawing/vector/Vector3D.js';

export function testRotatingTransformer(logger) {
	const container = document.createElement('div');
	const previewer = new LineSegmentsPreviewer(container, []);
	const rotating = new RotatingTransformer(previewer);
	const angle = rotating.getAngleRadians();
	if (!isNumber(angle))
		logger(`Expected getAngleRadians() to return a number but got ${angle}`);
	const v = rotating.getViewPoint();
	if (!(v instanceof Vector3D))
		logger(`getViewPoint() must return a Vector3D but got ${v}`);
	rotating.dispose();
};
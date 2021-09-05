import { ShapeStyle } from '../../../../modules/drawing/vector/shapes/style/ShapeStyle.js';
import { shapeStyleToX3D } from '../../../../modules/drawing/drawers/x3d/shapeStyleToX3D.js';
import { StringBuffer } from '../../../../modules/StringBuffer.js';

export function testShapeStyleToX3D(logger) {
	const cases = [
		{'in': new ShapeStyle()},
	];

	cases.forEach(function(caseInfo, index) {
		const buffer = new StringBuffer();
		shapeStyleToX3D(caseInfo.in, buffer);
	});
};
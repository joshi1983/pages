import { gradientToDTO } from './gradientToDTO.js';
import { LineCap } from '../../../drawing/vector/shapes/style/LineCap.js';
import { LineJoinStyle } from '../../../drawing/vector/shapes/style/LineJoinStyle.js';

export function penToDTO(pen) {
	const result = {
		'width': pen.width,
	};
	if (pen.width > 0) {
		result.lineJoinStyle = LineJoinStyle.getNameFor(pen.lineJoinStyle);
		result.lineCap = LineCap.getNameFor(pen.lineCap);
		if (pen.lineJoinStyle === LineJoinStyle.Miter)
			result.miterLimit = pen.miterLimit;
		if (pen.gradient === undefined)
			result.color = pen.color;
		else
			result.gradient = gradientToDTO(pen.gradient);
	}
	return result;
};
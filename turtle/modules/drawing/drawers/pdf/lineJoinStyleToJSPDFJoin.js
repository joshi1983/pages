import { LineJoinStyle } from '../../vector/shapes/style/LineJoinStyle.js';

export function lineJoinStyleToJSPDFJoin(lineJoinStyle) {
	if (lineJoinStyle === LineJoinStyle.Round)
		return 1;
	if (lineJoinStyle === LineJoinStyle.Bevel)
		return 2;
	return 0;
};
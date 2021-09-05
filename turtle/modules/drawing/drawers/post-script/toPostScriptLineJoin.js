import { LineJoinStyle } from '../../vector/shapes/style/LineJoinStyle.js';

const lineJoinNamesMap = new Map([
	[LineJoinStyle.Miter, 0],
	[LineJoinStyle.Round, 1],
	[LineJoinStyle.Bevel, 2]
]);

export function toPostScriptLineJoin(webLogoLineJoinNumber) {
	if (typeof webLogoLineJoinNumber !== 'number')
		throw new Error('webLogoLineJoinNumber must be a number.  Not: ' + webLogoLineJoinNumber);
	if (lineJoinNamesMap.has(webLogoLineJoinNumber))
		return lineJoinNamesMap.get(webLogoLineJoinNumber);
	else
		return 0;
};
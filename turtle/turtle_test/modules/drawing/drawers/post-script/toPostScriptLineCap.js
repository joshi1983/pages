import { LineCap } from '../../vector/shapes/style/LineCap.js';

const lineCapsArray = [];
lineCapsArray[LineCap.Butt] = 0;
lineCapsArray[LineCap.Round] = 1;
lineCapsArray[LineCap.Square] = 2;

export function toPostScriptLineCap(lineCapInteger) {
	if (lineCapsArray[lineCapInteger] !== undefined)
		return lineCapsArray[lineCapInteger];
	else
		return 0;
};
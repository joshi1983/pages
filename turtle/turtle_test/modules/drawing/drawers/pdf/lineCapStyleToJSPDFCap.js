import { LineCap } from '../../vector/shapes/style/LineCap.js';

const translationArray = [];
translationArray[LineCap.Round] = 1;
translationArray[LineCap.Butt] = 0;
translationArray[LineCap.Square] = 2;

export function lineCapStyleToJSPDFCap(lineCapInteger) {
	if (translationArray[lineCapInteger] !== undefined)
		return translationArray[lineCapInteger];
	return 0;
};
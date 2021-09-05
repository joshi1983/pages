import { convertToAlphaColour } from './convertToAlphaColour.js';
import { convertToAlphaColourOrTransparent } from './convertToAlphaColourOrTransparent.js';
import { convertToColour } from './convertToColour.js';
import { convertToColourOrTransparent } from './convertToColourOrTransparent.js';
import { convertToDataTypes } from './convertToDataTypes.js';

export function convertArgsUsingArgsInfo(inArray, argsInfo) {
	if (argsInfo === undefined)
		return inArray;
	return inArray.map(function(val, index) {
		const argInfo = argsInfo[index];
		if (argInfo === undefined)
			return val;
		if (argInfo.types === 'color')
			return convertToColour(val);
		if (argInfo.types === 'alphacolor')
			return convertToAlphaColour(val);
		else if (argInfo.types === 'alphacolor|transparent')
			return convertToAlphaColourOrTransparent(val);
		else if (argInfo.types === 'color|transparent')
			return convertToColourOrTransparent(val);
		else if (argInfo.sanitization === 'dataTypes')
			return convertToDataTypes(val);
		else
			return val;
	});
};
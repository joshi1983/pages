import { getMinLenAndSubtypesFromListTypes } from
'./getMinLenAndSubtypesFromListTypes.js';
import { getReturnDataTypesFromInputs } from
'../operator-data-types/getReturnDataTypesFromInputs.js';
import { isListType } from
'./isListType.js';

const listNumVectorTypes = new Set([
	null, '', 'list', 'list<num>'
]);

export function getVectorScaleReturnTypes(vectorTypes, scaleTypes) {
	if (scaleTypes === 'num' ||
	listNumVectorTypes.has(vectorTypes) ||
	!isListType(vectorTypes))
		return 'list<num>';

	const [resultMinLen, subtypes] = getMinLenAndSubtypesFromListTypes(vectorTypes); 
	const resultSubtypes = getReturnDataTypesFromInputs('*', [subtypes, scaleTypes]);
	return `list<${resultSubtypes}>` + (resultMinLen > 0 ? `(minlen=${resultMinLen})` : '');
};
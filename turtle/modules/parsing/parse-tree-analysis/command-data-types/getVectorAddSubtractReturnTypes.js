import { getMinLenAndSubtypesFromListTypes } from
'./getMinLenAndSubtypesFromListTypes.js';
import { getReturnDataTypesFromInputs } from
'../operator-data-types/getReturnDataTypesFromInputs.js';
import { isListType } from
'./isListType.js';

const listNumVectorTypes = new Set([
	null, '', 'list', 'list<num>'
]);

export function getVectorAddSubtractReturnTypes(operator) {
	return function(vectorTypes1, vectorTypes2) {
		if (listNumVectorTypes.has(vectorTypes1) ||
		listNumVectorTypes.has(vectorTypes2) ||
		!isListType(vectorTypes1) ||
		!isListType(vectorTypes2))
			return 'list<num>';

		let [minLen1, subtypes1] = getMinLenAndSubtypesFromListTypes(vectorTypes1);
		let [minLen2, subtypes2] = getMinLenAndSubtypesFromListTypes(vectorTypes2);
		const resultMinLen = Math.max(minLen1, minLen2);
		const resultSubtypes = getReturnDataTypesFromInputs(operator, [subtypes1, subtypes2]);
		return `list<${resultSubtypes}>` + (resultMinLen > 0 ? `(minlen=${resultMinLen})` : '');
	};
};
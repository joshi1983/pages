import { DataTypes } from
'../../../../data-types/DataTypes.js';
import { getRequiredTypesForToken } from
'./getRequiredTypesForToken.js';
import { getSatisfyingDataTypes } from
'../getSatisfyingDataTypes.js';


/*
Ignores the instruction list in the if statement.
*/
export function getRequiredTypesForIf(cachedParseTree, variableName, ifToken, tokenTypesMap,
leadingRequiredTypes) {
	if (ifToken.children.length === 0)
		return [new DataTypes(''), new DataTypes(leadingRequiredTypes)];
	const children = ifToken.children;
	const condition = children[0];
	const instructionList = children[1];
	let unionedTypes = new DataTypes('');
	const rangeTypes = getSatisfyingDataTypes(condition, variableName);
	const [unionedTypes2, intersectedTypes] = getRequiredTypesForToken(cachedParseTree, variableName,
	condition, tokenTypesMap, leadingRequiredTypes);
	unionedTypes.addTypes(unionedTypes2);
	if (rangeTypes === undefined) {
		if (instructionList !== undefined) {
			const r = getRequiredTypesForToken(cachedParseTree, variableName,
				instructionList, tokenTypesMap, intersectedTypes);
			console.log(`r=${r}, is Array? ${r instanceof Array}`);
			const [u, i] = r;
			console.log(`u=${u}, i=${i}`);
			intersectedTypes.intersectWith(i);
			unionedTypes.addTypes(u);
		}
	}
	else {
		const types = new DataTypes(leadingRequiredTypes);
		console.log(`intersectedTypes = ${intersectedTypes}`);
		console.log('leadingRequiredTypes = ' + leadingRequiredTypes);
		console.log('rangeTypes = ' + rangeTypes);
		console.log('before intersectWith, types = ' + types);
		types.intersectWith(rangeTypes);
		console.log('after intersectWith, types = ' + types);
		unionedTypes.addTypes(types);
		console.log('unionedTypes = ' + unionedTypes);
	}
	return [unionedTypes, intersectedTypes];
};
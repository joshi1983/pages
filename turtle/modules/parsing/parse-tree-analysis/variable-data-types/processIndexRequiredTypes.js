import { Command } from
'../../Command.js';
import { DataTypes } from
'../../data-types/DataTypes.js';
import { isNumber } from
'../../../isNumber.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';

export function processIndexRequiredTypes(variableRead, requiredTypes, tokenValuesMap) {
	const parent = variableRead.parentNode;
	if (parent === null)
		return;
	if (parent.type === ParseTreeTokenType.PARAMETERIZED_GROUP) {
		const info = Command.getCommandInfo(parent.val);
		if (info === undefined)
			return false;
		if (info.primaryName === 'item') {
			const index = parent.children.indexOf(variableRead);
			if (index === 1) {
				const firstChildVal = tokenValuesMap.get(parent.children[0]);
				if (isNumber(firstChildVal) && firstChildVal >= 1) {
					const minlen = Math.floor(firstChildVal);
					requiredTypes.intersectWith(new DataTypes(`list(minlen=${minlen})|string(minlen=${minlen})`));
				}
			}
		}
	}
};
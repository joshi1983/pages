import { getAttributesFromToken } from
'../../../../modules/parsing/data-types/data-type-parsing/getAttributesFromToken.js';
import { parseDataTypeString } from
'../../../../modules/parsing/data-types/data-type-parsing/parseDataTypeString.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { DataTypes } from
'../../../../modules/parsing/data-types/DataTypes.js';

function isEqualAttributeValue(expectedVal, actualValue) {
	if (typeof expectedVal === 'string' && actualValue instanceof Set) {
		actualValue = DataTypes.stringify(actualValue);
	}
	return expectedVal === actualValue;
}

export function testGetAttributesFromToken(logger) {
	const cases = [
		{'val': 'cproc(returntypes=int)', 'attributes': new Map([['returntypes', 'int']])},
		{'val': 'cproc(returntypes=int|string)', 'attributes': new Map([['returntypes', 'int|string']])},
		{'val': 'num(finite)', 'attributes': new Map([['finite', null]])},
		{'val': 'list(minlen=2)', 'attributes': new Map([['minlen', 2]])},
		{'val': 'list(minlen=3)', 'attributes': new Map([['minlen', 3]])},
		{'val': 'list(x=1,y=2,z=3)', 'attributes': new Map([['x', 1], ['y', 2], ['z', 3]])},
	];
	cases.forEach(function(caseInfo, index) {
		const parseResult = parseDataTypeString(caseInfo.val);
		const plogger = prefixWrapper(`Case ${index}, val=${caseInfo.val}`, logger);
		if (parseResult.children.length !== 1)
			plogger(`Expected children.length to be 1 for the root but found ${parseResult.children.length}`);
		else {
			const token = parseResult.children[0];
			const result = getAttributesFromToken(token);
			for (const [key, value] of caseInfo.attributes) {
				if (!isEqualAttributeValue(value, result[key]))
					plogger(`Expected the key ${key} to be associated with ${value} but actual value is ${result[key]}`);
			}
		}
	});
};
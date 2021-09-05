import { getDataTypeString } from
'../../parsing/parse-tree-analysis/variable-data-types/getDataTypeString.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processAssignmentPrefix } from './operators/processAssignmentPrefix.js';
import { processToken } from './processToken.js';

const initValues = new Map([
	['boolean', 'false'],
	['char', '"'],
	['double', '0'],
	['float', '0'],
	['int', '0'],
	['long', '0'],
	['String', '"']
]);

function processDeclarationWithoutInitialValue(declarationTypeStr, token, result, settings) {
	let initVal = initValues.get(declarationTypeStr);
	if (declarationTypeStr.indexOf('[]') !== -1)
		initVal = '[]'; // use an empty list literal for any array in Processing.

	if (initVal !== undefined) {
		processAssignmentPrefix(token, result, settings);
		result.append(` ${initVal}\n`);
	}
}

export function processDeclaration(token, result, settings) {
	result.processCommentsUpToToken(token);
	const declarationTypeStr = getDataTypeString(token);
	const children = token.children;
	for (let i = 1; i < children.length; i++) {
		const child = children[i];
		if (child.type === ParseTreeTokenType.IDENTIFIER)
			processDeclarationWithoutInitialValue(declarationTypeStr, child, result, settings);
		else if (child.type !== ParseTreeTokenType.COMMA)
			processToken(child, result, settings);
	}
};
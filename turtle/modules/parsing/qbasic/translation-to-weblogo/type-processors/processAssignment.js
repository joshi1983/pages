import { evaluateNumberLiteral } from
'../../evaluation/evaluateNumberLiteral.js';
import { getBaseIndexForArrayVariableAtToken } from
'../../parsing/parse-tree-analysis/variable-data-types/variables/getBaseIndexForArrayVariableAtToken.js';
import { getMakeCommandNameForToken } from
'./helpers/getMakeCommandNameForToken.js';
import { mightBeDataValue } from
'../../parsing/parse-tree-analysis/variable-data-types/mightBeDataValue.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';

export function processAssignment(token, result, options) {
	result.processCommentsUpToToken(token);
	const children = token.children;
	if (children.length === 2) {
		const firstChild = children[0];
		if (firstChild.type === ParseTreeTokenType.IDENTIFIER) {
			const variableName = options.identifierRenameMap.get(firstChild.val.toLowerCase());
			const makeName = getMakeCommandNameForToken(token);
			result.append(`${makeName} "${variableName} `);
			processToken(children[1], result, options);
		}
		else if (firstChild.type === ParseTreeTokenType.EXPRESSION_DOT &&
		firstChild.children.length === 3) {
			const fChildren = firstChild.children;
			const objectNameToken = fChildren[0];
			const propertyNameToken = fChildren[2];
			if (propertyNameToken.type !== ParseTreeTokenType.IDENTIFIER)
				return;

			const propName = options.identifierRenameMap.get(propertyNameToken.val.toLowerCase());
			if (objectNameToken.type !== ParseTreeTokenType.IDENTIFIER) {
				result.append('\nsetProperty2 ( ')
				processToken(objectNameToken, result, options);
				result.append(` ) "${propName} `);
				processToken(children[1], result, options);
				result.append('\n');
				return;
			}

			const objectName = options.identifierRenameMap.get(objectNameToken.val.toLowerCase());
			result.append(`\nsetProperty "${objectName} "${propName} `);
			processToken(children[1], result, options);
		}
		else if (firstChild.type === ParseTreeTokenType.FUNCTION_CALL &&
		firstChild.children.length === 2 &&
		firstChild.children[0].type === ParseTreeTokenType.IDENTIFIER) {
			result.append('\nsetItem ');
			const qbVariableName = firstChild.children[0].val.toLowerCase();
			const baseIndex = getBaseIndexForArrayVariableAtToken(qbVariableName, firstChild, 0, options);
			let indexToken = firstChild.children[1];
			const indexChildValueTokens = indexToken.children.filter(mightBeDataValue);
			if (indexChildValueTokens.length === 1)
				indexToken = indexChildValueTokens[0];
			if (indexToken.type === ParseTreeTokenType.NUMBER_LITERAL) {
				const val = evaluateNumberLiteral(indexToken);
				result.append('' + (val + 1 - baseIndex));
			}
			else {
				if (baseIndex !== 1) {
					result.append(`${1 - baseIndex} + `);
				}
				processToken(indexToken, result, options);
			}
			const variableName = options.identifierRenameMap.get(qbVariableName);
			result.append(` "${variableName} `);
			processToken(children[1], result, options);
		}
		result.append('\n');
	}
};
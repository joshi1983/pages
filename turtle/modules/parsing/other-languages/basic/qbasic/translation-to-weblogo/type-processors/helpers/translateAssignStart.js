import { evaluateNumberLiteral } from
'../../../evaluation/evaluateNumberLiteral.js';
import { getBaseIndexForArrayVariableAtToken } from
'../../../parsing/parse-tree-analysis/variable-data-types/variables/getBaseIndexForArrayVariableAtToken.js';
import { getMakeCommandNameForToken } from
'./getMakeCommandNameForToken.js';
import { mightBeDataValue } from
'../../../parsing/parse-tree-analysis/variable-data-types/mightBeDataValue.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { processMidStringAssignmentStart } from './processMidStringAssignmentStart.js';
import { processToken } from '../processToken.js';
import { QBasicInternalFunctions } from
'../../../QBasicInternalFunctions.js';

function isMidStringAssignment(token) {
	if (token.type === ParseTreeTokenType.FUNCTION_CALL &&
	token.children.length === 2 &&
	token.children[0].type === ParseTreeTokenType.IDENTIFIER) {
		const firstChild = token.children[0];
		const info = QBasicInternalFunctions.getFunctionInfo(firstChild.val);
		return info !== undefined && info.primaryName.toLowerCase() === 'mid$';
	}
	return false;
}

export function translateAssignStart(token, result, options) {
	if (token.type === ParseTreeTokenType.IDENTIFIER) {
		const variableName = options.identifierRenameMap.get(token.val.toLowerCase());
		const makeName = getMakeCommandNameForToken(token);
		result.append(`${makeName} "${variableName} `);
		return true;
	}
	else if (token.type === ParseTreeTokenType.EXPRESSION_DOT &&
	token.children.length === 3) {
		const fChildren = token.children;
		const objectNameToken = fChildren[0];
		const propertyNameToken = fChildren[2];
		if (propertyNameToken.type !== ParseTreeTokenType.IDENTIFIER)
			return false;
		const propName = options.identifierRenameMap.get(propertyNameToken.val.toLowerCase());
		if (objectNameToken.type !== ParseTreeTokenType.IDENTIFIER) {
			result.append('\nsetProperty2 ( ')
			processToken(objectNameToken, result, options);
			result.append(` ) "${propName} `);
			return true;
		}
		const objectName = options.identifierRenameMap.get(objectNameToken.val.toLowerCase());
		result.append(`\nsetProperty "${objectName} "${propName} `);
		return true;
	}
	else if (token.type === ParseTreeTokenType.FUNCTION_CALL &&
	token.children.length === 2 &&
	token.children[0].type === ParseTreeTokenType.IDENTIFIER) {
		if (isMidStringAssignment(token)) {
			return processMidStringAssignmentStart(token, result, options);
		}
		result.append('\nsetItem ');
		const qbVariableName = token.children[0].val.toLowerCase();
		const baseIndex = getBaseIndexForArrayVariableAtToken(qbVariableName, token, 0, options);
		let indexToken = token.children[1];
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
		return true;
	}
};
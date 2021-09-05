import { assignsNewDataTypeValue } from './assignsNewDataTypeValue.js';
import { Command } from '../Command.js';
import { CommandCalls } from './CommandCalls.js';
import { DataTypes } from '../data-types/DataTypes.js';
import { ForLoops } from './ForLoops.js';
import { getAssignedValueInToken } from './getAssignedValueInToken.js';
import { getInstructionListChildToken } from './getInstructionListChildToken.js';
import { getPossibleDataTypesEvaluatedFromToken } from './getPossibleDataTypesEvaluatedFromToken.js';
import { getProcedureStartToken } from './getProcedureStartToken.js';
import { isReadingForLoopVariable } from './variableWriting.js';
import { Operators } from '../Operators.js';
import { ParseTreeToken } from '../ParseTreeToken.js';
import { ParseTreeTokenType } from '../ParseTreeTokenType.js';

/*

varNamesNotToCheck is critical to prevent infinite recursive loops.
*/
function narrowDataTypesWith(varName, token, dataTypes, proceduresMap, varNamesNotToCheck) {
	if (!(proceduresMap instanceof Map))
		throw new Error('proceduresMap must be a Map');
	if (varNamesNotToCheck.has(varName))
		return;
	if (CommandCalls.isCommandCall(token) && token.children.length >= 1 && 
	typeof token.children[0].val === 'string' && token.children[0].val.toLowerCase() === varName) {
		const info = Command.getCommandInfo(token.val);
		if (info.args[0].refTypes !== undefined) {
			dataTypes.intersectWith(new DataTypes(info.args[0].refTypes));
			return;
		}
		else if (info.primaryName === 'make' || info.primaryName === 'localmake') {
			const otherVarNamesNotToCheck = new Set(Array.from(varNamesNotToCheck));
			otherVarNamesNotToCheck.add(varName);
			const otherVarTypes = getPossibleDataTypesEvaluatedFromToken(token.children[1], proceduresMap, otherVarNamesNotToCheck);
			dataTypes.intersectWith(otherVarTypes);
		}
	}
	if (token.type === ParseTreeTokenType.VARIABLE_READ && token.val.toLowerCase() === varName) {
		const parent = token.parentNode;
		const index = parent.children.indexOf(token);
		if (parent.type === ParseTreeTokenType.UNARY_OPERATOR) {
			dataTypes.intersectWith(new DataTypes(Operators.getUnaryParameterTypes(parent.val)));
		}
		else if (parent.type === ParseTreeTokenType.BINARY_OPERATOR && parent.children.length === 2) {
			dataTypes.intersectWith(new DataTypes(Operators.getParameterTypes(parent.val, index)));
		}
		else if (CommandCalls.isCommandCall(parent)) {
			dataTypes.intersectWith(new DataTypes(Command.getParameterTypes(parent.val, index)));
		}
	}
	for (let i = 0; i < token.children.length; i++) {
		narrowDataTypesWith(varName, token.children[i], dataTypes, proceduresMap, varNamesNotToCheck);
	}
}

function narrowDataTypesWithForLoop(varName, forToken, types) {
	const forVarName = ForLoops.getVariableName(forToken);
	if (forVarName === varName) {
		types.intersectWith(new DataTypes(ForLoops.getDataTypeWithForLoop(forToken)));
	}
}

function getPrevious(token) {
	if (token.previousSibling === null && token.parentNode.type === ParseTreeTokenType.LIST) {
		const parent = getInstructionListChildToken(token.parentNode);
		if (parent === undefined)
			return null;
		else if (parent.previousSibling !== null)
			return parent.previousSibling;
		else
			return getPrevious(parent);
	}
	else
		return token.previousSibling;
}

/*
Every element in varNamesNotToCheck must be a string in lower case.
*/
export function getPossibleDataTypesForVariableAtToken(token, varName, proceduresMap, varNamesNotToCheck) {
	if (typeof varName !== 'string')
		throw new Error('varName must be a string');
	if (!(varNamesNotToCheck instanceof Set))
		throw new Error('varNamesNotToCheck mut be a Set');
	if (!(token instanceof ParseTreeToken))
		throw new Error('token must be a ParseTreeToken');
	if (!(proceduresMap instanceof Map))
		throw new Error('proceduresMap must be a Map');

	varName = varName.trim().toLowerCase();
	let result = new DataTypes(DataTypes.getAllAssignableDataTypes());
	token = getInstructionListChildToken(token);
	for (let t = token.previousSibling; t !== null; t = getPrevious(t)) {
		narrowDataTypesWith(varName, t, result, proceduresMap, varNamesNotToCheck);
		// will t assign a value to varName?
		if (assignsNewDataTypeValue(varName, t, proceduresMap)) {
			// if yes, get that exact data type and use it.
			const val = getAssignedValueInToken(varName, t, proceduresMap);
			if (val === undefined)
				break;
			else {
				result.intersectWith(DataTypes.getTypesCompatibleWithValue(val));
			}
		}
		if (t.previousSibling === null && ForLoops.isAForLoopToken(t.parentNode.parentNode)) {
			narrowDataTypesWithForLoop(varName, t.parentNode.parentNode, result);
		}
	}
	if (!assignsNewDataTypeValue(varName, token, proceduresMap)) {
		for (let t = token.nextSibling; t !== null; t = t.nextSibling) {
			if (assignsNewDataTypeValue(varName, t, proceduresMap))
				break;
			narrowDataTypesWith(varName, t, result, proceduresMap, varNamesNotToCheck);
		}
	}

	return result;
};
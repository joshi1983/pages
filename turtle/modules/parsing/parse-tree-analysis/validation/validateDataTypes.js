import { Command } from '../../Command.js';
import { DataTypes } from '../../data-types/DataTypes.js';
import { dataTypesToEnglish } from '../../../help/command-details/dataTypesToEnglish.js';
import { getTokensByType } from '../../generic-parsing-utilities/getTokensByType.js';
import { getSanitizationTips } from '../getSanitizationTips.js';
import { Operators } from '../../Operators.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { StringBuffer } from '../../../StringBuffer.js';
await Command.asyncInit();
await Operators.asyncInit();
const toNames = Command.getLowerCaseCommandNameSet('to');

function getTokensWithChildren(tokens) {
	return tokens.filter(function(token) {
		return token.children.length !== 0; // we don't care about cases where no parameters are used.
	});
}

function formatParameterTypes(dataTypes, parameterNames) {
	if (dataTypes.length !== parameterNames.length)
		throw new Error(`The lengths must match.  ${dataTypes.length} != ${parameterNames.length}`);

	const result = new StringBuffer();
	for (let i = 0; i < dataTypes.length; i++) {
		if (i !== 0)
			result.append(', ');
		result.append('parameter ' + parameterNames[i] + ' must be of type(s) [' + dataTypesToEnglish(dataTypes[i]) + ']');
	}
	return result.toString();
}

export function validateDataTypes(cachedParseTree, parseLogger) {
	// get all variables and parameters used in the code.
	const commandCalls = getTokensWithChildren(cachedParseTree.getCommandCallsArray()).
		filter(tok => !toNames.has(tok.val.toLowerCase()));
	const extraInfo = {
		'procedures': cachedParseTree.getProceduresMap()
	};
	const tokenTypes = cachedParseTree.getTokensToDataTypes();
	const tokenValues = cachedParseTree.getTokenValues();
	// validate inputs to command calls.
	commandCalls.forEach(function(commandCallToken) {
		const commandInfo = Command.getCommandInfo(commandCallToken.val);
		commandCallToken.children.forEach(function(actualParamToken, index) {
			if (actualParamToken.type === ParseTreeTokenType.PROCEDURE_START_KEYWORD) {
				parseLogger.error('Expected input for command <span class="command">' + commandCallToken.val + '</span> but got the starting keyword for a procedure', actualParamToken, true);
				return;
			}
			const requiredParameterTypes = new DataTypes(Command.getParameterTypes(commandInfo, index));
			let requiredTypesStr = requiredParameterTypes;
			if (requiredTypesStr instanceof DataTypes)
				requiredTypesStr = requiredTypesStr.toString();
			const acceptableTypes = DataTypes.parse(requiredTypesStr);
			let possibleTypesStr = '';
			let acceptableMatchFound = false;
			if (requiredTypesStr === 'instructionlist') {
				if (actualParamToken.type === ParseTreeTokenType.LIST)
					acceptableMatchFound = true;
			}
			else {
				for (let at of acceptableTypes) {
					if ((typeof at.mayBeCompatibleWith) !== 'function') {
						console.log('mayBeCompatibleWith = ' + at.mayBeCompatibleWith);
						console.error(at);
						throw new Error('at expected to have a mayBeCompatibleWith but it does not. at is a = ' + at.constructor.name);
					}
					if (at.mayBeCompatibleWith(actualParamToken, extraInfo)) {
						acceptableMatchFound = true;
						break;
					}
				}
				if (acceptableMatchFound) {
					const possibleTokenTypes = cachedParseTree.getPossibleTypesFromToken(actualParamToken);
					if (!possibleTokenTypes.hasIntersectionWith(acceptableTypes)) {
						acceptableMatchFound = false;
						possibleTypesStr = possibleTokenTypes.toString();
					}
					else {
						const val = tokenValues.get(actualParamToken);
						if (val !== undefined) {
							requiredParameterTypes.intersectWithValueCompatability(val);
							acceptableMatchFound = !requiredParameterTypes.isEmpty();
						}
					}
				}
			}
			if (!acceptableMatchFound) {
				const typeStr = dataTypesToEnglish(acceptableTypes);
				let msg = commandCallToken.val +
					' command requires input of type(s) ' + typeStr + getSanitizationTips(actualParamToken, typeStr);
				if (possibleTypesStr === 'null')
					msg += '  The given data types indicate that no value is outputted.';
				else if (possibleTypesStr !== '')
					msg += '  The given data types were found to be ' + dataTypesToEnglish(possibleTypesStr);
				const argCount = Command.getArgCount(commandInfo);
				if (argCount.isFlexible || argCount.defaultCount > 1) {
					const paramName = Command.getParameterName(commandInfo, index);
					if (paramName !== undefined)
						msg += `  This applies to a parameter named ${paramName}.`;
				}
				msg += `  Click <span class="command">${commandInfo.primaryName}</span> to learn more about the command and its parameters.`;
				parseLogger.error(msg, actualParamToken, true);
			}
		});
	});
	const tokenToTypes = cachedParseTree.getTokensToDataTypes();
	const variables = cachedParseTree.getVariables();
	for (const [key, callTokens] of cachedParseTree.getProcedureCallsMap()) {
		const procedure = cachedParseTree.getProceduresMap().get(key);
		if (procedure === undefined)
			parseLogger.error(`Unable to find procedure named "${key}"`, callTokens[0]);
		else if (procedure.parameters.length !== 0) {
			const instructionList = procedure.getInstructionListToken();
			const paramTypes = procedure.parameters.map(function(name, index) {
				const variable = variables.getVariableByName(name);
				return variable.getRequiredTypesAtToken(instructionList);
			});
			callTokens.forEach(function(callToken) {
				for (let paramIndex = Math.min(procedure.parameters.length, callToken.children.length) - 1;
				paramIndex >= 0;
				paramIndex--) {
					const childToken = callToken.children[paramIndex];
					const tokenTypes = tokenToTypes.get(childToken);
					if (tokenTypes !== undefined) {
						const paramTypes_ = paramTypes[paramIndex];
						if (!paramTypes_.isEmpty() && !paramTypes_.hasIntersectionWith(tokenTypes)) {
							const typeStr = formatParameterTypes(paramTypes, procedure.parameters);
							parseLogger.error(callToken.val +
								' procedure requires input the following input types.  ' + typeStr + getSanitizationTips(childToken, typeStr)
							, childToken);
						}
					}
				}
			});
		}
	}
	getTokensByType(cachedParseTree, ParseTreeTokenType.BINARY_OPERATOR).forEach(function(operatorToken) {
		const operatorInfo = Operators.getOperatorInfo(operatorToken.val);
		operatorToken.children.forEach(function(actualParamToken, index) {
			const parameterDataTypes = Operators.getParameterTypes(operatorInfo, index);
			if (parameterDataTypes === undefined)
				return; // don't throw an error.  
				// Another validator like validateBinaryOperatorParameters 
				// should report the problem.

			const acceptableTypes = DataTypes.parse(parameterDataTypes);
			const possibleTokenTypes = cachedParseTree.getPossibleTypesFromToken(actualParamToken);
			if (!possibleTokenTypes.hasIntersectionWith(acceptableTypes)) {
				const typeStr = possibleTokenTypes.toString();
				let msg = operatorToken.val 
					+ ' binary operator requires input of type(s) ' + dataTypesToEnglish(DataTypes.stringify(acceptableTypes), false);
				if (typeStr !== '')
					msg += '  The types were calculated as ' + dataTypesToEnglish(typeStr, false);
				parseLogger.error(msg, actualParamToken);
			}
		});
	});
	getTokensByType(cachedParseTree, ParseTreeTokenType.UNARY_OPERATOR).forEach(function(operatorToken) {
		const operatorInfo = Operators.getOperatorInfo(operatorToken.val);
		const acceptableTypes = DataTypes.parse(
			Operators.getUnaryParameterTypes(operatorInfo)
		);
		const actualParamToken = operatorToken.children[0];
		const possibleTokenTypes = cachedParseTree.getPossibleTypesFromToken(actualParamToken);
		possibleTokenTypes.intersectWith(acceptableTypes);
		if (possibleTokenTypes.isEmpty())
			parseLogger.error(operatorToken.val 
				+ ' unary operator requires input of type(s) ' + dataTypesToEnglish(DataTypes.stringify(acceptableTypes), false),
				actualParamToken);
	});
	const scopes = cachedParseTree.getVariables().getAllScopesAsArray();
	scopes.filter(scope => scope.singleValue !== undefined &&
		scope.assignToken.type !== ParseTreeTokenType.LIST &&
		scope.assignToken.type !== ParseTreeTokenType.TREE_ROOT &&
		scope.variable.name !== '').
	forEach(function(scope) {
		const token = scope.fromToken;
		const procedure = cachedParseTree.getProcedureAtToken(token);
		// may not be same as scope.procedure.

		const scopes = scope.variable.getScopesAt(token, procedure);
		if (scopes.length === 1 && scope.procedure === procedure) {
			const intersectedTypes = new DataTypes(scope.requiredTypes);
			// clone to prevent mutating scope.requiredTypes.
			intersectedTypes.intersectWithValueCompatability(scope.singleValue);
			if (intersectedTypes.isEmpty())
				parseLogger.error(`The value assigned to ${scope.variable.name} doesn't match any acceptable data type.  The types that won't lead to an error were narrowed down to ${dataTypesToEnglish(scope.requiredTypes, false)}.`, scope.assignToken);
		}
	});
};
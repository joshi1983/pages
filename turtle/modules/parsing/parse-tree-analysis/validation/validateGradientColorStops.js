import { AlphaColour } from '../../../AlphaColour.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function validateColorStopsToken(cachedParseTree, variables, colorStopToken, parseLogger) {
	const variable = variables.getVariableByName(colorStopToken.val.toLowerCase());
	if (variable === undefined)
		return;
	const commandName = colorStopToken.parentNode.val;
	const procedure = cachedParseTree.getProcedureAtToken(colorStopToken);
	const scopes = variable.getScopesAt(colorStopToken, procedure);
	scopes.filter(s => s.singleValue instanceof Map).forEach(function(scope) {
		const singleValue = scope.singleValue;
		if (singleValue.size < 2)
			parseLogger.error(`The color stops parameter to the ${commandName} command requires at least 2 color stops but you provided only ${singleValue.size}`, colorStopToken);
		for (const [key, value] of singleValue) {
			if (typeof key !== 'number') {
				let additional = '';
				if (typeof key === 'string' && !isNaN(key))
					additional = ` Use ${key} instead of "${key}. The quote makes your value a string.`;
				parseLogger.error(`Every key in the colorStops property list must be a number but ${key} is not a number.${additional}`, colorStopToken);
			}
			else if (key < 0 || key > 1) {
				parseLogger.error(`Every key in the colorStops property list must be between 0 and 1 but ${key} is out of that range`, colorStopToken);
			}
			if (!AlphaColour.canBeInterprettedAsAlphaColour(value) && (typeof value !== 'string' || value.toLowerCase() !== "transparent"))
				parseLogger.error(`Every value in the colorStops property list must be a color, alphacolor or transparent but the value for ${key} is not`, colorStopToken);
		}
	});
}

export function validateGradientColorStops(cachedParseTree, parseLogger) {
	const linearGradientCalls = cachedParseTree.getCommandCallsByName('createLinearGradient').
		filter(t => t.children[2] !== undefined && t.children[2].type === ParseTreeTokenType.VARIABLE_READ);
	const radialGradientCalls = cachedParseTree.getCommandCallsByName('createRadialGradient').
		filter(t => t.children[3] !== undefined && t.children[3].type === ParseTreeTokenType.VARIABLE_READ);
	const variables = cachedParseTree.getVariables();
	linearGradientCalls.forEach(function(gradientCallToken) {
		validateColorStopsToken(cachedParseTree, variables, gradientCallToken.children[2], parseLogger);
	});
	radialGradientCalls.forEach(function(gradientCallToken) {
		validateColorStopsToken(cachedParseTree, variables, gradientCallToken.children[3], parseLogger);
	});
};
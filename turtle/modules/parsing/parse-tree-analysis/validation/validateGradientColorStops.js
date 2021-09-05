import { AlphaColour } from '../../../AlphaColour.js';
import { EasingFunction } from '../../../drawing/vector/easing/EasingFunction.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { Transparent } from '../../../Transparent.js';

function isColourish(value) {
	return AlphaColour.canBeInterprettedAsAlphaColour(value) ||
		value === Transparent;
}

function isEasingPair(val) {
	return val instanceof Array &&
		val.length === 2 &&
		isColourish(val[0]) &&
		val[1] instanceof EasingFunction;
}

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
			if (!isColourish(value) && !isEasingPair(value)) {
				let msg = '';
				if (value instanceof Array) {
					if (value.length === 2) {
						msg = `You specified a list of 2 values which is acceptable but the types of each element is invalid.`;
					}
					else if (value.length === 3 || value.length === 4)
						msg = `You specified a list of length ${value.length} which is valid only if every element is an integer 0..255 representing the RGB or ARGB values of a color.`;
					else
						msg = `You specified a list of length ${value.length} which is invalid. Valid list lengths are 2, 3, and 4. See the gradients tutorial to learn more.`;
				}
				else
					msg = `Every value in the colorStops property list must be a color, alphacolor, transparent, or list`;
				parseLogger.error(`Invalid type of value for property ${key}.  ${msg}`, colorStopToken, true);
			}
		}
	});
}

export function validateGradientColorStops(cachedParseTree, parseLogger) {
	const linearGradientCalls = cachedParseTree.getCommandCallsByName('createLinearGradient').
		filter(t => t.children[2] !== undefined && t.children[2].type === ParseTreeTokenType.VARIABLE_READ);
	const radialGradientCalls = cachedParseTree.getCommandCallsByName('createRadialGradient').
		filter(t => t.children[2] !== undefined && t.children[2].type === ParseTreeTokenType.VARIABLE_READ);
	const radialGradient2Calls = cachedParseTree.getCommandCallsByName('createRadialGradient2').
		filter(t => t.children[3] !== undefined && t.children[3].type === ParseTreeTokenType.VARIABLE_READ);
	const variables = cachedParseTree.getVariables();
	linearGradientCalls.forEach(function(gradientCallToken) {
		validateColorStopsToken(cachedParseTree, variables, gradientCallToken.children[2], parseLogger);
	});
	radialGradientCalls.forEach(function(gradientCallToken) {
		validateColorStopsToken(cachedParseTree, variables, gradientCallToken.children[2], parseLogger);
	});
	radialGradient2Calls.forEach(function(gradientCallToken) {
		validateColorStopsToken(cachedParseTree, variables, gradientCallToken.children[3], parseLogger);
	});
};
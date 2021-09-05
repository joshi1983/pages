import { Command } from '../../Command.js';
import { ForLoops } from '../ForLoops.js';
import { NumberType } from '../../data-types/NumberType.js';
import { ParseTreeToken } from '../../ParseTreeToken.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { validateIdentifier } from '../validateIdentifier.js';

function mightBeANumber(token) {
	return !NumberType.isDefinitelyNotCompatibleWith(token);
}

// returns undefined if the for token has an invalid structure preventing us from getting the variable name.
function getVariableNameFromForToken(token) {
	if (token.children.length === 0 ||
	token.children[0].children.length < 2 ||
	token.children[0].children[1].type !== ParseTreeTokenType.STRING_LITERAL)
		return undefined;
	return token.children[0].children[1].val;
}

function validateNestedForVariableNameClash(token, parseLogger) {
	if (!ForLoops.isAForLoopToken(token))
		return;
	const varName = getVariableNameFromForToken(token);
	if (varName === undefined)
		return;
	for (token = token.parentNode;token !== null;token = token.parentNode) {
		if (ForLoops.isAForLoopToken(token)) {
			const otherVariableName = getVariableNameFromForToken(token);
			if (otherVariableName === varName) {
				token = token.children[0].children[1];
				parseLogger.error('for-loop variable names must not match any other for-loop variables in nested structure', token);
				return;
			}
		}
	}
}

export function validateForLoops(cachedParseTree, parseLogger) {
	const forTokens = cachedParseTree.getCommandCallsByName('for');
	forTokens.forEach(function(forToken) {
		if (forToken.children.length !== 2)
			parseLogger.error('There must be exactly 2 inputs in a for-loop', forToken);
		else {
			var typeError = false;
			forToken.children.forEach(function(forChild) {
				if (forChild.type !== ParseTreeTokenType.LIST) {
					parseLogger.error('Both inputs to a for-loop must be lists.  '+
					'Each input to the for command must be surrounded with [ square brackets ].  '+
					'Learn more by clicking <span class="command">for command</span>.', forChild, true);
					typeError = true;
				}
			});
			if (!typeError) {
				if (forToken.children[0].children.length !== 5 && forToken.children[0].children.length !== 6)
					parseLogger.error('A for-loop\'s control settings must have 3 or 4 elements but found ' +
						(forToken.children[0].children.length - 2), forToken.children[0]);
				else if (forToken.children[0].children[1].type !== ParseTreeTokenType.STRING_LITERAL) {
					const t = forToken.children[0].children[1];
					let extra = '';
					if (typeof t.val === 'string' && validateIdentifier(t.val) === undefined)
						extra = '  For example, for ["' + t.val + " ...";
					parseLogger.error('The first element in a for-loop\'s control settings must be a variable name and must start with a quote(").' + extra, forToken.children[0].children[1]);
				}
				else {
					const controlSettings = forToken.children[0].children;
					const names = [
						'start', 'maximum', 'step'
					];
					for (let i = 2; i < controlSettings.length - 1; i++) {
						if (!mightBeANumber(controlSettings[i])) {
							parseLogger.error('The for-loop\'s ' + names[i - 2] + ' value must be a number', controlSettings[i]);
						}
					}
				}
			}
			validateNestedForVariableNameClash(forToken, parseLogger);
		}
	});
};
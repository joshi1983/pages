import { Command } from '../../../Command.js';
import { CommandCalls } from '../../CommandCalls.js';
import { getParseTokensSorted } from
'../../../parse-tree-token/getParseTokensSorted.js';
import { MaybeDecided } from '../../../../MaybeDecided.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
await Command.asyncInit();
/*
This should include all commands that make use of 
the pen being up or down.
*/
const affectedPrimaryNames = [
	'arc', 'arcLeft', 'arcRight', 'backward',
	'circle', 'circleLeft', 'circleRight', 'ellipse', 'ellipse2',
	'ellipseArc', 'forward', 'home', 'isotoxalStar', 'penDownp',
	'setPos', 'setX', 'setY', 'setXY', 'setXYZ', 'setZ'
];

const controllingPrimaryNames = [
'penDown', 'penNormal', 'penUp'];
const primaryNamesOfInterest = new Set([
...affectedPrimaryNames, ...controllingPrimaryNames]);
export { affectedPrimaryNames, primaryNamesOfInterest };

function isExecutionDefinitelyFollowing(previousToken, afterToken) {
	if (previousToken.parentNode === afterToken.parentNode)
		return true;
	return false; // we can't safely say that afterToken is executed after previousToken.
}

function updateIsDown(isDown, token, info) {
	if (info.primaryName === 'penDown' || info.primaryName === 'penNormal')
		return MaybeDecided.Yes;
	else if (info.primaryName === 'penUp')
		return MaybeDecided.No;
	else
		return isDown; // no change
}

export function getRecommendedRemovals(tokens) {
	tokens = tokens.filter(function(token) {
		const info = Command.getCommandInfo(token.val);
		if (info === undefined)
			return true;
		else
			return primaryNamesOfInterest.has(info.primaryName);
	});
	getParseTokensSorted(tokens);
	let isDown = MaybeDecided.Maybe;
	const result = [];
	if (CommandCalls.filterCommandCalls(tokens, ['penUp']).length === 0) {
		return {
			'tokens': CommandCalls.filterCommandCalls(tokens, ['penDown']),
			'isOnlyPenDown': true
		};
	}
	else {
		let controllingTokenIsUsed = true;
		let controllingToken = undefined;
		let controllingTokenInfo = undefined;
		for (let i = 0; i < tokens.length; i++) {
			const token = tokens[i];
			const info = Command.getCommandInfo(token.val);
			const prevIsDown = isDown;
			if (info === undefined) {
				isDown = MaybeDecided.Maybe;
				controllingTokenIsUsed = true;
				// procedures might depend on the pen being up or down so don't warn.
			}
			else {
				isDown = updateIsDown(isDown, token, info);
				if (controllingPrimaryNames.indexOf(info.primaryName) === -1) {
					controllingTokenIsUsed = true;
				}
				else {
					if (controllingTokenIsUsed === false && controllingTokenInfo.primaryName !== 'penNormal' &&
					isExecutionDefinitelyFollowing(controllingToken, token)) {
						result.push(controllingToken); // warn about the unused token.
					}
					controllingToken = token;
					controllingTokenInfo = info;
					controllingTokenIsUsed = false;
					// new token is not used as far as we know initially.
				}
			}
		}
		if (controllingTokenIsUsed === false && controllingToken !== undefined &&
		controllingTokenInfo.primaryName !== 'penNormal' &&
		result[result.length - 1] !== controllingToken) {
			if (controllingToken.parentNode.type === ParseTreeTokenType.TREE_ROOT) {
				result.push(controllingToken);
			}
		}
	}
	return {'tokens': result, 'isOnlyPenDown': false};
};
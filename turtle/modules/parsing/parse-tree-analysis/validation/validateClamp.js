import { isNumber } from '../../../isNumber.js';

const clampCommandContent = `Click <span class="command">clamp</span> to review documentation on the <span class="command">clamp</span> command.`;

export function validateClamp(cachedParseTree, parseLogger) {
	const tokenValues = cachedParseTree.getTokenValues();
	const clampCalls = cachedParseTree.getCommandCallsByName('clamp').filter(
		clampToken => clampToken.children.length === 3 &&
		isNumber(tokenValues.get(clampToken.children[1])) &&
		isNumber(tokenValues.get(clampToken.children[2])) &&
		tokenValues.get(clampToken.children[1]) >= tokenValues.get(clampToken.children[2]));
	clampCalls.forEach(function(clampCallToken) {
		const min = tokenValues.get(clampCallToken.children[1]);
		const max = tokenValues.get(clampCallToken.children[2]);
		
		if (min === max)
			parseLogger.warn(`clamp will always output ${min} because the specified min and max is equal. ${clampCommandContent}`, clampCallToken, true);
		else
			parseLogger.error(`The min must always be smaller than max. min was specified as ${min} and max was specified as ${max}.  ${clampCommandContent}`, clampCallToken, true);
	});
};
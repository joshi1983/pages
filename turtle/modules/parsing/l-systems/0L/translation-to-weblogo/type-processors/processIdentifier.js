import { CommandSymbols } from '../../CommandSymbols.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';

function isInCommandSequence(token) {
	return token.parentNode.type === ParseTreeTokenType.COMMAND_SEQUENCE;
}

export function processIdentifier(token, result, settings) {
	const info = CommandSymbols.getCommandInfo(token.val);
	if (info === undefined || settings.arrows.has(token.val)) {
		result.append(`${token.val}`);
		if (isInCommandSequence(token))
			result.append(' :n - 1 :length * :lengthScaleFactor');
	}
	else {
		result.append(`${info.to}`);
	}
	result.append('\n');
};
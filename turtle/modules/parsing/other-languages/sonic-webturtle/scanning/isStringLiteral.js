import { isValidVariableName } from './isValidVariableName.js';
import { WebTurtleCommand } from '../WebTurtleCommand.js';

function isLetValue(tokens, index) {
	if (index < 2)
		return false;
	if (!isValidVariableName(tokens[index - 1].s))
		return false;
	if (tokens[index - 2].s.toLowerCase() !== 'let')
		return false;
	return true;
}

export function isStringLiteral(tokens, index, tokenString) {
	if (tokenString.startsWith('$') || tokenString.startsWith('^'))
		return false;
	if (isLetValue(tokens, index)) {
		const varName = tokens[index - 1].s;
		return varName.startsWith('$');
	}
	for (let offset = 1; offset <= Math.min(2, index); offset++) {
		const info = WebTurtleCommand.getCommandInfo(tokens[index - offset].s);
		if (info !== undefined) {
			const argCount = WebTurtleCommand.getArgCount(info);
			if (argCount < offset)
				break;
			if (WebTurtleCommand.couldArgBeStringLiteral(info, offset - 1))
				return true;
		}
	}
	return false;
};
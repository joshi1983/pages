import { Command } from '../../../Command.js';
import { isLoop } from '../../isLoop.js';
await Command.asyncInit();

const singleNotEnoughNames = new Set(['backward', 'forward',
'jumpBackward', 'jumpForward', 'jumpIn', 'jumpLeft',
'jumpOut', 'jumpRight', 'setPos']);

export { singleNotEnoughNames };

function getParents(tok) {
	const result = new Set();
	while (tok !== null) {
		result.add(tok);
		tok = tok.parentNode;
	}
	return result;
}

export function isSingleCallTokenEnoughForFillPath(token) {
	const info = Command.getCommandInfo(token.val);
	return !singleNotEnoughNames.has(info.primaryName);
};

export function isSingleCallEnoughForFillablePath(token, polyEndCall) {
	if (isSingleCallTokenEnoughForFillPath(token))
		return true;

	const polyEndParents = getParents(polyEndCall);

	// is token in a loop that ends before the corresponding polyEnd?
	let tok = token.parentNode;
	while (tok !== null && !polyEndParents.has(tok)) {
		if (isLoop(tok))
			return true;

		tok = tok.parentNode;
	}
	return false;
};
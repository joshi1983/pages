import { CommandSymbols } from '../../CommandSymbols.js';

export function processCommandSymbol(token, result) {
	const info = CommandSymbols.getCommandInfo(token.val);
	if (info !== undefined)
		result.append(info.to + '\n');
};
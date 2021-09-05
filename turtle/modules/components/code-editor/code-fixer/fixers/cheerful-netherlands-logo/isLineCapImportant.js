import { Command } from
'../../../../../parsing/Command.js';

export function isLineCapImportant(scanTokens) {
	for (const token of scanTokens) {
		const info = Command.getCommandInfo(token.s);
		if (info !== undefined) {
			if (info.searchKeywords !== undefined &&
			info.searchKeywords.indexOf('path') !== -1)
				return true;
		}
	}
	return false;
};
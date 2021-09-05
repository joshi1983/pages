import { isPrescanCommand } from '../isPrescanCommand.js';

export function removePrescanCommands(scanTokens) {
	for (let i = 0; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		if (isPrescanCommand(token.s)) {
			scanTokens.splice(i, 1);
			i--;// continue the replacement at the same index.
		}
		else if (i < scanTokens.length - 1) {
			const next = scanTokens[i + 1];
			if (next.lineIndex === token.lineIndex && isPrescanCommand(token.s + next.s)) {
				scanTokens.splice(i, 2);
				i--;// continue the replacement at the same index.
			}
		}
	}
};
import { Logo3DCommands } from
'../Logo3DCommands.js';

export function renameCommandsToWebLogo(tokens) {
	for (let i = 0; i < tokens.length;i++) {
		const token = tokens[i];
		const info = Logo3DCommands.getCommandInfo(token.s);
		if (info !== undefined && info.to !== undefined) {
			token.s = info.to;
		}
	};
};
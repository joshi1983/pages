import { Command } from '../../Command.js';
import { FileExtensions } from '../../../drawing-menu/download/FileExtensions.js';
import { validateFormat } from '../string-formats/validateFormat.js';
await Command.asyncInit();
const commandNamesUsingFormat = Command.getCommandsWithFormat().map(c => c.primaryName);

export function validateStringFormats(cachedParseTree, parseLogger) {
	const calls = cachedParseTree.getCommandCallsByNames(commandNamesUsingFormat);
	const tokenValues = cachedParseTree.getTokenValues();
	calls.forEach(function(callToken) {
		const info = Command.getCommandInfo(callToken.val);
		if (info.args.length === callToken.children.length) {
			for (let i = 0; i < info.args.length; i++) {
				const arg = info.args[i];
				if (arg.format !== undefined) {
					const token = callToken.children[i];
					const s = tokenValues.get(token);
					if (typeof s === 'string') {
						const msg = validateFormat(arg.format, s);
						if (msg !== undefined)
							parseLogger.error(msg, token, false);
						else if (arg.format === 'absoluteUrl' && s.startsWith('local') && info.primaryName === 'image') {
							const fileExtension = FileExtensions.getFileExtensionFromFilename(s.substring('local://'.length));
							if (typeof fileExtension !== 'string')
								parseLogger.error(`Unable to get file extension from: ${s}`, token, false);
							else {
								const mime = FileExtensions.getMimeFromExtension(fileExtension);
								if (mime === undefined || !mime.startsWith('image'))
									parseLogger.error(`The file extension "${fileExtension}" is not associated with an image format but the image command requires an image URL`, token, false);
							}
						}
					}
				}
			}
		}
	});
};
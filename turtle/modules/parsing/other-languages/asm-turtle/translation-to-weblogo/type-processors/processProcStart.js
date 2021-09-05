import { processTokens } from './processTokens.js';

export function processProcStart(token, result, settings) {
	result.processCommentsUpToToken(token);
	result.trimRight();
	result.append('\n');
	if (token.children.length !== 0) {
		let fromName = token.children[0].val.toLowerCase();
		if (fromName.startsWith('@@'))
			fromName = fromName.substring(1);
		const newName = settings.procedureRenameMap.get(fromName);
		result.append(`to ${newName}\n`);
		processTokens(token.children, result, settings);
		result.append('\nend\n');
	}
	else {
		result.append(`;FIXME: Unable to translate proc instruction.  Expected at least 1 operand but found none`);
	}
};
import { getMakeCommandNameForToken } from '../helpers/getMakeCommandNameForToken.js';
import { mightBeDataValue } from
'../../../parsing/parse-tree-analysis/variable-data-types/mightBeDataValue.js';
import { ParseTreeTokenType } from '../../../ParseTreeTokenType.js';
import { translateRead } from '../helpers/translateRead.js';
import { translateAssignStart } from '../helpers/translateAssignStart.js';

function shouldUseSwapCommand(args) {
	return args.length === 2 &&
		args[0].type === ParseTreeTokenType.IDENTIFIER &&
		args[1].type === ParseTreeTokenType.IDENTIFIER;
}

export function swap(token, result, options) {
	result.processCommentsUpToToken(token);
	const argList = token.children[1];
	const ch = argList.children.filter(mightBeDataValue);
	if (shouldUseSwapCommand(ch)) {
		result.append('\nswap "' + ch.map(t => options.identifierRenameMap.get(t.val.toLowerCase())).join(' "') + '\n');
		return;
	}
	else if (ch.length === 2) {
		const makeCommand = getMakeCommandNameForToken(token);
		const tempVariableName = 'swapTempVariable';
		result.append(`\n${makeCommand} "${tempVariableName} `);
		translateRead(ch[0], result, options);
		translateAssignStart(ch[0], result, options);
		translateRead(ch[1], result, options);
		translateAssignStart(ch[1], result, options);
		result.append(` :${tempVariableName}\n`);
	}
};
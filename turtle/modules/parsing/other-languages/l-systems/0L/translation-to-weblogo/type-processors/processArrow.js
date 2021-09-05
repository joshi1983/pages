import { CommandSymbols } from '../../CommandSymbols.js';
import { ParseTreeTokenType } from
'../../ParseTreeTokenType.js';
import { processToken } from './processToken.js';

export function processArrow(token, result, settings) {
	const children = token.children;
	if (children.length === 0)
		return; // can't translate this arrow at all so let the translation be nothing.

	const firstChild = children[0];
	const commandSequence = children[1];
	result.processCommentsUpToToken(token);
	let ifCommand = 'if';
	const info = CommandSymbols.getCommandInfo(firstChild.val);
	if (info !== undefined)
		ifCommand = 'ifelse'; // important for things like 'F' which might have an associated Arrow/substitution rule.
	result.append(`\nto ${firstChild.val} :n :length
	${ifCommand} :n > 0 [\n`);

	if (commandSequence !== undefined) {
		const children = commandSequence.children;
		for (let i = 0; i < children.length; i++) {
			const commandSymbol = children[i];
			const next = children[i + 1];
			if (next !== undefined && next.type === ParseTreeTokenType.NUMBER_LITERAL &&
			next.val.indexOf('.') === -1) {
				const repeatCount = parseInt(next.val);
				for (let i = 0; i < repeatCount; i++) {
					processToken(commandSymbol, result, settings);
				}
			}
			else
				processToken(commandSymbol, result, settings);
		}
	}
	if (info !== undefined) {
		result.append('\n] [\n' + info.to);
	}

	result.append('\n]\nend\n');
};
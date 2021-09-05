import { getArgCount } from '../../../generic-parsing-utilities/getArgCount.js';
import { moveArgsForParameterizedGroup } from
'../../../../components/code-editor/code-fixer/fixers/helpers/moveArgsForParameterizedGroup.js';
import { ParseTreeToken } from
'../../../ParseTreeToken.js';
import { ParseTreeTokenType } from
'../../../ParseTreeTokenType.js';

/*
migrationData should be a migration data object for
migrating to WebLogo from code that was only 
partly translated to WebLogo.
migrationData.commands that have applicableForQBasicFixer true
will be renamed in this fixer.
*/
export function renameCommandsFixer(migrationData) {
	const commandsMap = new Map();
	for (const commandInfo of migrationData.commands) {
		if (commandInfo.applicableForQBasicFixer) {
			const names = [commandInfo.primaryName.toLowerCase()];
			for (const name of names) {
				commandsMap.set(name, commandInfo);
			}
		}
	}

	function isOfInterest(token) {
		return commandsMap.has(token.val.toLowerCase());
	}

	return function(cachedParseTree, fixLogger) {
		const tokens = cachedParseTree.getTokensByType(
			ParseTreeTokenType.LEAF).filter(isOfInterest);
		tokens.forEach(function(token) {
			const oldName = token.val;
			const info = commandsMap.get(token.val.toLowerCase());
			const newName = info.to;
			token.val = newName;
			if (info.wrapAllParametersWithSquareBrackets === true) {
				const expectedArgCount = getArgCount(info, token);
				moveArgsForParameterizedGroup(token, expectedArgCount);
				const children = token.children;
				let child = children[0];
				let lastChild = children[children.length - 1];
				if (child === undefined) {
					// very rare case but hangle it gracefully anyway.
					// We don't want to throw an error if no children get moved.
					child = {'lineIndex': token.lineIndex, 'colIndex': token.colIndex + 1};
					lastChild = child;
				}
				const listToken = new ParseTreeToken(null, null,
				child.lineIndex, child.colIndex, ParseTreeTokenType.LIST);
				const openBracket = new ParseTreeToken('[', null,
				child.lineIndex, Math.max(0, child.colIndex - 1), ParseTreeTokenType.LEAF);
				const closeBracket = new ParseTreeToken(']', null,
				lastChild.lineIndex, lastChild.colIndex + 1, ParseTreeTokenType.LEAF);
				listToken.appendChild(openBracket);
				while (token.children.length !== 0) {
					const tok = token.children[0];
					tok.remove();
					listToken.appendChild(tok);
				}

				listToken.appendChild(closeBracket);
				token.appendChild(listToken);
				cachedParseTree.tokensAdded([listToken, openBracket, closeBracket]);
			}
			fixLogger.log(`Renamed ${oldName} to ${newName}`, token);
		});
	};
};
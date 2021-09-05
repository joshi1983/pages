import { addSpaceAfterPlusInNumberLiterals } from
'./addSpaceAfterPlusInNumberLiterals.js';
import { isAfterOrSame } from
'../../../../../parsing/generic-parsing-utilities/isAfterOrSame.js';
import { LogoScanner } from
'../../../../../parsing/LogoScanner.js';
import { processRemoveInMigrationScanTokens } from
'./processRemoveInMigrationScanTokens.js';
import { StringBuffer } from
'../../../../../StringBuffer.js';
import { stringValueToWebLogoStringLiteral  } from
'../../../../../parsing/generic-parsing-utilities/stringValueToWebLogoStringLiteral.js';
import { Token } from
'../../../../../parsing/Token.js';

export function removeSingleLineCommentsWithSymbol(code, symbol, longStringSymbol) {
	const comments = [];
	const resultCode = new StringBuffer();
	let colIndex = 0, lineIndex = 0;
	for (let i = 0; i < code.length + 1 - symbol.length; i++) {
		if (code[i] === longStringSymbol) {
			const startIndex = i + 1;
			for (i++; i < code.length; i++) {
				const ch = code[i];
				if (ch === longStringSymbol) {
					break;
				}
			}
			resultCode.append(stringValueToWebLogoStringLiteral(code.substring(startIndex, i)));

		}
		else {
			const comparableSubstring = code.substring(i, i + symbol.length);
			if (comparableSubstring === symbol) {
				const index = code.indexOf('\n', i);
				let s;
				if (index === -1) {
					s = code.substring(i);
					i = code.length;
				}
				else {
					s = code.substring(i, index);
					i = index - 1;
				}
				colIndex += s.length - 1;
				const commentToken = new Token(s, colIndex, lineIndex);
				comments.push(commentToken);
			}
			else if (comparableSubstring[0] === '\n') {
				resultCode.append('\n');
				colIndex = 0;
				lineIndex++;
			}
			else {
				resultCode.append(code[i]);
				colIndex++;
			}
		}
	}
	return [resultCode.toString(), comments];
};

function getCommandsInfoMap(migrationInfo, commandNameMap) {
	if (commandNameMap === undefined)
		commandNameMap = new Map();
	const commandInfoMap = new Map();
	migrationInfo.commands.forEach(function(commandInfo) {
		let fromNames = [commandInfo.primaryName];
		if (commandInfo.names !== undefined)
			fromNames.push(...commandInfo.names);
		if (migrationInfo.caseSensitiveCommandNames !== true)
			fromNames = fromNames.map(n => n.toLowerCase());
		let to;
		if (commandInfo.to !== undefined)
			to = commandInfo.to;
		else if (commandInfo.migrateToCode !== undefined &&
		scansAs1Token(commandInfo.migrateToCode))
			to = commandInfo.migrateToCode;
		else if (commandInfo.toProc !== undefined)
			to = commandInfo.toProc;
		if (to !== undefined) {
			for (const fromName of fromNames) {
				commandNameMap.set(fromName, to);
			}
		}
		for (const fromName of fromNames) {
			commandInfoMap.set(fromName, commandInfo);
		}
	});
	return commandInfoMap;
}

function processCommandNames(tokens, migrationInfo) {
	if (typeof migrationInfo !== 'object')
		throw new Error(`migrationInfo must be an object but found ${migrationInfo}`);
	if (!(migrationInfo.commands instanceof Array))
		throw new Error(`migrationInfo.commands must be an Array but found ${migrationInfo.commands}`);

	const commandNameMap = new Map();
	const commandInfoMap = getCommandsInfoMap(migrationInfo, commandNameMap);
	if (migrationInfo.keywords !== undefined)
		migrationInfo.keywords.forEach(function(keywordInfo) {
			let from = keywordInfo.from;
			if (from !== undefined && migrationInfo.caseSensitiveCommandNames !== true)
				from = from.toLowerCase();
			let to = keywordInfo.toSymbol;
			if (keywordInfo.to !== undefined)
				to = keywordInfo.to;
			if (from !== undefined && to !== undefined) {
				commandNameMap.set(from, to);
			}
		});
	const lineBreakActions = [];
	function processLineBreakActions(i) {
		if (lineBreakActions.length === 0)
			return;
		const lineIndex = tokens[i - 1].lineIndex;
		let colIndex = tokens[i - 1].colIndex + 1;
		const newTokens = [];
		// process the line break actions.
		for (const action of lineBreakActions) {
			newTokens.push(new Token(action, colIndex, lineIndex));
			colIndex += 2;
		}
		tokens.splice(i, 0, ...newTokens);
		i += newTokens.length;
		lineBreakActions.length = 0;
		return i;
	}
	for (let i = 0; i < tokens.length; i++) {
		const token = tokens[i];
		if (i > 0 && lineBreakActions.length !== 0 &&
		token.lineIndex !== tokens[i - 1].lineIndex) {
			i = processLineBreakActions(i);
		}
		let name = token.s;
		if (migrationInfo.caseSensitiveCommandNames !== true)
			name = name.toLowerCase();
		const toName = commandNameMap.get(name);
		if (toName !== undefined) {
			token.s = toName;
		}
		const info = commandInfoMap.get(name);
		if (info !== undefined) {
			if (info.migrateNewSymbolAtNextLineBreak !== undefined) {
				lineBreakActions.push(info.migrateNewSymbolAtNextLineBreak);
			}
		}
	}
	processLineBreakActions(tokens.length);
}

function scansAs1Token(s) {
	const tokens = LogoScanner.scan(s);
	return tokens.length === 1;
}

export function scanWithMigration(code, migrationInfo) {
	let comments = [];
	let singleLineCommentSymbol = ';';
	if (migrationInfo.singleLineCommentSymbol !== undefined) {
		singleLineCommentSymbol = migrationInfo.singleLineCommentSymbol;
	}
	[code, comments] = removeSingleLineCommentsWithSymbol(code,
		singleLineCommentSymbol, migrationInfo.longStringSymbol);

	// convert the comments to use WebLogo's single line comment prefix.
	comments.forEach(function(comment) {
		comment.s = ';' + comment.s.substring(singleLineCommentSymbol.length);
	});
	const webLogoTokens = LogoScanner.scan(code);
	processCommandNames(webLogoTokens, migrationInfo);
	processRemoveInMigrationScanTokens(webLogoTokens, migrationInfo, getCommandsInfoMap(migrationInfo));
	let commentIndex = 0;
	let i;
	const result = [];
	for (i = 0; i < webLogoTokens.length &&
	commentIndex < comments.length; i++) {
		const webLogoToken = webLogoTokens[i];
		while (commentIndex < comments.length &&
		!isAfterOrSame(comments[commentIndex], webLogoToken)) {
			result.push(comments[commentIndex++]);
		}
		result.push(webLogoToken);
	}
	for (;commentIndex < comments.length; commentIndex++)
		result.push(comments[commentIndex]);
	for (; i < webLogoTokens.length; i++) {
		result.push(webLogoTokens[i]);
	}
	if (migrationInfo.numberLiteralsCanStartWithPlus === false) 
		addSpaceAfterPlusInNumberLiterals(result);

	return result;
};
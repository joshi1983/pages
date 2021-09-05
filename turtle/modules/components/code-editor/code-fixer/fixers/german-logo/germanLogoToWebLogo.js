import { fetchJson } from
'../../../../../fetchJson.js';
import { FixLogger } from '../../FixLogger.js';
import { formatCode } from
'../../../format/formatCode.js';
import { getProceduresMap } from
'../../../../../parsing/parse-tree-analysis/getProceduresMap.js';
import { gotoToForeverFixer } from
'../helpers/gotoToForeverFixer.js';
import { ifElseFixer } from
'../ifElseFixer.js';
import { localFixer } from
'../localFixer.js';
import { LogoParser } from
'../../../../../parsing/LogoParser.js';
import { LogoScanner } from
'../../../../../parsing/LogoScanner.js';
import { ParseLogger } from
'../../../../../parsing/loggers/ParseLogger.js';
import { removeUnreferencedLabelsFixer } from
'../helpers/removeUnreferencedLabelsFixer.js';
import { runAllFixers } from '../../runAllFixers.js';
import { scanTokensToCode } from
'../helpers/scanTokensToCode.js';
import { Token } from
'../../../../../parsing/Token.js';
import { wrappedFix } from '../../wrappedFix.js';

const migrationInfo = await fetchJson('json/logo-migrations/GermanCommodoreLogo.json');

const fixers = [
	gotoToForeverFixer,
	ifElseFixer,
	localFixer,
	removeUnreferencedLabelsFixer
];
const fixer = runAllFixers(fixers);

const scanTokenReplacements = new Map([
	['gehe', 'goto'],
	['sonst', 'else']
]);
for (const commandInfo of migrationInfo.commands) {
	if (commandInfo.to !== undefined) {
		scanTokenReplacements.set(commandInfo.primaryName.toLowerCase(), commandInfo.to);
		if (commandInfo.names !== undefined) {
			for (const name of commandInfo.names) {
				scanTokenReplacements.set(name.toLowerCase(), commandInfo.to);
			}
		}
	}
}
for (const keywordInfo of migrationInfo.keywords) {
	let to;
	if (keywordInfo.to !== undefined)
		to = keywordInfo.to;
	if (keywordInfo.toSymbol !== undefined)
		to = keywordInfo.toSymbol;
	if (to !== undefined)
		scanTokenReplacements.set(keywordInfo.from.toLowerCase(), to);
}

function processScanReplacements(tokens) {
	for (let i = 0; i < tokens.length; i++) {
		const tok = tokens[i];
		const newS = scanTokenReplacements.get(tok.s.toLowerCase());
		if (newS === undefined) {
			const next = tokens[i + 1];
			if (tok.s.toLowerCase() === 'seize' &&
			next !== undefined &&
			next.s[0] === '"') {
				// seize is likely a misspelling of setze so translate to make as would happen with setze.
				newS = 'make';
			}
		}
		if (newS !== undefined) {
			tok.s = newS;
			if (newS === '[') {
				let afterToken;
				let colIndex = 0, lineIndex = 0;
				let afterIndex;
				for (afterIndex = i + 1; afterIndex < tokens.length; afterIndex++) {
					afterToken = tokens[afterIndex];
					if (afterToken.lineIndex > tok.lineIndex) {	
						break;
					}
					if (afterToken.s.toLowerCase() === 'sonst') {
						// German word sonst translates to 'else' in English.
						const closing = new Token(']', afterToken.colIndex - 1, afterToken.lineIndex);
						tokens.splice(afterIndex, 0, closing);
						afterToken.s = '[';
					}
					colIndex = afterToken.colIndex;
					lineIndex = afterToken.lineIndex;
				}
				const newToken = new Token(']', 0, 0);
				if (afterToken !== undefined && afterToken.lineIndex > tok.lineIndex) {
					if (afterToken.colIndex > 0 || afterToken.lineIndex === 0) {
						newToken.lineIndex = afterToken.lineIndex;
						newToken.colIndex = afterToken.colIndex - 1;
					}
					else {
						newToken.lineIndex = afterToken.lineIndex - 1;
						newToken.colIndex = colIndex + 1;
					}
				}
				else {
					newToken.lineIndex = lineIndex + 1;
					newToken.colIndex = colIndex + 1;
				}
				tokens.splice(afterIndex, 0, newToken);
			}
		}
	}
}

export function germanLogoToWebLogo(code) {
	const tempParseLogger = new ParseLogger();
	const scanTokens = LogoScanner.scan(code, tempParseLogger);
	processScanReplacements(scanTokens);
	let tree = LogoParser.getParseTree(scanTokens, tempParseLogger);
	code = scanTokensToCode(scanTokens);
	if (tree === undefined)
		return code; // the code is unfixable if it can't be parsed.

	const fixLogger = new FixLogger(tempParseLogger);
	const proceduresMap = getProceduresMap(tree);
	code = wrappedFix(code, fixer, fixLogger, proceduresMap, tree);
	return formatCode(code, fixLogger);
};
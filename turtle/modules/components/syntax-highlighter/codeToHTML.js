import { analyzeCodeQuality } from '../../parsing/parse-tree-analysis/validation/analyzeCodeQuality.js';
import { BufferedParseLogger } from '../../parsing/loggers/BufferedParseLogger.js';
import { escapeSpecialCharacters } from './escapeSpecialCharacters.js';
import { getCSSClassNameForParseToken } from './getCSSClassNameForParseToken.js';
import { getParseTokensSorted } from '../../parsing/getParseTokensSorted.js';
import { getProceduresMap } from '../../parsing/parse-tree-analysis/getProceduresMap.js';
import { getStringSourceForToken } from './getStringSourceForToken.js';
import { getURLMatches } from './getURLMatches.js';
import { LogoParser } from '../../parsing/LogoParser.js';
import { getTokenIndexes, singleTokenToString } from '../../parsing/parseTreeToCodeWithComments.js';
import { ParseTreeToken } from '../../parsing/ParseTreeToken.js';
import { StringBuffer } from '../../StringBuffer.js';

function processHyperlinks(s) {
	const urlMatches = getURLMatches(s);
	const result = new StringBuffer();
	let outIndex = 0;
	for (let i = 0; i < urlMatches.length; i++) {
		const match = urlMatches[i];
		if (outIndex <= match.startIndex - 1)
			result.append(escapeSpecialCharacters(s.substring(outIndex, match.startIndex)));
		result.append(`<a href="${escapeSpecialCharacters(match.s)}" target="_blank">${escapeSpecialCharacters(match.s)}</a>`);
		outIndex = match.startIndex + match.s.length;
	}
	if (outIndex < s.length)
		result.append(s.substring(outIndex));
	return result.toString();
}

function processComments(s) {
	const result = new StringBuffer();
	var lastOutputIndex;
	while (true) {
		const index = s.indexOf(';', lastOutputIndex);
		if (index === -1) {
			result.append(escapeSpecialCharacters(s.substring(lastOutputIndex)));
			break;
		}
		else {
			result.append(escapeSpecialCharacters(s.substring(lastOutputIndex, index)));
			const endOfCommentIndex = s.indexOf('\n', index);
			if (endOfCommentIndex !== -1) {
				result.append(`<span class="comment">${processHyperlinks(s.substring(index, endOfCommentIndex))}</span>`);
				lastOutputIndex = endOfCommentIndex;
			}
			else {
				result.append(`<span class="comment">${processHyperlinks(s.substring(index))}</span>`);
				break;
			}
		}
	}
	return result.toString();
}

export function codeToHTML(code, tree, parseMessages, idPrefix) {
	if (typeof code !== 'string')
		throw new Error('code must be a string.  Not: ' + code);
	if (tree !== undefined && !(tree instanceof ParseTreeToken))
		throw new Error('tree must either be undefined or a ParseTreeToken');
	if (parseMessages !== undefined && !(parseMessages instanceof Array))
		throw new Error('parseMessages must either be undefined or an Array');
	if (typeof idPrefix !== 'string')
		throw new Error('idPrefix must be a string.  Not: ' + idPrefix);
	let parseLogger;
	if (tree === undefined || parseMessages === undefined)
		parseLogger = new BufferedParseLogger();
	if (tree === undefined) {
		tree = LogoParser.getParseTree(code, parseLogger);
	}
	if (tree !== undefined && parseMessages === undefined) {
		const proceduresMap = getProceduresMap(tree);
		if (!parseLogger.hasLoggedErrors())
			analyzeCodeQuality(tree, parseLogger, proceduresMap, new Map());
		parseMessages = parseLogger.getMessages();
	}
	if (tree === undefined) {
		return undefined; // indicate unable to get HTML.
	}
	else {
		const sortedTokens = ParseTreeToken.flatten(tree).filter(
			t => t.val !== null &&
			singleTokenToString(t) !== null &&
			singleTokenToString(t) !== '' &&
			getCSSClassNameForParseToken(t) !== undefined);
		getParseTokensSorted(sortedTokens);
		const tokenIndexes = getTokenIndexes(sortedTokens, code);
		let lastOutputIndex = 0;
		const result = new StringBuffer();
		for (let i = 0; i < sortedTokens.length; i++) {
			const token = sortedTokens[i];
			const index = tokenIndexes.get(token);
			const s = getStringSourceForToken(token, index, code);
			const tokenStartIndex = index - s.length + 1;
			const cssClassName = getCSSClassNameForParseToken(token);
			if (lastOutputIndex < tokenStartIndex) {
				result.append(processComments(code.substring(lastOutputIndex, tokenStartIndex)));
			}
			result.append(`<span class="${cssClassName}" id="${idPrefix}-${token.lineIndex}-${token.colIndex}">${escapeSpecialCharacters(s)}</span>`);
			lastOutputIndex = index + 1;
		}
		if (lastOutputIndex < code.length)
			result.append(processComments(code.substring(lastOutputIndex)));
		return {
			'html': result.toString(),
			'tree': tree
		};
	}
};
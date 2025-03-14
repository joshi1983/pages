import { BufferedParseLogger } from '../../parsing/loggers/BufferedParseLogger.js';
import { escapeSpecialCharacters } from './escapeSpecialCharacters.js';
import { GeneralHTMLTokenProcessor } from './token-html-processors/GeneralHTMLTokenProcessor.js';
import { getCSSClassNameForParseToken } from './getCSSClassNameForParseToken.js';
import { getParseTokensSorted } from '../../parsing/parse-tree-token/getParseTokensSorted.js';
import { getStringSourceForToken } from './getStringSourceForToken.js';
import { LogoParser } from '../../parsing/LogoParser.js';
import { getTokenIndexes, singleTokenToString } from '../../parsing/parseTreeToCodeWithComments.js';
import { ParseTreeToken } from '../../parsing/ParseTreeToken.js';
import { processComments } from './processors/processComments.js';
import { StringBuffer } from '../../StringBuffer.js';

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
			if (GeneralHTMLTokenProcessor.isApplicableTo(token)) {
				result.append(GeneralHTMLTokenProcessor.toHTML(token));
			}
			else
				result.append(`<span class="${cssClassName}">${escapeSpecialCharacters(s)}</span>`);
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
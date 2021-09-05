import { parse } from '../../../../../modules/parsing/pov-ray/parse.js';
import { parseTreeToCodeWithComments } from
'../../../../../modules/parsing/generic-parsing-utilities/parseTreeToCodeWithComments.js';
import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';

function mightNeedSpacesBetween(token1, token2) {
	return true;
}

function singleTokenToString(token) {
	if (typeof token.val === 'string')
		return token.val;
	return '';
}

function isSpaceImportantForTokenPair(token1, token2) {
	if (token1.lineIndex !== token2.lineIndex)
		return true;
	if (token2.val !== null && token1.colIndex !== token2.colIndex - token2.val.length) {
		return true;
	}
	return false;
}

/*
Returns a map from every parse token to a character index
from the originalCode for the last character in each token.
*/
function getTokenIndexes(tokens, originalCode) {
	if (!(tokens instanceof Array))
		throw new Error('tokens must be an Array');
	const result = new Map();
	const lines = originalCode.split('\n');
	const lineCharIndexes = [];
	// stores character offsets for the first character from each line.
	let total = 0;
	lines.forEach(function(line) {
		lineCharIndexes.push(total);
		total += line.length + 1;
	});
	tokens.forEach(function(token) {
		let index = lineCharIndexes[token.lineIndex] + token.colIndex;
		result.set(token, index);
	});
	return result;
};

export function processFixerTests(cases, fixer, logger) {
	if (typeof fixer !== 'function')
		logger(`Expected fixer to be a function but got ${fixer}`);
	if (typeof logger !== 'function')
		logger(`Expected logger to be a function but got ${logger}`);
	cases.forEach(function(caseInfo, index) {
		const originalCode = caseInfo.in;
		const plogger = prefixWrapper(`Case ${index}, code=${originalCode}`, logger);
		const parseResult = parse(originalCode);
		fixer(parseResult.root);
		let expectedOut = caseInfo.out;
		if (caseInfo.changed === false && expectedOut === undefined)
			expectedOut = caseInfo.in;
		const fixedOutput = parseTreeToCodeWithComments(parseResult.root, 
		originalCode, mightNeedSpacesBetween, singleTokenToString, isSpaceImportantForTokenPair,
		getTokenIndexes).trim();
		if (fixedOutput !== expectedOut) {
			plogger(`Expected output to be '${expectedOut}' but got '${fixedOutput}'`);
		}
	});
};
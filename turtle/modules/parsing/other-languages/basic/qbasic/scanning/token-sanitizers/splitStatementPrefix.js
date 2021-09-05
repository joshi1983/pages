import { canBeIntegerLabel } from
'../canBeIntegerLabel.js';
import { genericProcessSplit } from './genericProcessSplit.js';
import { isComment } from
'../isComment.js';
import { isCompleteNumberLiteral } from
'../isCompleteNumberLiteral.js';
import { isIdentifier } from
'../isIdentifier.js';

const statements = [
	'clear', 'color', 'poke', ['print', -1], 'screen', ['then', 1], ['xor', 1]
];
function statementInfoToName(info) {
	if (typeof info === 'string')
		return info;
	return info[0];
}

function statementInfoToDirection(info) {
	if (typeof info === 'string')
		return 0;
	return info[info.length - 1];
}

function sToStatementInfo(s) {
	s = s.toLowerCase();
	for (const statementInfo of statements) {
		const prefix = statementInfoToName(statementInfo);
		if (s.startsWith(prefix)) {
			const after = s.substring(prefix.length);
			if (isCompleteNumberLiteral(after) ||
			after === '#')
				return statementInfo;
		}
	}
}

function getPrefixLength(s) {
	const statementInfo = sToStatementInfo(s);
	if (statementInfo !== undefined) {
		const prefix = statementInfoToName(statementInfo);
			return prefix.length;
	}
	return 0;
}

function isPrefixOfInterest(s) {
	return getPrefixLength(s) !== 0;
}

function split(s) {
	const len = getPrefixLength(s);
	return [s.substring(0, len), s.substring(len)];
}

function isDisqualifying(s) {
	s = s.toLowerCase();
	if (s === 'print')
		return true;
		// The QBASIC code "print then3423" can be understood better with 'then3423' as a single token.
	
	if (isComment(s) || isPrefixOfInterest(s) ||
	s === ',' || isIdentifier(s) ||
	isCompleteNumberLiteral(s))
		return false;
	if (canBeIntegerLabel(s))
		return false; // could be a label before the screen4... line
	return true;
}

export function splitStatementPrefix(scanTokens, customFunctionNames) {
	for (let i = 0; i < scanTokens.length; i++) {
		const tok = scanTokens[i];
		const statementInfo = sToStatementInfo(tok.s);
		if (statementInfo !== undefined) {
			const direction = statementInfoToDirection(statementInfo);
			genericProcessSplit(scanTokens, customFunctionNames, isPrefixOfInterest,
				split, i, direction, tok.lineIndex, isDisqualifying);
		}
	}
};
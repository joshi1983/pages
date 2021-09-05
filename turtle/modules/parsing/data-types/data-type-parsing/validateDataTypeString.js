import { DataTypes } from '../DataTypes.js';
import { isName } from './isName.js';
import { isNumber } from
'../../../isNumber.js';
import { scanDataTypeString } from './scanDataTypeString.js';
await DataTypes.asyncInit();

const recognizedNames = Array.from(DataTypes.typesMap.keys());
recognizedNames.push('minlen');
const recognizedNamesSet = new Set(recognizedNames);

function genericBracketBalanced(brackets, scanTokens) {
	const openBracket = brackets[0];
	const closeBracket = brackets[1];
	let balanceFactor = 0;
	for (let i = 0; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		if (token.s === openBracket)
			balanceFactor++;
		else if (token.s === closeBracket)
			balanceFactor--;
		if (balanceFactor < 0)
			return false;
	}
	return balanceFactor === 0;
}

function areTemplateBracketsBalanced(scanTokens) {
	return genericBracketBalanced('<>', scanTokens);
}

function areAttributeBracketsBalanced(scanTokens) {
	return genericBracketBalanced('()', scanTokens);
}

function nameAlwaysBeforeOpenBracket(scanTokens) {
	for (let i = 0; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		if (token.s === '<') {
			if (i === 0 || !isName(scanTokens[i - 1].s))
				return false;
		}
	}
	return true;
}

function nameOrTemplateAlwaysBeforeOpenBracket(scanTokens) {
	for (let i = 0; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		if (token.s === '(') {
			const prev = scanTokens[i - 1];
			if (i === 0 || (!isName(prev.s) && prev.s !== '>'))
				return false;
		}
	}
	return true;
}

function equalNotInAttributeExpression(scanTokens) {
	let balanceFactor = 0;
	for (let i = 0; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		if (token.s === '=' && balanceFactor === 0)
			return true;
		else if (token.s === '(')
			balanceFactor++;
		else if (token.s === ')')
			balanceFactor--;
		if (balanceFactor < 0)
			return false;
	}
	return false;
}

function improperPipeFound(scanTokens) {
	for (let i = 0; i < scanTokens.length; i++) {
		const token = scanTokens[i];
		if (token.s === '|') {
			if (i === 0 || i === scanTokens.length - 1)
				return true;
			const prev = scanTokens[i - 1];
			if (prev.s !== '>' && prev.s !== ')' && !isName(prev.s))
				return true;
		}
	}
	return false;
}

function isNumericString(s) {
	return isNumber(parseFloat(s));
}

export function validateDataTypeString(s) {
	if (s.indexOf(')(') !== -1)
		return 'An attributes expression must not be immediately after another attributes expression.  Found )(.';
	if (/\=[\)\>\(\<]/.test(s))
		return 'An = must be followed by a value.';
	if (/[\)\>\(\<]\=/.test(s))
		return 'An = must be after an attribute name.';
	if (s.indexOf('<>') !== -1)
		return '<> is not valid.  At least one data type must be specified in a template expression';
	if (s.indexOf('()') !== -1)
		return '() is not valid.  At least one attribute assignment must be specified in an attribute expression';
	if (/\s/.test(s))
		return 'No whitespaces allowed but found at least one';

	if (typeof s === 'string')
		s = scanDataTypeString(s);
	if (!areTemplateBracketsBalanced(s))
		return 'Template brackets(<>) are out of balance';
	if (!areAttributeBracketsBalanced(s))
		return 'Attribute brackets() are out of balance';
	if (!nameAlwaysBeforeOpenBracket(s))
		return '< found without preceding name';
	if (!nameOrTemplateAlwaysBeforeOpenBracket(s))
		return '( found without preceding name or template';
	if (equalNotInAttributeExpression(s))
		return '= must be in an attribute expression but found outside of any';
	if (improperPipeFound(s))
		return 'A | was found in an unexpected place';
	const unrecognizedNames = s.filter(t => isName(t.s) &&
		!recognizedNamesSet.has(t.s) &&
		!isNumericString(t.s)).
		map(t => t.s);
	if (unrecognizedNames.length !== 0) {
		return `Unrecognized data type or attribute name(s) found: ${unrecognizedNames.join(', ')}. `+
		`The recognized names are: ${recognizedNames.join(', ')}`;
	}
};
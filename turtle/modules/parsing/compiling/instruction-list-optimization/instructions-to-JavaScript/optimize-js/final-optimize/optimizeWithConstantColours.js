import { AlphaColour } from
'../../../../../../AlphaColour.js';
import { convertToAlphaColour } from
'../../../../../execution/instructions/data-type-converters/convertToAlphaColour.js';
import { convertToAlphaColourOrTransparent } from
'../../../../../execution/instructions/data-type-converters/convertToAlphaColourOrTransparent.js';
import { convertToColour } from
'../../../../../execution/instructions/data-type-converters/convertToColour.js';
import { convertToColourOrTransparent } from
'../../../../../execution/instructions/data-type-converters/convertToColourOrTransparent.js';
import { evaluateLiteralToken } from
'../../../../../js-parsing/evaluators/evaluateLiteralToken.js';
import { flatten } from '../../../../../generic-parsing-utilities/flatten.js';
import { isThisMethodCall } from '../token-classifiers/isThisMethodCall.js';
import { parse } from '../../../../../js-parsing/parse.js';
import { parseTreeTokensToCode } from
'../../../../../js-parsing/parseTreeTokensToCode.js';

const alphaColourConverterNames = new Set([
	'convertToAlphaColourOrTransparent',
]);
const notAlphaColourConverterNames = new Set([
	'convertToColourOrTransparent'
]);

const methodNamesOfInterest = new Map();
[convertToAlphaColour, convertToAlphaColourOrTransparent, convertToColour, convertToColourOrTransparent].
forEach(function(c) {
	methodNamesOfInterest.set(c.name, c);
});

function toValue(token) {
	const argList = token.parentNode.parentNode.parentNode.children[1];
	const valToken = argList.children[1];
	return evaluateLiteralToken(valToken);
}

function isOfInterest(token) {
	if (!methodNamesOfInterest.has(token.val))
		return false;
	if (!isThisMethodCall(token))
		return false;
	const val = toValue(token);
	return val !== undefined && val !== null;
}

function sanitizeColourForName(colourString) {
	colourString = colourString.toUpperCase();
	if (colourString.startsWith('#'))
		return colourString.substring(1);
	return colourString;
}

function getAvailableNameFrom(val, colour, isNameAvailable) {
	let nameSeed;
	if (typeof val === 'string') {
		nameSeed = 'COLOR_' + sanitizeColourForName(val);
	}
	else {
		if (colour instanceof AlphaColour)
			nameSeed = 'ALPHACOLOR_' + sanitizeColourForName(colour.to8DigitHTMLCode());
		else
			nameSeed = 'COLOR_' + sanitizeColourForName(colour.to6DigitHTMLCode());
	}
	if (isNameAvailable(nameSeed))
		return nameSeed;
	for (let i = 1; true; i++) {
		const name = nameSeed + i;
		if (isNameAvailable(name))
			return name;
	}
}

function isAlphaColourAcceptableTo(convertFunctionName) {
	if (notAlphaColourConverterNames.has(convertFunctionName))
		return false;
	return alphaColourConverterNames.has(convertFunctionName);
}

function convertToProperty(cacheMap, isNameAvailable, instruction) {
	return function(token) {
		const val = toValue(token);
		const f = methodNamesOfInterest.get(token.val);
		const colour = f(val);
		const colourString = colour.toString();
		let info;
		if (!cacheMap.has(colourString)) {
			info = {
				'colour': colour,
				'name': getAvailableNameFrom(val, colour, isNameAvailable)
			};
			cacheMap.set(colourString, info);
		}
		else {
			info = cacheMap.get(colourString);
			if (info.colour instanceof AlphaColour &&
			!isAlphaColourAcceptableTo(token.val)) {
				return false; // don't replace.
			}
		}
		const thisToken = token.parentNode.parentNode;
		token.val = info.name;
		thisToken.parentNode.parentNode.replaceChild(thisToken.parentNode, thisToken);
		instruction[info.name] = info.colour;
		return true;
	};
}

/*
This speeds up execution of the instruction by precalculating colours
so they don't get repeatedly calculated every time the instruction is executed.
*/
export function optimizeWithConstantColours(instruction) {
	const code = instruction.code;
	// Avoid parsing when it is quick to show that parsing won't help.
	if (code.indexOf('convertToAlphaColour') === -1 &&
	code.indexOf('convertToColour') === -1)
		return;

	const parseResult = parse(code);
	const allTokens = flatten(parseResult.root);
	const ofInterest = allTokens.filter(isOfInterest);
	if (ofInterest.length === 0)
		return;
	const cacheMap = new Map();
	function isNameAvailable(name) {
		if (instruction[name] !== undefined)
			return false;
		for (const value of cacheMap.values()) {
			if (value.name === name)
				return false;
		}
		return true;
	}
	ofInterest.forEach(convertToProperty(cacheMap, isNameAvailable, instruction));
	const newCode= parseTreeTokensToCode(flatten(parseResult.root));
	instruction.setCode(newCode);
};
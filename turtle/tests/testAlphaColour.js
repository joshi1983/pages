import { AlphaColour } from '../modules/AlphaColour.js';
import { Colour } from '../modules/Colour.js';
import { DeepEquality } from '../modules/DeepEquality.js';
import { isNumber } from '../modules/isNumber.js';
import { prefixWrapper } from './helpers/prefixWrapper.js';
import { testInOutPairs } from './helpers/testInOutPairs.js';
import { Transparent } from '../modules/Transparent.js';
import { wrapAndCall } from './helpers/wrapAndCall.js';
await AlphaColour.asyncInit();
await Colour.asyncInit();

function validateAlphaColour(c, logger) {
	if (c.rgbArray.length !== 3)
		logger(`rgbArray.length expected to be 3 but got ${c.rgbArray.length}`);
	if (typeof c.alpha !== 'number')
		logger(`alpha expected to be a number but got ${c.alpha}`);
	const argbArray = c.toARGBArray();
	if (argbArray.length !== 4)
		logger(`Expected toARGBArray() to return an Array with length of 4 but got ${argbArray.length}`);
	else {
		for (let i = 0; i < 4; i++) {
			if (!isNumber(argbArray[i]))
				logger(`Expected argbArray[${i}] to be a number but got ${argbArray[i]}`);
		}
	}
}

function testAlphaColourConstructor(logger) {
	let c = new AlphaColour();
	c = new AlphaColour(1);
	validateAlphaColour(c, logger);
	c = new AlphaColour([255, 0, 0, 0]);
	validateAlphaColour(c, logger);
	c = new AlphaColour([0, 0, 0]);
	validateAlphaColour(c, logger);
	c = new AlphaColour('red');
	validateAlphaColour(c, logger);
	c = new AlphaColour('#12f');
	validateAlphaColour(c, logger);
	c = new AlphaColour('#123f');
	validateAlphaColour(c, logger);
	c = new AlphaColour('#1122ff');
	validateAlphaColour(c, logger);
	c = new AlphaColour('#112233ff');
	validateAlphaColour(c, logger);
	c = new AlphaColour(c); // copy constructor
	validateAlphaColour(c, logger);
}

function testCanBeInterprettedAsAlphaColour(logger) {
	const cases = [
		{'in': "red", "out": true},
		{'in': "#1234", "out": true},
		{'in': [1,2, 3, 4], "out": true},
		{'in': [1, 2, 3], "out": true},
		{'in': Transparent, "out": false},
		{'in': [1, 2], "out": false}
	];
	testInOutPairs(cases, AlphaColour.canBeInterprettedAsAlphaColour, logger);
}

function testEquals(logger) {
	const cases = [
		{'c1': new Colour('red'), 'c2': new AlphaColour('red'), 'out': true},
		{'c1': new Colour('blue'), 'c2': new AlphaColour('blue'), 'out': true},
		{'c1': new Colour('#fff'), 'c2': new AlphaColour('#fff'), 'out': true},
		{'c1': new Colour('#fff'), 'c2': new AlphaColour('#ffff'), 'out': true},
		{'c1': new AlphaColour('#efff'), 'c2': new AlphaColour('#efff'), 'out': true},
		{'c1': new AlphaColour('#dfff'), 'c2': new AlphaColour('#efff'), 'out': false},
		{'c1': new Colour('#fff'), 'c2': new AlphaColour('#efff'), 'out': false},
		{'c1': {}, 'c2': new AlphaColour('#efff'), 'out': false},
		{'c1': [], 'c2': new AlphaColour('#efff'), 'out': false},
		{'c1': null, 'c2': new AlphaColour('#efff'), 'out': false}
	];
	cases.forEach(function(caseInfo, index) {
		const result = caseInfo.c2.equals(caseInfo.c1);
		const plogger = prefixWrapper(`Case ${index}`, logger);
		if (result !== caseInfo.out)
			plogger(`Expected "${caseInfo.out}" but got "${result}"`);
	});
}

function testGetRGBAExpression(logger) {
	const cases = [
		{'in': '#1234', 'out': 'rgba(34,51,68, 0.06666666666666667)'}
	];
	testInOutPairs(cases, input => AlphaColour.getRGBAExpression(new AlphaColour(input)), logger);
}

function testGetSanitizationTips(logger) {
	const cases = [
		{'in': '#fff', 'out': false}, // already valid
		{'in': 'f', 'out': false}, // too invalid to give a tip for.
		{'in': '3fff', 'out': true}, // tip to add '#'.
		{'in': 'fff', 'out': true}, // tip to add '#'.
	];
	testInOutPairs(cases, input => AlphaColour.getSanitizationTips(input) !== undefined, logger);
}

function testIsTransparent(logger) {
	const cases = [
		{'in': new AlphaColour('#1234'), 'out': false},
		{'in': new AlphaColour('#0123'), 'out': true}
	];
	testInOutPairs(cases, AlphaColour.isTransparent, logger);
}

function testIsValidAlphaColourString(logger) {
	const cases = [
		{'in': 'red', 'out': false}, // valid rgb color but no alpha.
		{'in': '#123', 'out': false},// valid rgb color but no alpha.
		{'in': '#fff', 'out': false},// valid rgb color but no alpha.
		{'in': '#ffF', 'out': false},// valid rgb color but no alpha.
		{'in': '#1234', 'out': true},
		{'in': '#123f', 'out': true},
		{'in': '#11223344', 'out': true},
		{'in': '#1122334f', 'out': true},
		{'in': 'bla', 'out': false}, // matches no color name and if it did, it would still not have alpha.
		{'in': '#12', 'out': false}, // invalid length
		{'in': '#12345', 'out': false}, // invalid length
		{'in': 'bblluuee', 'out': false},
		{"in": "#blue", "out": false},
	];
	testInOutPairs(cases, AlphaColour.isValidAlphaColourString, logger);
}

function testIsValidRGBArray(logger) {
	const cases = [
		{'in': null, 'out': false},
		{'in': "", 'out': false},
		{'in': "123", 'out': false},
		{'in': "#123", 'out': false},
		{'in': [], 'out': false},
		{'in': [1], 'out': false},
		{'in': [1,2], 'out': false},
		{'in': [1,2,3,4,5], 'out': false},
		{'in': [NaN, 1, 2, 3], 'out': false},
		{'in': [1, 2, 3], 'out': true},
		{'in': [1, 2, 3, 4], 'out': true}
	];
	testInOutPairs(cases, AlphaColour.isValidRGBArray, logger);
}

function testTo8DigitHTMLCode(logger) {
	const cases = [
		{'in': 'red', 'out': '#FFFF0000'},
		{'in': '#0fff', 'out': '#00FFFFFF'},
		{'in': '#123', 'out': '#FF112233'},
		{'in': '#1234', 'out': '#11223344'},
		{'in': '#112233', 'out': '#FF112233'},
		{'in': '#11223344', 'out': '#11223344'},
	];
	testInOutPairs(cases, input => new AlphaColour(input).to8DigitHTMLCode(), logger);
}

function testToARGBArray(logger) {
	const cases = [
		{'in': [0, 0, 0], 'out': [255, 0, 0, 0]},
		{'in': 'red', 'out': [255, 255, 0, 0]},
		{'in': '#0fff', 'out': [0, 255, 255, 255]},
		{'in': '#123', 'out': [255, 17, 34, 51]},
		{'in': '#1234', 'out': [17, 34, 51, 68]},
		{'in': '#112233', 'out': [255, 17, 34, 51]},
		{'in': '#11223344', 'out': [17, 34, 51, 68]},
	];
	testInOutPairs(cases, input => new AlphaColour(input).toARGBArray(), logger);
}

function testVariousMethods(logger) {
	const c = new AlphaColour('black');
	const c2 = new Colour('black');
	if (AlphaColour.getOpacityPercentage(c) !== 100)
		logger(`getOpacityPercentage expected to return 100 but instead got ${AlphaColour.getOpacityPercentage(c)}`);
	if (AlphaColour.isOpaque(c) !== true)
		logger(`isOpaque expected to return true but instead got ${AlphaColour.isOpaque(c)}`);
	if (AlphaColour.isTransparent(c) !== false)
		logger(`isTransparent expected to return false but instead got ${AlphaColour.isTransparent(c)}`);
	if (c.isDark() !== true)
		logger(`AlphaColour expected to be dark but got ${c.isDark()}`);
}

export function testAlphaColour(logger) {
	wrapAndCall([
		testAlphaColourConstructor,
		testCanBeInterprettedAsAlphaColour,
		testEquals,
		testGetRGBAExpression,
		testGetSanitizationTips,
		testIsTransparent,
		testIsValidAlphaColourString,
		testIsValidRGBArray,
		testTo8DigitHTMLCode,
		testToARGBArray,
		testVariousMethods
	], logger);
}
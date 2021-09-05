import { Colour } from '../modules/Colour.js';
import { prefixWrapper } from './helpers/prefixWrapper.js';
import { fetchJson } from '../modules/fetchJson.js';
const colours = await fetchJson('json/colours.json');

function testColourBasics(logger) {
	var cases = [
		{'in': [0, 0, 0], 'out': '#000000', 'isDark': true},
		{'in': 'red', 'out': '#FF0000', 'isDark': true},
		{'in': 'Red', 'out': '#FF0000', 'isDark': true},
		{'in': 'reD ', 'out': '#FF0000', 'isDark': true},
		{'in': 'DarkBlue', 'out': '#00008B', 'isDark': true},
		{'in': 'yellow', 'out': '#FFFF00', 'isDark': false},
		{'in': '#dd0', 'out': '#DDDD00', 'isDark': false},
		{'in': '#880', 'out': '#888800', 'isDark': true},
	];
	cases.forEach(function(caseInfo) {
		var c = new Colour(caseInfo.in);
		var actual = c.to6DigitHTMLCode();
		if (caseInfo.out !== actual)
			logger('Expected ' + caseInfo.out + ' but got ' + actual);
		if (caseInfo.isDark !== c.isDark())
			logger('Expected isDark of ' + caseInfo.isDark + ' but got ' + c.isDark() + ' for input ' + caseInfo.in);
	});
}

function testColourDuplicates(logger) {
	const colourSet = new Set();
	colours.forEach(function(c, index) {
		var isNameOk = false;
		var isRgbOk = false;
		if (c.index !== undefined && c.index !== index)
			logger('When index is specified, it must equal the index in the array.  Expected ' + index + ' but got ' + c.index);
		if (typeof c.name !== 'string')
			logger('Expected colour name missing at index ' + index);
		else if (c.name.trim() !== c.name)
			logger('Colour name should not have any whitespaces at the beginning or end but some found in: ' + c.name);
		else
			isNameOk = true;

		if (!(c.rgb instanceof Array))
			logger('rgb missing or not an Array at index ' + index);
		else if (c.rgb.length !== 3)
			logger('rgb.length expected to be 3 but got ' + c.rgb.length);
		else
			isRgbOk = true;
		if (isNameOk && isRgbOk) {
			const key = c.name + JSON.stringify(c.rgb);
			if (colourSet.has(key))
				logger('Duplicate found for ' + key + ' at index ' + index);
			else
				colourSet.add(key);
		}
	});
}

function testColourEquals(logger) {
	if (new Colour('red').equals(null))
		logger('No colour should equal null');
	if (new Colour('red').equals(new Colour('black')))
		logger('red and black should not be equal colours');
	if (!(new Colour('red').equals(new Colour('red'))))
		logger('red and red should be equal colours');
}

function testIsValidHTMLColourCode(logger) {
	const cases = [
		{"in": null, "out": false},
		{"in": 1, "out": false},
		{"in": "", "out": false},
		{"in": "#", "out": false},
		{"in": "#1", "out": false},
		{"in": "#12", "out": false},
		{"in": "#123", "out": true},
		{"in": "#1234", "out": false},
		{"in": "#12345", "out": false},
		{"in": "#123456", "out": true},
		{"in": "#1234567", "out": false},
		{"in": "#a23456", "out": true},
		{"in": "#f23456", "out": true},
		{"in": "#g23456", "out": false},
		{"in": "#A23456", "out": true},
		{"in": "#dd0", "out": true},
		{"in": "#880", "out": true},
		{"in": "#blue", "out": false},
		{"in": "#red", "out": false},
	];
	cases.forEach(function(caseInfo) {
		const actualResult = Colour.isValidHTMLColourCode(caseInfo.in);
		if (actualResult !== caseInfo.out)
			logger('Expected Colour.isValidHTMLColourCode for ' + caseInfo.in + ' to return ' + caseInfo.out + ' but got ' + actualResult);
	});
}

function testIsValidColourString(logger) {
	const cases = [
		{"in": "red", "out": true},
		{"in": "bblluuee", "out": false},
		{"in": "#blue", "out": false},
	];
	cases.forEach(function(caseInfo) {
		const actualResult = Colour.isValidColourString(caseInfo.in);
		if (actualResult !== caseInfo.out)
			logger(`Expected Colour.isValidColourString for ${caseInfo.in} to return ${caseInfo.out} but got ${actualResult}`);
	});
}

function testSanitizationTips(logger) {
	const cases = [
		{'in': '123', 'out': 'Add # before your color code'},
		{'in': 'fff', 'out': 'Add # before your color code'},
		{'in': 'fFf', 'out': 'Add # before your color code'},
		{'in': '"#fFf', 'out': 'Remove extra quote at beginning of your color code'},
		{'in': '""#fFf', 'out': 'Remove extra quote at beginning of your color code'},
		{'in': '123123', 'out': 'Add # before your color code'},
		{'in': '##123', 'out': 'There should be at most 1 # and it can only be at the beginning so remove it elsewhere'},
		{'in': '#1#23', 'out': 'There should be at most 1 # and it can only be at the beginning so remove it elsewhere'},
	];
	cases.forEach(function(caseInfo) {
		const result = Colour.getSanitizationTips(caseInfo.in);
		if (result !== caseInfo.out)
			logger(`Expected "${caseInfo.out}" but got "${result}"`);
	});
}

export function testColour(logger) {
	testColourBasics(prefixWrapper('testColourBasics', logger));
	testColourDuplicates(prefixWrapper('testColourDuplicates', logger));
	testColourEquals(prefixWrapper('testColourEquals', logger));
	testIsValidColourString(prefixWrapper('testIsValidColourString', logger));
	testIsValidHTMLColourCode(prefixWrapper('testIsValidHTMLColourCode', logger));
	testSanitizationTips(prefixWrapper('testSanitizationTips', logger));
}
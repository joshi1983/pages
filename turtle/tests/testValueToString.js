import { Transparent } from '../modules/Transparent.js';
import { valueToString } from '../modules/valueToString.js';

function testGracefulCycleSerialization(logger) {
	const data = [1, 2, 3, 1];
	data.push(data);
	let s = valueToString(data);
	let expected = '[1 2 3 1 $$CYCLE$$]';
	if (s !== expected)
		logger('Expected to get ' + expected + ' but got ' + s);
	data.pop();
	s = valueToString(data);
	expected = '[1 2 3 1]';
	if (s !== expected)
		logger('Expected to get ' + expected + ' but got ' + s);
	const x = [4,5,6];
	data.push(x);
	s = valueToString(data);
	expected = '[1 2 3 1 [4 5 6]]';
	if (s !== expected)
		logger('Expected to get ' + expected + ' but got ' + s);
	data.push(x);
	s = valueToString(data);
	expected = '[1 2 3 1 [4 5 6] [4 5 6]]';
	if (s !== expected)
		logger('Expected to get ' + expected + ' but got ' + s);
	data.push(data);
	data.push(data);
	s = valueToString(data);
	expected = '[1 2 3 1 [4 5 6] [4 5 6] $$CYCLE$$ $$CYCLE$$]';
	if (s !== expected)
		logger('Expected to get ' + expected + ' but got ' + s);
}

function testVariousCases(logger) {
	const cases = [
		{"in": null, "out": "null"},
		{"in": "", "out": ""},
		{"in": true, "out": "true"},
		{"in": false, "out": "false"},
		{"in": [], "out": "[]"},
		{"in": [1, 2, 3], "out": "[1 2 3]"},
		{"in": 0, "out": "0"},
		{"in": 3.14, "out": "3.14"},
		{"in": 3.14159265, "out": "3.141593"},
		{"in": 59.9999999999, "out": "60"},
		{"in": 314159.265, "out": "314159.3"},
		{"in": Infinity, "out": "Infinity"},
		{"in": -Infinity, "out": "-Infinity"},
		{"in": 6.123233995736766e-15, "out": "0"},
		{"in": 6.123233995736766e-14, "out": "0"},
		{"in": 6.123233995736766e-13, "out": "0"},
		{"in": 6.123233995736766e-10, "out": "0"},
		{"in": [6.123233995736766e-15], "out": "[0]"},
		{"in": Transparent, "out": "transparent"},
	];
	const mapCase = new Map();
	mapCase.set('x', 5);
	cases.push({'in': mapCase, 'out': '[x:=5]'});
	cases.forEach(function(caseInfo) {
		if (valueToString(caseInfo.in) !== caseInfo.out)
			logger('When passing ' + JSON.stringify(caseInfo.in) + ' to valueString, expected ' + caseInfo.out + ' but got ' + valueToString(caseInfo.in));
	});
}

export function testValueToString(logger) {
	testGracefulCycleSerialization(logger);
	testVariousCases(logger);
};
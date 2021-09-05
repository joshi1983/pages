import { asyncInit, parse } from '../../../modules/parsing/python-parsing/parse.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';

export async function testParseInvalidPythonCode(logger) {
	await asyncInit();
	const cases = [
	'import turtle\nbla',
	'bla(',
	'bla)',
	'x=',
	'x=#',
	`print(side % (reverseDirection * 2) == 0)`,
`angle 119
side = 0
limit - 600
shape(angle, side, limit)`,
`import turtle
import random

angle 119
side = 0
limit - 600
shape(angle, side, limit)`
	];
	cases.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		/*
		Usually the Python will be valid.
		We just want to verify that no 
		JavaScript errors or exceptions are thrown
		if the code isn't valid.
		*/
		const result = parse(code);
	});
};
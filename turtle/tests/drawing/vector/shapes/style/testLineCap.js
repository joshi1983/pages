import { LineCap } from '../../../../../modules/drawing/vector/shapes/style/LineCap.js';
import { wrapAndCall } from '../../../../helpers/wrapAndCall.js';

function testGetNameFor(logger) {
	const numbers = [0, 1, 2];
	numbers.forEach(function(lineCapNum) {
		const result = LineCap.getNameFor(lineCapNum);
		if (typeof result !== 'string')
			logger(`Expected LineCap.getNameFor to return a string for ${lineCapNum} but got ${result}`);
	});
}

function testGetNames(logger) {
	const result = LineCap.getNames();
	if (!(result instanceof Array))
		logger(`LineCap.getNames() expected to return an Array but got ${result}`);
	else {
		if (result.some(val => typeof val !== 'string'))
			logger('string expected in every element but found something else in Array');
	}
}

function testParse(logger) {
	const names = ['butt', 'square', 'round'];
	names.forEach(function(name) {
		const result = LineCap.parse(name);
		if (!Number.isInteger(result))
			logger(`Expected LineCap.parse to return an integer for ${name} but got ${result}`);
	});
}

export function testLineCap(logger) {
	wrapAndCall([
		testGetNameFor,
		testGetNames,
		testParse
	], logger);
};
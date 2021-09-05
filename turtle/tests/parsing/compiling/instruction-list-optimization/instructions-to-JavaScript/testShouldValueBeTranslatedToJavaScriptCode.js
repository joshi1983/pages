import { AlphaColour } from
'../../../../../modules/AlphaColour.js';
import { Colour } from
'../../../../../modules/Colour.js';
import { duplicate } from
'../../../../../modules/command-groups/helpers/duplicate.js';
import { shouldValueBeTranslatedToJavaScriptCode } from
'../../../../../modules/parsing/compiling/instruction-list-optimization/instructions-to-JavaScript/shouldValueBeTranslatedToJavaScriptCode.js';
import { testInOutPairs } from
'../../../../helpers/testInOutPairs.js';
import { Transparent } from
'../../../../../modules/Transparent.js';

function getArrayContainingCycle() {
	const result = [];
	result.push(result);
	return result;
}

function getLargeSet() {
	const result = new Set();
	for (let i = 0; i < 100; i++) {
		result.add(i);
	}
	return result;
}

function getLargeMap() {
	const result = new Map();
	for (let i = 0; i < 100; i++) {
		result.set(i, '' + i);
	}
	return result;
}

function getMapContainingCycle() {
	const result = new Map();
	result.set('x', result);
	return result;
}

function getSetContainingCycle() {
	const result = new Set();
	result.add(result);
	return result;
}

export function testShouldValueBeTranslatedToJavaScriptCode(logger) {
	const cases = [
		{'in': duplicate(1, 100), 'out': false}, // too many elements
		{'in': getLargeSet(), 'out': false},
		{'in': getLargeMap(), 'out': false},
		{'in': getArrayContainingCycle(), 'out': false},
		{'in': getMapContainingCycle(), 'out': false},
		{'in': getSetContainingCycle(), 'out': false},
		{'in': undefined, 'out': true},
		{'in': true, 'out': true},
		{'in': false, 'out': true},
		{'in': null, 'out': true},
		{'in': new Map(), 'out': true},
		{'in': new Set(), 'out': true},
		{'in': [], 'out': true},
		{'in': [1,2,3], 'out': true},
		{'in': Transparent, 'out': true},
		{'in': new Colour(0, 0, 0), 'out': true},
		{'in': new AlphaColour(0, 0, 0), 'out': true},
	];
	testInOutPairs(cases, shouldValueBeTranslatedToJavaScriptCode, logger);
};
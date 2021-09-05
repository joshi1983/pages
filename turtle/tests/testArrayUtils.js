import { ArrayUtils } from '../modules/ArrayUtils.js';
import { prefixWrapper } from './helpers/prefixWrapper.js';
import { testInOutPairs } from './helpers/testInOutPairs.js';
import { wrapAndCall } from './helpers/wrapAndCall.js';

function testInsertArray(logger) {
	const a = [];
	ArrayUtils.insertArray(a, 0, [1, 2]);
	if (a.length !== 2)
		logger(`Expected length to be 2 but got ${a.length}`);
	if (a[0] !== 1)
		logger(`Expected [0] to be 1 but got ${a[0]}`);
	if (a[1] !== 2)
		logger(`Expected [1] to be 2 but got ${a[1]}`);
	ArrayUtils.insertArray(a, 1, []); 
	// a bit weird but verify there are no JavaScript errors.
	if (a.length !== 2)
		logger(`Expected length to still be 2 but got ${a.length}`);
	ArrayUtils.insertArray(a, 1, ["hi"]); 
	if (a.length !== 3)
		logger(`Expected length to still be 3 but got ${a.length}`);
	if (a[1] !== 'hi')
		logger(`Expected [1] to be hi but got ${a[1]}`);
	if (a[2] !== 2)
		logger(`Expected [2] to be 2 but got ${a[2]}`);
	if (a[0] !== 1)
		logger(`Expected [0] to be 1 but got ${a[0]}`);
	ArrayUtils.insertArray(a, 2, ["a", "b"]);
	if (a.length !== 5)
		logger(`Expected length to still be 5 but got ${a.length}`);
	if (a[4] !== 2)
		logger(`Expected [4] to be 2 but got ${a[4]}`);
	if (a[3] !== 'b')
		logger(`Expected [3] to be 'b' but got ${a[3]}`);
	if (a[2] !== 'a')
		logger(`Expected [2] to be 'a' but got ${a[2]}`);
}

function testPushAll(logger) {
	const cases = [{
		'a': [], 'fromArray': [], 'out': [],
	},{
		'a': [], 'fromArray': [1], 'out': [1],
	},{
		'a': [1], 'fromArray': [], 'out': [1],
	},{
		'a': [1], 'fromArray': [2], 'out': [1,2],
	}];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		ArrayUtils.pushAll(caseInfo.a, caseInfo.fromArray);
		if (caseInfo.a.length !== caseInfo.out.length)
			plogger(`Expected the length to become ${caseInfo.out.length} but got ${caseInfo.a.length}`);
		else {
			for (let i = 0; i < caseInfo.out.length; i++) {
				if (caseInfo.a[i] !== caseInfo.out[i])
					plogger(`Expected value at [${i}] to be ${caseInfo.out[i]} but got ${caseInfo.a[i]}`);
			}
		}
	});
}

function testRemove(logger) {
	const cases = [
		{'in': [1, 2, 3], 'out': [1, 2, 3], 'isKept': function() {return true;}},
		{'in': [1, 2, 3], 'out': [2], 'isKept': function(val) {return val === 2;}},
		{'in': [1, 2, 3], 'out': [1, 3], 'isKept': function(val) {return val % 2 === 1;}},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		ArrayUtils.remove(caseInfo.in, caseInfo.isKept);
		if (caseInfo.in.length !== caseInfo.out.length)
			plogger(`Expected the length to become ${caseInfo.out.length} but got ${caseInfo.in.length}`);
		else {
			for (let i = 0; i < caseInfo.out.length; i++) {
				if (caseInfo.in[i] !== caseInfo.out[i])
					plogger(`Expected value at [${i}] to be ${caseInfo.out[i]} but got ${caseInfo.in[i]}`);
			}
		}
	});
}

function testRepeat(logger) {
	const cases = [
		{'inArgs': [[1, 2], 0], 'out': []},
		{'inArgs': [[1, 2], 1], 'out': [1,2]},
		{'inArgs': [[1, 2], 2], 'out': [1,2,1,2]},
	];
	testInOutPairs(cases, ArrayUtils.repeat, logger);
}

function testRotateLeft(logger) {
	const cases = [
		{'inArgs': [[1, 2], 0], 'out': [1,2]},
		{'inArgs': [[1, 2], 1], 'out': [2,1]},
		{'inArgs': [[1, 2], 2], 'out': [1,2]},
		{'inArgs': [[1, 2,3], 1], 'out': [2,3,1]},
		{'inArgs': [[1, 2,3], 2], 'out': [3,1,2]},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		ArrayUtils.rotateLeft(...caseInfo.inArgs);
		if (caseInfo.inArgs[0].length !== caseInfo.out.length)
			plogger(`Array length expected to be ${caseInfo.out.length} but got ${caseInfo.inArgs[0].length}.  The array is: ${caseInfo.inArgs[0].join(',')}`);
		else {
			const a = caseInfo.inArgs[0];
			for (let i = 0; i < a.length; i++) {
				if (a[i] !== caseInfo.out[i])
					plogger(`Expected a[${i}] to be ${caseInfo.out[i]} but got ${a[i]}`);
			}
		}
	});
}

function testRotateRight(logger) {
	const cases = [
		{'inArgs': [[1, 2], 0], 'out': [1,2]},
		{'inArgs': [[1, 2], 1], 'out': [2,1]},
		{'inArgs': [[1, 2], 2], 'out': [1,2]},
		{'inArgs': [[1, 2,3], 1], 'out': [3, 1, 2]},
		{'inArgs': [[1, 2,3], 2], 'out': [2, 3, 1]},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		ArrayUtils.rotateRight(...caseInfo.inArgs);
		if (caseInfo.inArgs[0].length !== caseInfo.out.length)
			plogger(`Array length expected to be ${caseInfo.out.length} but got ${caseInfo.inArgs[0].length}.  The array is: ${caseInfo.inArgs[0].join(',')}`);
		else {
			const a = caseInfo.inArgs[0];
			for (let i = 0; i < a.length; i++) {
				if (a[i] !== caseInfo.out[i])
					plogger(`Expected a[${i}] to be ${caseInfo.out[i]} but got ${a[i]}`);
			}
		}
	});
}

export function testArrayUtils(logger) {
	wrapAndCall([
		testInsertArray,
		testPushAll,
		testRemove,
		testRepeat,
		testRotateLeft,
		testRotateRight
	], logger);
};
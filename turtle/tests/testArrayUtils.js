import { ArrayUtils } from '../modules/ArrayUtils.js';
import { prefixWrapper } from './helpers/prefixWrapper.js';
import { testInOutPairs } from './helpers/testInOutPairs.js';

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

export function testArrayUtils(logger) {
	testPushAll(prefixWrapper('testPushAll', logger));
	testRemove(prefixWrapper('testRemove', logger));
	testRepeat(prefixWrapper('testRepeat', logger));
};
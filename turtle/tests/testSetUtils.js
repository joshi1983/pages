import { prefixWrapper } from './helpers/prefixWrapper.js';
import { SetUtils } from '../modules/SetUtils.js';
import { testInOutPairs } from './helpers/testInOutPairs.js';
import { wrapAndCall } from './helpers/wrapAndCall.js';

function testAddAll(logger) {
	const cases = [
	{'set': [], 'add': [], 'out': []},
	{'set': [], 'add': [4], 'out': [4]},
	{'set': [1, 2, 3], 'add': [], 'out': [1, 2, 3]},
	{'set': [1, 2, 3], 'add': [4], 'out': [1, 2, 3, 4]},
	{'set': [1, 2, 3], 'add': [4, 5], 'out': [1, 2, 3, 4, 5]}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const set = new Set(caseInfo.set);
		const toAdd = new Set(caseInfo.add);
		SetUtils.addAll(set, toAdd);
		if (set.size !== caseInfo.out.length)
			plogger(`Expected size to become ${caseInfo.out}`);
		else {
			caseInfo.out.forEach(function(val) {
				if (!set.has(val))
					plogger(`Expected to find ${val} but it was not.`);
			});
		}
	});
}

function testIsIntersecting(logger) {
	const cases = [
	{'inArgs': [new Set(), new Set()], 'out': false},
	{'inArgs': [new Set([1]), new Set()], 'out': false},
	{'inArgs': [new Set(), new Set([1])], 'out': false},
	{'inArgs': [new Set([1]), new Set([1])], 'out': true},
	{'inArgs': [new Set([1, 2]), new Set([1])], 'out': true},
	{'inArgs': [new Set([1, 2]), new Set([2])], 'out': true},
	{'inArgs': [new Set([1, 2]), new Set([2, 3])], 'out': true}
	];
	testInOutPairs(cases, SetUtils.isIntersecting, logger);
}

function testRemove(logger) {
	const cases = [
	{'set': [], 'isKept': (v) => false, 'out': []},
	{'set': [4, 5], 'isKept': (v) => false, 'out': []},
	{'set': [1, 2, 3, 4, 5], 'isKept': (v) => v % 2 === 0, 'out': [2, 4]},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const set = new Set(caseInfo.set);
		SetUtils.remove(set, caseInfo.isKept);
		if (set.size !== caseInfo.out.length)
			plogger(`Expected size to become ${caseInfo.out}`);
		else {
			caseInfo.out.forEach(function(val) {
				if (!set.has(val))
					plogger(`Expected to find ${val} but it was not.`);
			});
		}
	});
}

export function testSetUtils(logger) {
	wrapAndCall([
		testAddAll,
		testIsIntersecting,
		testRemove
	], logger);
};
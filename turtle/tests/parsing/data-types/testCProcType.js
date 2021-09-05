import { CProcType } from '../../../modules/parsing/data-types/CProcType.js';
import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
import { ParseTreeToken } from '../../../modules/parsing/ParseTreeToken.js';
import { ParseTreeTokenType } from '../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { Procedure } from '../../../modules/parsing/Procedure.js';
import { processTestCases } from './processTestCases.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';

function processMethodCases(cases, methodName, logger) {
	cases.forEach(function(caseInfo, index) {
		const inArgs = caseInfo.inArgs.map(s => new DataTypes(s).types.values().next().value);
		const cprocType = inArgs[0];
		const other = inArgs[1];
		const f = cprocType[methodName];
		if (typeof f !== 'function')
			throw new Error(`${methodName} is not a method of a CProcType object.  f=${f}`);
		const result = cprocType[methodName](other);
		if (result !== caseInfo.out) {
			const plogger = prefixWrapper(`Case ${index}, in: ${caseInfo.inArgs.join(', ')}`, logger);
			plogger(`Expected ${caseInfo.out} but found ${result}`);
		}
	});
}

function testConstructorWithReturnTypes(logger) {
	const cases = [
		undefined, // indicating no constraint on returnTypes.  
		// The returnTypes of a given command or procedure will have no effect on determining if it is within the set of CProcType.
	
		null, // indicating any matching command or procedure must not output anything.  
		// It must not use an output WebLogo command.

		new DataTypes('list').types
		// indicating any matching command or procedure must output/return list.
	];
	for (const returnTypes of cases) {
		new CProcType(1, returnTypes);
	};
}

function testEquals(logger) {
	const cases = [
		{'inArgs': ['cproc', 'cproc'], 'out': true},
		{'inArgs': ['cproc', 'cproc:1'], 'out': false},
		{'inArgs': ['cproc:1', 'cproc:1'], 'out': true},
		{'inArgs': ['cproc:1', 'cproc:2'], 'out': false},
		{'inArgs': ['cproc:2', 'cproc:2'], 'out': true},
		{'inArgs': ['cproc(returntypes=num)', 'cproc'], 'out': false},
		{'inArgs': ['cproc(returntypes=num)', 'cproc(returntypes=num)'], 'out': true},
		{'inArgs': ['cproc:2(returntypes=num)', 'cproc:2(returntypes=num)'], 'out': true},
		{'inArgs': ['cproc:1(returntypes=num)', 'cproc:2(returntypes=num)'], 'out': false}
	];
	processMethodCases(cases, 'equals', logger);
}

function testGetIntersectionWith(logger) {
	const cases = [
		{'inArgs': ['cproc', 'cproc'], 'out': 'cproc'},
		{'inArgs': ['cproc', 'string'], 'out': 'cproc'},
		{'inArgs': ['cproc:1', 'cproc:1'], 'out': 'cproc:1'},
		{'inArgs': ['cproc:1', 'cproc:2'], 'out': null},
		{'inArgs': ['cproc', 'cproc:2'], 'out': 'cproc:2'},
		{'inArgs': ['cproc', 'cproc:2(returntypes=bool)'], 'out': 'cproc:2(returntypes=bool)'},
		{'inArgs': ['cproc', 'cproc(returntypes=bool)'], 'out': 'cproc(returntypes=bool)'},
		{'inArgs': ['cproc(returntypes=num)', 'cproc(returntypes=int)'], 'out': 'cproc(returntypes=int)'},
	];
	// swap args for more test coverage because the intersection result should be the same regardless of order.
	for (let i = cases.length - 1; i >= 0; i--) {
		const caseInfo = cases[i];
		const swappedInArgs = caseInfo.inArgs.slice().reverse();
		if (swappedInArgs[0].startsWith('cproc')) {
			cases.push({
				'inArgs': swappedInArgs,
				'out': caseInfo.out
			});
		}
	}
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, inArgs=${Array.from(caseInfo.inArgs).join(', ')}`, logger);
		const inArgs = caseInfo.inArgs;
		const types1 = new DataTypes(inArgs[0]).types;
		if (types1.size !== 1) {
			plogger(`Expected 1 type for ${inArgs[0]} but found ${types1.size}`);
			return;
		}
		const types2 = new DataTypes(inArgs[1]).types;
		if (types2.size !== 1) {
			plogger(`Expected 1 type for ${inArgs[1]} but found ${types2.size}`);
			return;
		}
		const type1 = types1.values().next().value;
		const type2 = types2.values().next().value;
		const result = type1.getIntersectionWith(type2);
		if (result === null && caseInfo.out !== null)
			plogger(`Expected ${caseInfo.out} but found null`);
		else if (result !== null) {
			const resultStr = result.toString();
			if (caseInfo.out === null)
				plogger(`Expected null but found ${resultStr}`);
			else if (resultStr !== caseInfo.out) {
				plogger(`Expected ${caseInfo.out} but found ${resultStr}`);
			}
		}
	});
}

function testIntersectsWith(logger) {
	const cases = [
		{'inArgs': ['cproc', 'cproc'], 'out': true},
		{'inArgs': ['cproc', 'cproc(returntypes=bool)'], 'out': true},
		{'inArgs': ['cproc:1', 'cproc'], 'out': true},
		{'inArgs': ['cproc:1(returntypes=string)', 'cproc'], 'out': true},
		{'inArgs': ['cproc:1(returntypes=string)', 'cproc:1'], 'out': true},
		{'inArgs': ['cproc:1(returntypes=string)', 'cproc:1(returntypes=bool)'], 'out': false},
		{'inArgs': ['cproc:1(returntypes=num)', 'cproc:1(returntypes=bool)'], 'out': false},
		{'inArgs': ['cproc:1(returntypes=string)', 'cproc:1(returntypes=num)'], 'out': false},
		{'inArgs': ['cproc:1(returntypes=num|string)', 'cproc:1(returntypes=num)'], 'out': true},
		{'inArgs': ['cproc:1(returntypes=string)', 'cproc:2'], 'out': false},
		{'inArgs': ['cproc:1', 'cproc:2'], 'out': false},
	];
	processMethodCases(cases, 'intersectsWith', logger);

	// intersectsWith should give the same results when inArgs is reversed.
	// Let's do that with the test cases for some more test coverage.
	cases.forEach(caseInfo => caseInfo.inArgs.reverse());
	processMethodCases(cases, 'intersectsWith', prefixWrapper('reversed inArgs', logger));
}

function testIsCompatible(logger) {
	const cprocType = DataTypes.createFromName('cproc');
	const cases = [
		{'s': 'true', 'isCompatible': false},
		{'s': '"x', 'isCompatible': true},
		{'s': '"red', 'isCompatible': true}, // red might be a procedure name even though it is also a color name.
		{'s': '"print', 'isCompatible': true},
		{'s': 'end', 'isCompatible': false},
		{'s': '\n', 'isCompatible': false}
	];
	processTestCases(cases, logger, cprocType);
}

function testIsCompatibleWithNumArgs(logger) {
	const cprocType = DataTypes.createFromName('cproc:1');
	const cases = [
		{'s': 'true', 'isCompatible': false},
		{'s': '"penDown', 'isCompatible': false},// numArgs is mismatched.
		{'s': '"fd', 'isCompatible': true},
		{'s': '"print', 'isCompatible': true},
	];
	processTestCases(cases, logger, cprocType);
}

function testIsCompatibleWithReturnTypes(logger) {
	const dataTypes = new DataTypes('cproc(returntypes=num)');
	const cprocType = dataTypes.types.values().next().value;
	const cases = [
		{'s': '"fd', 'isCompatible': false},
		{'s': '"print', 'isCompatible': false},
		{'s': '"list', 'isCompatible': false},
		{'s': '"createPList', 'isCompatible': false},
		{'s': '"createPList2', 'isCompatible': false},
		{'s': '"sin', 'isCompatible': true},
		{'s': '"arcTan', 'isCompatible': true},
		{'s': '"arcTan2', 'isCompatible': true},
		{'s': '"p', 'isCompatible': true},
		// p might be a procedure with a num return type.
		// We don't really know but if it can't be ruled out, isCompatible should be true.
		{'s': '"#f', 'isCompatible': false},
	];
	processTestCases(cases, logger, cprocType);
}

function testIsCompatibleWithValue(logger) {
	const cases = [
		{'s': 'red', 'procedures': [], 'out': false},
		{'s': 'hi', 'procedures': [], 'out': false},
		{'s': 'p', 'procedures': [], 'out': false},
		{'s': 'p', 'procedures': ['p'], 'out': true},
		{'s': 'red', 'procedures': ['red'], 'out': true},
	];
	const type = new CProcType();
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, s=${caseInfo.s}`, logger);
		const extraInfo = {};
		if (caseInfo.procedures !== undefined) {
			extraInfo.procedures = new Map();
			caseInfo.procedures.forEach(function(p) {
				const nameToken = new ParseTreeToken(p, null, 0, 0, ParseTreeTokenType.LEAF);
				const proc = new Procedure(p, [], nameToken);
				extraInfo.procedures.set(p, proc);
			});
		}
		const result = type.mayBeCompatibleWithValue(caseInfo.s, extraInfo);
		if (result !== caseInfo.out)
			plogger(`Expected ${caseInfo.out} but got ${result}`);
	});
}

function testIsProperSubsetOf(logger) {
	const cases = [
		{'inArgs': ['cproc', 'cproc'], 'out': false}, // equal is not proper subset.
		{'inArgs': ['cproc:0', 'cproc:0'], 'out': false}, // equal
		{'inArgs': ['cproc:1', 'cproc:1'], 'out': false}, // equal
		{'inArgs': ['cproc:0', 'cproc'], 'out': true},
		{'inArgs': ['cproc:1', 'cproc'], 'out': true},
		{'inArgs': ['cproc:1', 'cproc(returntypes=num)'], 'out': false}, 
		// str command is an example of a cproc:1 that is not a cproc(returntypes=num).

		{'inArgs': ['cproc(returntypes=num)', 'cproc(returntypes=string)'], 'out': false}, 
		{'inArgs': ['cproc:1(returntypes=num)', 'cproc(returntypes=num)'], 'out': true}, 
		{'inArgs': ['cproc:1(returntypes=num)', 'cproc(returntypes=num|string)'], 'out': true}, 
		{'inArgs': ['cproc:1(returntypes=num)', 'cproc:1(returntypes=num|string)'], 'out': true}, 
		{'inArgs': ['cproc:1(returntypes=num|string)', 'cproc:1(returntypes=num)'], 'out': false}, 
		{'inArgs': ['cproc:1(returntypes=string)', 'cproc:1'], 'out': true},
	];
	processMethodCases(cases, 'isProperSubsetOf', logger);

	// if A is a proper subset of B, B should not be a proper subset of A.
	// Let's filter the test cases to verify that holds true for the isProperSubsetOf method
	// and get some more test coverage.
	const reversedCases = cases.filter(c => c.out === true);
	reversedCases.forEach(c => {
		c.inArgs.reverse();
		c.out = false;
	});
	processMethodCases(cases, 'isProperSubsetOf', prefixWrapper('inArgs reversed', logger));
}

function testTightenForValue(logger) {
	const cprocType = new CProcType();
	const cases = [
		{'in': 'list', 'out': 'cproc(returntypes=list)'},
		{'in': 'createPList', 'out': 'cproc:0(returntypes=plist)'},
		{'in': 'createPList2', 'out': 'cproc:1(returntypes=plist)'},
		{'in': 'sin', 'out': 'cproc:1(returntypes=num)'},
		{'in': 'tan', 'out': 'cproc:1(returntypes=num)'},
		{'in': 'str', 'out': 'cproc:1(returntypes=string)'},
		{'in': 'p', 'out': 'cproc'},
		// unknown length and unknown return types so can't tighten the type at all.
	];
	cases.forEach(function(caseInfo, index) {
		const result = cprocType.tightenForValue(caseInfo.in);
		const str = DataTypes.stringify(new Set([result]));
		if (str !== caseInfo.out) {
			const plogger = prefixWrapper(`Case ${index}, in=${caseInfo.in}`, logger);
			plogger(`Expected ${caseInfo.out} but found ${str}`);
		}
	});
}

function testToString(logger) {
	const cases = [
		{'inArgs': [], 'out': 'cproc'},
		{'inArgs': [undefined, null], 'out': 'cproc(returntypes=null)'},
		{'inArgs': [undefined, new DataTypes('num').types], 'out': 'cproc(returntypes=num)'},
		{'inArgs': [undefined, new DataTypes('num|string').types], 'out': 'cproc(returntypes=num|string)'},
		{'inArgs': [0, null], 'out': 'cproc:0(returntypes=null)'},
		{'inArgs': [1, null], 'out': 'cproc:1(returntypes=null)'},
		{'inArgs': [0, new DataTypes('num').types], 'out': 'cproc:0(returntypes=num)'},
		{'inArgs': [1, new DataTypes('num|string').types], 'out': 'cproc:1(returntypes=num|string)'},
	];
	cases.forEach(function(caseInfo, index) {
		const cproc = new CProcType(...caseInfo.inArgs);
		const result = cproc.toString();
		if (result !== caseInfo.out) {
			logger(`Case ${index}, expected ${caseInfo.out} but found ${result}`);
		}
	});
}

function testUnionWith(logger) {
	const cases = [
		{'inArgs': ['cproc', 'cproc'], 'out': 'cproc'},
		{'inArgs': ['cproc', 'cproc:1'], 'out': 'cproc'},
		{'inArgs': ['cproc', 'cproc(returntypes=num)'], 'out': 'cproc'},
		{'inArgs': ['cproc(returntypes=num)', 'cproc(returntypes=string)'], 'out': 'cproc(returntypes=num|string)'},
		{'inArgs': ['cproc:1', 'cproc:1'], 'out': 'cproc:1'},
		{'inArgs': ['cproc:1(returntypes=num)', 'cproc:1(returntypes=num)'], 'out': 'cproc:1(returntypes=num)'},
		{'inArgs': ['cproc:1(returntypes=num)', 'cproc:1(returntypes=string)'], 'out': 'cproc:1(returntypes=num|string)'},
		{'inArgs': ['cproc:1', 'cproc:2'], 'out': undefined},
		{'inArgs': ['cproc:1(returntypes=num)', 'cproc:2(returntypes=num)'], 'out': undefined},
	];
	// union should get the same result with inArgs reversed
	// so add a similar case with inArgs reversed.
	for (let i = cases.length - 1; i >= 0; i--) {
		const caseInfo = cases[i];
		const inArgs = caseInfo.inArgs;
		if (inArgs[0] !== inArgs[1]) {
			const inArgsClone = inArgs.slice().reverse();
			cases.push({
				'inArgs': inArgsClone,
				'out': caseInfo.out
			});
		}
	}
	cases.forEach(function(caseInfo, index) {
		const inArgs = caseInfo.inArgs;
		const constructorTypes = inArgs[0];
		const cprocType = new DataTypes(constructorTypes).types.values().next().value;
		const plogger = prefixWrapper(`Case ${index}, inArgs=${inArgs.join(', ')}`, logger);
		if (cprocType === undefined) {
			plogger(`Unable to get CProcType from ${inArgs[0]}`);
			return;
		}
		const paramType = new DataTypes(inArgs[1]).types.values().next().value;
		if (paramType === undefined) {
			plogger(`Unable to get CProcType from ${inArgs[1]}`);
			return;
		}
		const result = cprocType.unionWith(paramType);
		if (caseInfo.out === undefined) {
			if (result !== undefined)
				plogger(`Expected undefined but found ${result}`);
		}
		else if (result === undefined)
			plogger(`Expected ${caseInfo.out} but found undefined`);
		else {
			const resultStr = result.toString();
			if (resultStr !== caseInfo.out) {
				plogger(`Expected ${caseInfo.out} but found ${resultStr}`);
			}
		}
	});
}

export function testCProcType(logger) {
	wrapAndCall([
		testConstructorWithReturnTypes,
		testEquals,
		testGetIntersectionWith,
		testIntersectsWith,
		testIsCompatible,
		testIsCompatibleWithNumArgs,
		testIsCompatibleWithReturnTypes,
		testIsCompatibleWithValue,
		testIsProperSubsetOf,
		testTightenForValue,
		testToString,
		testUnionWith
	], logger);
};
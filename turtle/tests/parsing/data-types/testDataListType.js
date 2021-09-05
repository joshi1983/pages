import { DataType } from '../../../modules/parsing/data-types/DataType.js';
import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
import { DataListType } from '../../../modules/parsing/data-types/DataListType.js';
import { escapeHTML } from '../../helpers/escapeHTML.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { wrapAndCall } from '../../helpers/wrapAndCall.js';
await DataTypes.asyncInit();

function testGetIntersectionWith(logger) {
	const cases = [
	{'subtypes': 'num', 'other': 'colorlist', 'out': 'colorlist'},
	{'subtypes': 'int', 'other': 'colorlist', 'out': 'colorlist'},
	{'subtypes': 'num', 'other': 'alphacolorlist', 'out': 'alphacolorlist'},
	{'subtypes': 'int', 'other': 'alphacolorlist', 'out': 'alphacolorlist'},
	{'subtypes': 'list|num|string', 'other': 'alphacolorlist', 'out': 'alphacolorlist'},
	{'subtypes': 'num|string', 'other': 'alphacolorlist', 'out': 'alphacolorlist'},
	{'subtypes': 'int|string', 'other': 'alphacolorlist', 'out': 'alphacolorlist'},
	{'subtypes': 'colorstring', 'other': 'colorlist', 'out': null},
	{'subtypes': 'alphacolorstring', 'other': 'colorlist', 'out': null},
	{'subtypes': 'bool', 'other': 'colorlist', 'out': null},
	{'subtypes': 'list', 'other': 'colorlist', 'out': null},
	{'subtypes': 'plist', 'other': 'colorlist', 'out': null},
	{'subtypes': 'string', 'other': 'colorlist', 'out': null}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const otherTypes = new DataTypes(caseInfo.other).types;
		if (otherTypes.size !== 1)
			plogger(`Expected size to be 1 but got ${otherTypes.size}`);
		const otherType = otherTypes.values().next().value;
		if (!(otherType instanceof DataType))
			console.error(`Expected an instanceof DataType but got `, otherType);
		const list = new DataListType(new DataTypes(caseInfo.subtypes));
		const result = list.getIntersectionWith(otherType);
		if (caseInfo.out === null && result !== null)
			plogger(`Expected result of null but got ${result.toString()}`);
		else if (caseInfo.out !== null) {
			if (result.toString() !== caseInfo.out)
				plogger(`Expected result of ${caseInfo.out} but got ${result.toString()}`);
		}
		else if (caseInfo.out !== result)
			plogger(`Expected result of ${caseInfo.out} but got null`);
	});
}

function testMinLen(logger) {
	const listType = new DataListType(undefined, 2);
	if (listType.minLen !== 2)
		logger(`Expected minLen to be 2 but found ${listType.minLen}`);
	else {
		const str = listType.toString();
		const expected = 'list(minlen=2)';
		if (str !== expected)
			logger(`Expected toString() to return ${expected} but got ${str}`);
		const val = [1, 2];
		if (!listType.mayBeCompatibleWithValue(val))
			logger(`Expected mayBeCompatibleWithValue on ${listType.toString()} ` +
				`but got false for an Array with length 2.`);
		const val2 = [1];
		if (listType.mayBeCompatibleWithValue(val2))
			logger(`Expected mayBeCompatibleWithValue on ${listType.toString()} ` +
				`but got true for an Array with length 1.`);
	}
	const listType2 = new DataListType();
	if (listType2.minLen !== 0)
		logger(`Expected minLen to be 0 but found ${listType2.minLen}`);
	else {
		const str = listType2.toString();
		const expected = 'list';
		if (str !== expected)
			logger(`Expected toString() to return ${expected} but got ${str}`);
	}
}

function testSubtypes(logger) {
	const numTypes = new DataTypes('num');
	const listOfNum = new DataListType(numTypes);
	if (listOfNum.toString() !== 'list<num>')
		logger(`Expected list<num> but got ${listOfNum.toString()}`);
	const listOfAnything = new DataListType();
	if (listOfNum.intersectsWith(listOfAnything) !== true)
		logger('list<num> expected to intersect with list but got a different result.');
	const intersectionResult1 = listOfNum.getIntersectionWith(listOfAnything);
	if (intersectionResult1.toString() !== 'list<num>')
		logger(escapeHTML(`Expected intersection result1 to be list<num> but got ${intersectionResult1.toString()}`));
	const intersectionResult2 = listOfAnything.getIntersectionWith(listOfNum);
	if (intersectionResult2.toString() !== 'list<num>')
		logger(escapeHTML(`Expected intersection result1 to be list<num> but got ${intersectionResult2.toString()}`));
}

function testToString(logger) {
	const cases = [
	{'minLen': undefined, 'subtypes': undefined, 'out': 'list'},
	{'minLen': undefined, 'subtypes': 'num', 'out': 'list<num>'},
	{'minLen': undefined, 'subtypes': 'bool|num|string', 'out': 'list<bool|num|string>'},
	{'minLen': undefined, 'subtypes': 'bool|num|string(minlen=3)', 'out': 'list<bool|num|string(minlen=3)>'},
	{'minLen': 0, 'subtypes': undefined, 'out': 'list'},
	{'minLen': 1, 'subtypes': undefined, 'out': 'list(minlen=1)'},
	{'minLen': 1, 'subtypes': 'num', 'out': 'list<num>(minlen=1)'},
	{'minLen': 2, 'subtypes': undefined, 'out': 'list(minlen=2)'},
	{'minLen': 2, 'subtypes': 'bool', 'out': 'list<bool>(minlen=2)'},
	];
	cases.forEach(function(caseInfo, index) {
		const subtypes = new DataTypes(caseInfo.subtypes);
		const result = new DataListType(subtypes, caseInfo.minLen).toString();
		if (result !== caseInfo.out) {
			logger(`Case ${index}, minLen=${caseInfo.minLen}: Expected ${caseInfo.out} but found ${result}`);
		}
	});
}

export function testDataListType(logger) {
	const dataListType = DataTypes.createFromName('list');
	if (typeof dataListType !== 'object')
		logger('dataListType expected to be an object');
	wrapAndCall([
		testGetIntersectionWith,
		testMinLen,
		testSubtypes,
		testToString
	], logger);
};
import { DataType } from '../../../modules/parsing/data-types/DataType.js';
import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
import { DataListType } from '../../../modules/parsing/data-types/DataListType.js';
import { escapeHTML } from '../../helpers/escapeHTML.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';

function testGetIntersectionWith(logger) {
	const cases = [
	{'subtypes': 'num', 'other': 'colorlist', 'out': 'colorlist'},
	{'subtypes': 'int', 'other': 'colorlist', 'out': 'colorlist'},
	{'subtypes': 'num', 'other': 'alphacolorlist', 'out': 'alphacolorlist'},
	{'subtypes': 'int', 'other': 'alphacolorlist', 'out': 'alphacolorlist'},
	{'subtypes': 'list|num|string', 'other': 'alphacolorlist', 'out': 'alphacolorlist'},
	{'subtypes': 'num|string', 'other': 'alphacolorlist', 'out': 'alphacolorlist'},
	{'subtypes': 'int|string', 'other': 'alphacolorlist', 'out': 'alphacolorlist'},
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

export function testDataListType(logger) {
	const dataListType = DataTypes.createFromName('list');
	if (typeof dataListType !== 'object')
		logger('dataListType expected to be an object');
	testGetIntersectionWith(prefixWrapper('testGetIntersectionWith', logger));
	testSubtypes(prefixWrapper('testSubtypes', logger));
};
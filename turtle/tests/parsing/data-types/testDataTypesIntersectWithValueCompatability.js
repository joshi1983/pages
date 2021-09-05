import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
import { escapeHTML } from '../../helpers/escapeHTML.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';

export function testDataTypesIntersectWithValueCompatability(logger) {
	const cases = [
		{'types': 'num', 'val': 5, 'result': 'num'},
		{'types': 'list', 'val': [], 'result': 'list'},
		{'types': 'list', 'val': [3], 'result': 'list<int>'},
		{'types': 'alphacolor', 'val': [], 'result': ''},
		{'types': 'alphacolor', 'val': "helloworld", 'result': ''},
		{'types': 'alphacolor', 'val': {}, 'result': ''},
		{'types': 'alphacolor', 'val': 'red', 'result': 'colorstring'},
		{'types': 'alphacolor', 'val': '#1234', 'result': 'alphacolorstring'},
		{'types': 'alphacolor', 'val': [1, 2, 3], 'result': 'colorlist'},
		{'types': 'alphacolor', 'val': [1, 2, 3, 4], 'result': 'alphacolorlist'},
		{'types': 'bool|gradient|list|num|plist|string|transparent', 'val': 'red', 'result': 'string'},
	];
	cases.forEach(function(caseInfo, index) {
		const types = new DataTypes(caseInfo.types);
		const plogger = prefixWrapper(`Case ${index}, types=${caseInfo.types}, val=${caseInfo.val}`, logger);
		if (typeof types.intersectWithValueCompatability !== 'function')
			plogger(escapeHTML(`Expected intersectWithValueCompatability to be a method but it is: ${typeof types.intersectWithValueCompatability}`));
		else {
			types.intersectWithValueCompatability(caseInfo.val);
			const resultStr = types.toString();
			if (resultStr !== caseInfo.result)
				plogger(escapeHTML(`Expected "${caseInfo.result}" but got "${resultStr}"`));
		}
	});
};
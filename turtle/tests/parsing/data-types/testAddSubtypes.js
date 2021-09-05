import { addSubtypes } from '../../../modules/parsing/data-types/addSubtypes.js';
import { DataTypes } from '../../../modules/parsing/data-types/DataTypes.js';
import { escapeHTML } from '../../helpers/escapeHTML.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
await DataTypes.asyncInit();

export function testAddSubtypes(logger) {
	const cases = [
		{'inArgs': ['', 'num'], 'out': 'list<num>'},
		{'inArgs': ['list', 'num'], 'out': 'list'},
		{'inArgs': ['list<num>', 'num'], 'out': 'list<num>'},
		{'inArgs': ['list<string>', 'num'], 'out': 'list<num|string>'},
		{'inArgs': ['int|list<num>', 'num'], 'out': 'int|list<num>'},
		{'inArgs': ['list<num>|num', 'num'], 'out': 'list<num>|num'},
		{'inArgs': ['color', 'num'], 'out': 'color|list<num>'},
		{'inArgs': ['colorstring', 'num'], 'out': 'colorstring|list<num>'},
		{'inArgs': ['bool|colorstring', 'num'], 'out': 'bool|colorstring|list<num>'},
		{'inArgs': ['colorlist', 'string'], 'out': 'colorlist|list<string>'},
		{'inArgs': ['list<>', 'num'], 'out': 'list<num>'},
		{'inArgs': ['list<>', 'string'], 'out': 'list<string>'},
		{'inArgs': ['list<>', 'num|string'], 'out': 'list<num|string>'},
		{'inArgs': ['list<>', 'list<num>'], 'out': 'list<list<num>>'},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, inArgs=${caseInfo.inArgs.join(',')}`, logger);
		const inArgs = caseInfo.inArgs.map(s => new DataTypes(s));
		addSubtypes(...inArgs);
		const result = inArgs[0];
		if (result.toString() !== caseInfo.out)
			plogger(escapeHTML(`Expected ${caseInfo.out} but got ${result.toString()}`));
	});
};
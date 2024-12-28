import { DataTypes } from '../../../../../modules/parsing/data-types/DataTypes.js';
import { getCachedParseTreeFromCode } from '../../../../helpers/getCachedParseTreeFromCode.js';
import { getSatisfyingDataTypes } from
'../../../../../modules/parsing/parse-tree-analysis/variable-data-types/variable-assignment-scopes/getSatisfyingDataTypes.js';
import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';
await DataTypes.asyncInit();

export function testGetSatisfyingDataTypes(logger) {
	const cases = [
		{'code': 'color? :x', 'types': 'color'},
		{'code': 'string? :x', 'types': 'string'},
		{'code': 'number? :x', 'types': 'num'},
		{'code': 'boolean? :x', 'types': 'bool'},
		{'code': 'list? :x', 'types': 'list'},
		{'code': '(list? :x)', 'types': 'list'},
		{'code': 'list? :y', 'types': undefined},
		{'code': 'or list? :x number? :x', 'types': 'list|num'},
		{'code': 'or list? :x (1 < 2)', 'types': undefined},
		{'code': '(or list? :x list? :x (1 < 2))', 'types': undefined},
		{'code': 'or (1 < 2) list? :x', 'types': undefined},
		{'code': 'and color? :x number? :x', 'types': 'int'},
		{'code': 'and number? :x color? :x', 'types': 'int'},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const tree = getCachedParseTreeFromCode(caseInfo.code, plogger);
		const conditionToken = tree.root.children[0];
		const result = getSatisfyingDataTypes(conditionToken, 'x');
		if (result === undefined) {
			if (caseInfo.types !== undefined)
				plogger(`Expected ${caseInfo.types} but got undefined`);
		}
		else {
			const resultString = DataTypes.stringify(result);
			if (caseInfo.types === undefined)
				plogger(`Expected undefined but got ${resultString}`);
			else if (resultString !== caseInfo.types)
				plogger(`Expected ${caseInfo.types} but got ${resultString}`);
		}
	});
};
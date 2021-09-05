import { findToken } from '../../../helpers/findToken.js';
import { getCachedParseTreeFromCode } from '../../../helpers/getCachedParseTreeFromCode.js';
import { getTokenTypesBasic } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/getTokenTypesBasic.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

export function testGetTokenTypesBasic(logger) {
	const code = 'make "x 1 print sum (-:x) 1';
	const cachedParseTree = getCachedParseTreeFromCode(code, logger);
	const cases = [
		{'val': 1, 'hasParentVal': 'make', 'typeStr': 'int'},
		{'val': 1, 'hasParentVal': 'sum', 'typeStr': 'int'},
		{'val': 'x', 'hasParentVal': 'make', 'typeStr': 'string'},
		{'val': 'sum', 'typeStr': undefined},
		{'val': '-', 'typeStr': undefined},
		
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, caseInfo = ${JSON.stringify(caseInfo)}`, logger);
		const token = findToken(caseInfo, cachedParseTree, plogger);
		if (token !== undefined) {
			const types = getTokenTypesBasic(token, true, {
				'procedures': new Map()
			});
			if (types === undefined) {
				if (caseInfo.typeStr !== undefined)
					plogger(`Expected ${caseInfo.typeStr} but got undefined`);
			}
			else {
				const typeStr = types.toString();
				if (caseInfo.typeStr !== typeStr)
					plogger(`Expected ${caseInfo.typeStr} but got ${typeStr}`);
			}
		}
	});
};
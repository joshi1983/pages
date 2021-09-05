import { getTipsForProcOrCommandName } from '../../../../modules/parsing/parse-tree-analysis/tip-generators/getTipsForProcOrCommandName.js';
import { processTipsTestCase } from './processTipsTestCase.js';

export function testGetTipsForProcOrCommandName(logger) {
	const cases = [
		{'code': '', 'numTips': 0},
		{'code': 'fd 100', 'numTips': 0},
		{'code': 'penup', 'numTips': 0},
		{'code': 'pen up', 'numTips': 1},
		{'code': 'set pen size', 'numTips': 1},
	];
	const proceduresMap = new Map();
	cases.forEach(function(caseInfo, index) {
		processTipsTestCase(caseInfo, getTipsForProcOrCommandName, logger, index);
	});
};
import { analyzeInstructionListRepeatCounts } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/analyzeInstructionListRepeatCounts.js';
import { evaluateTokensBasic } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/evaluateTokensBasic.js';
import { getCachedParseTreeFromCode } from '../../../helpers/getCachedParseTreeFromCode.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

export function testAnalyzeInstructionListRepeatCounts(logger) {
	const cases = [
		{'code': 'print "x', 'min': 1, 'max': 1},
		{'code': 'if true [print "x]', 'min': 1, 'max': 1},
		{'code': 'if 1 < 2 [print "x]', 'min': 1, 'max': 1},
		{'code': 'ifelse 1 < 2 [print "y] [print "x]', 'min': 0, 'max': 0},
		{'code': 'repeat 0 [print "x]', 'min': 0, 'max': 0},
		{'code': 'repeat 1 [print "x]', 'min': 1, 'max': 1},
		{'code': 'repeat 2 [print "x]', 'min': 2, 'max': 2},
		{'code': 'repeat 3 [print "x]', 'min': 3, 'max': 3},
		{'code': 'for ["y 0 5 1] [print "x]', 'min': 6, 'max': 6},
		{'code': 'while 1 < 3 [print "x]', 'min': 2},
		{'code': 'while 1 > 3 [print "x]', 'min': 0, 'max': 0},
		{'code': 'forever [print "x]', 'min': 2},
		{'code': 'to p\nprint "x\nend', 'min': 1, 'max': 1},
		{'code': 'to p\nif true [print "x]\nend', 'min': 1, 'max': 1},
		{'code': 'to p\nrepeat 2 [\nprint "x\n]\nend', 'min': 2, 'max': 2},
		{'code': 'to p\nrepeat 2 [\nprint "x\noutput 5\n]\nend', 'min': 1, 'max': 1},
		{'code': 'to p\nrepeat 2 [\nprint "x\nif true [stop]]\nend', 'min': 1, 'max': 1}, 
		{'code': 'to p\nforever [\nprint "x\nstop\n]\nend', 'min': 1, 'max': 1},
		{'code': 'until true [print "x]', 'min': 0, 'max': 0},
		{'code': 'until false [print "x]', 'min': 2},
	];
	cases.forEach(function(caseInfo, index) {
		const code = caseInfo.code;
		const cachedParseTree = getCachedParseTreeFromCode(code, logger);
		const testToken = cachedParseTree.getAllTokens().filter(t => t.val === 'x' && t.parentNode.val === 'print')[0];
		const tokenValueMap = evaluateTokensBasic(cachedParseTree);
		const repeatCounts = analyzeInstructionListRepeatCounts(cachedParseTree, tokenValueMap);
		const plogger = prefixWrapper(`Case ${index}.  code = ${code}`, logger);
		if (testToken === undefined)
			plogger('Unable to find test token with val of "x" and parent of "print"');
		else {
			const instructionList = testToken.parentNode.parentNode;
			const count = repeatCounts.get(instructionList);
			if (typeof count !== 'object')
				plogger('Expected object but got ' + count);
			else {
				if (caseInfo.min !== count.min)
					plogger(`min expected to be ${caseInfo.min} but got ${count.min}`);
				if (caseInfo.max !== count.max)
					plogger(`max expected to be ${caseInfo.max} but got ${count.max}`);
			}
		}
	});

};
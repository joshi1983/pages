import { analyzeInstructionListRepeatCountsBasic } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/analyzeInstructionListRepeatCountsBasic.js';
import { evaluateOutputFrequency } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/evaluateOutputFrequency.js';
import { evaluateTokensBasic } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/evaluateTokensBasic.js';
import { getCachedParseTreeFromCode } from '../../../helpers/getCachedParseTreeFromCode.js';
import { OutputFrequency } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/OutputFrequency.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

export function testEvaluateOutputFrequency(logger) {
	const cases = [
		{'code': 'while 1 < 3 [print "x]', 'result': OutputFrequency.Never},
		{'code': 'if true [print "x]', 'result': OutputFrequency.Never},
		{'code': 'to p\nrepeat 3 [\nprint "x\nif repcount = 1 [stop]]\nend', 'result': OutputFrequency.Sometimes}, 
		{'code': 'to p\nif true [\nprint "x\n]\nend', 'result': OutputFrequency.Never},
		{'code': 'to p\nif true [\nprint "x\nstop\n]\nend', 'result': OutputFrequency.Always},
		{'code': 'to p\nprint "x\nif true [\n\nstop\n]\nend', 'result': OutputFrequency.Always},
	];
	cases.forEach(function(caseInfo, index) {
		const cachedParseTree = getCachedParseTreeFromCode(caseInfo.code, logger);
		const testToken = cachedParseTree.getAllTokens().filter(t => t.val === 'x' && t.parentNode.val === 'print')[0];
		const instructionList = testToken.parentNode.parentNode;
		const tokenValueMap = evaluateTokensBasic(cachedParseTree);
		const basicRepeatInfo = analyzeInstructionListRepeatCountsBasic(cachedParseTree, tokenValueMap);
		const repeatCounts = basicRepeatInfo.repeatCounts;
		const tokenToOutputFrequency = new Map();
		evaluateOutputFrequency(cachedParseTree, repeatCounts, tokenToOutputFrequency);
		const result = tokenToOutputFrequency.get(instructionList);
		const plogger = prefixWrapper(`Case ${index}. Code: ${caseInfo.code}`, logger);
		if (result !== caseInfo.result)
			plogger(`Expected ${OutputFrequency.stringify(caseInfo.result)} but got ${OutputFrequency.stringify(result)}`);
	});
};
import { analyzeInstructionListRepeatCountsBasic } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/analyzeInstructionListRepeatCountsBasic.js';
import { evaluateOutputFrequencyBasic } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/evaluateOutputFrequencyBasic.js';
import { evaluateTokensBasic } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/evaluateTokensBasic.js';
import { getCachedParseTreeFromCode } from '../../../helpers/getCachedParseTreeFromCode.js';
import { getInstructionListRepeatCountAdvanced } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/getInstructionListRepeatCountAdvanced.js';
import { OutputFrequency } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/OutputFrequency.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

export function testGetInstructionListRepeatCountAdvanced(logger) {
	const cases = [
		{'code': 'print "x', 'min': 1, 'max': 1},
		{'code': 'if 1 < 2 [print "x]', 'min': 1, 'max': 1},
		{'code': 'ifelse 1 < 2 [print "y] [print "x]', 'min': 0, 'max': 0},
		{'code': 'repeat 0 [print "x]', 'min': 0, 'max': 0},
		{'code': 'repeat 1 [print "x]', 'min': 1, 'max': 1},
		{'code': 'repeat 2 [print "x]', 'min': 2, 'max': 2},
		{'code': 'repeat 3 [print "x]', 'min': 3, 'max': 3},
		{'code': 'for ["y 0 5 1] [print "x]', 'min': 6, 'max': 6},
		{'code': 'while 1 < 3 [print "x]', 'min': 2, 'tokenValueChecks': [
			{'val': '<', 'result': true}
		], 'outputFrequency': OutputFrequency.Never},
		{'code': 'while 1 > 3 [print "x]', 'min': 0, 'max': 0, 'tokenValueChecks': [
			{'val': '>', 'result': false}
		], 'outputFrequency': OutputFrequency.Never},
		{'code': 'forever [print "x]', 'min': 2, 'outputFrequency': OutputFrequency.Never},
		{'code': 'to p\nrepeat 2 [\nprint "x\noutput 5\n]\nend', 'min': 1, 'max': 1, 'outputFrequency': OutputFrequency.Always},
		{'code': 'to p\nforever [\nprint "x\nstop\n]\nend', 'min': 1, 'max': 1, 'outputFrequency': OutputFrequency.Always},
		{'code': 'until true [print "x]', 'min': 0, 'max': 0, 'outputFrequency': OutputFrequency.Never},
		{'code': 'until false [print "x]', 'min': 2, 'tokenValueChecks': [
			{'val': false, 'result': false}
		], 'outputFrequency': OutputFrequency.Never},
	];
	cases.forEach(function(caseInfo, index) {
		const code = caseInfo.code;
		const plogger = prefixWrapper(`Case ${index}.  code = ${code}`, logger);
		const cachedParseTree = getCachedParseTreeFromCode(code, logger);
		const testToken = cachedParseTree.getAllTokens().filter(t => t.val === 'x' && t.parentNode.val === 'print')[0];
		if (testToken === undefined)
			plogger('Unable to find test token with val of "x" and parent of "print"');
		else {
			const tokenValueMap = evaluateTokensBasic(cachedParseTree);
			const repeatCountBasicInfo = analyzeInstructionListRepeatCountsBasic(cachedParseTree, tokenValueMap);
			const repeatCounts = repeatCountBasicInfo.repeatCounts;
			const tokenToOutputFrequency = new Map();
			evaluateOutputFrequencyBasic(cachedParseTree, tokenToOutputFrequency);
			const instructionList = testToken.parentNode.parentNode;
			const count = repeatCounts.has(instructionList) ? repeatCounts.get(instructionList) :
				getInstructionListRepeatCountAdvanced(instructionList, tokenValueMap, repeatCounts, tokenToOutputFrequency);
			if (typeof count !== 'object')
				plogger('Expected object but got ' + count);
			else {
				if (caseInfo.min !== count.min)
					plogger(`min expected to be ${caseInfo.min} but got ${count.min}`);
				if (caseInfo.max !== count.max)
					plogger(`max expected to be ${caseInfo.max} but got ${count.max}`);
			}
			if (caseInfo.tokenValueChecks !== undefined) {
				caseInfo.tokenValueChecks.forEach(function(tokenValueCheck) {
					const token = cachedParseTree.getAllTokens().filter(function(token) {
						if (tokenValueCheck.val !== undefined && tokenValueCheck.val !== token.val)
							return false;
						return true;
					})[0];
					const result = tokenValueMap.get(token);
					if (result !== tokenValueCheck.result)
						plogger(`Token value expected to be ${tokenValueCheck.result} but got ${result}.  tokenValueCheck info = ${JSON.stringify(tokenValueCheck)}`);
				});
			}
			const outputFrequency = tokenToOutputFrequency.get(instructionList);
			if (caseInfo.outputFrequency !== undefined && caseInfo.outputFrequency !== outputFrequency) {
				plogger(`Expected output frequency of ${OutputFrequency.stringify(caseInfo.outputFrequency)} but got ${OutputFrequency.stringify(outputFrequency)}`);
			}
		}
	});

};
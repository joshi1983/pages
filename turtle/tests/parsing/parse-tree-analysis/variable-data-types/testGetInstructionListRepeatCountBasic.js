import { evaluateTokensBasic } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/evaluateTokensBasic.js';
import { getCachedParseTreeFromCode } from '../../../helpers/getCachedParseTreeFromCode.js';
import { getInstructionListRepeatCountBasic } from '../../../../modules/parsing/parse-tree-analysis/variable-data-types/getInstructionListRepeatCountBasic.js';
import { ParseTreeTokenType } from '../../../../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from '../../../helpers/prefixWrapper.js';

export function testGetInstructionListRepeatCountBasic(logger) {
	const cases = [
		{'code': 'print "x', 'min': 1, 'max': 1},
		{'code': 'if true [print "x]', 'min': 1, 'max': 1},
		{'code': 'if false [print "x]', 'min': 0, 'max': 0},
		{'code': 'ifelse false [print "x] []', 'min': 0, 'max': 0},
		{'code': 'ifelse true [] [print "x]', 'min': 0, 'max': 0},
		{'code': 'ifelse true [print "x] []', 'min': 1, 'max': 1},
		{'code': 'ifelse false [] [print "x]', 'min': 1, 'max': 1},
	];
	cases.forEach(function(caseInfo, index) {
		const code = caseInfo.code;
		const cachedParseTree = getCachedParseTreeFromCode(code, logger);
		const tokenToValueMap = evaluateTokensBasic(cachedParseTree);
		const plogger = prefixWrapper(`Case ${index}.  Code: ${code}`, logger);
		const matchedPrintX = cachedParseTree.getAllTokens().
			filter(t => 
				t.val === 'x' &&
				t.type === ParseTreeTokenType.STRING_LITERAL &&
				t.parentNode.val === 'print' &&
				t.parentNode.parentNode !== null);
		if (matchedPrintX.length === 1) {
			const token = matchedPrintX[0];
			const instructionList = token.parentNode.parentNode;
			const result = getInstructionListRepeatCountBasic(instructionList, tokenToValueMap);
			if (result === undefined)
				plogger('Expected to get a defined result but the result was undefined');
			else {
				if (result.min !== caseInfo.min)
					plogger(`Expected min to be ${caseInfo.min} but got ${result.min}`);
				if (result.max !== caseInfo.max)
					plogger(`Expected max to be ${caseInfo.max} but got ${result.max}`);
			}
		}
		else
			plogger('Expected 1 match but got ' + matchedPrintX.length);
	});
};
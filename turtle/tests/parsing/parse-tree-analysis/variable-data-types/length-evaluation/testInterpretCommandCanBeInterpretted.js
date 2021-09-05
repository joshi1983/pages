import { canBeInterpretted } from
'../../../../../modules/parsing/parse-tree-analysis/variable-data-types/length-evaluation/interpretCommand.js';
import { getCachedParseTreeFromCode } from '../../../../helpers/getCachedParseTreeFromCode.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';

export function testInterpretCommandCanBeInterpretted(logger) {
	const cases = [
	{'code': `repeat 2 [
		repeat :numRadialDots [
			jumpForward 1
			queue "dots pos
		]
	]`, 'variableName': 'dots', 'out': false
	},
	{'code': `repeat 2 [
		repeat :numRadialDots [
			jumpForward 1
			queue2 "dots pos
		]
	]`, 'variableName': 'dots', 'out': false
	}
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const cachedParseTree = getCachedParseTreeFromCode(caseInfo.code, logger);
		if (cachedParseTree.root.children.length !== 1)
			plogger(`Expected root.children.length to be 1 token but found ${cachedParseTree.root.children.length}`);
		else {
			const token = cachedParseTree.root.children[0];
			const result = canBeInterpretted(token, caseInfo.variableName);
			if (result !== caseInfo.out)
				plogger(`Expected ${caseInfo.out} but got ${result}`);
		}
	});
};
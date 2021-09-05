import { ArrayUtils } from
'../../../modules/ArrayUtils.js';
import { asmTurtleExamples } from '../../helpers/parsing/asmTurtleExamples.js';
import { codeHeartTurtleScriptExamples } from '../../helpers/parsing/codeHeartTurtleScriptExamples.js';
import { antiExpressions, isLikelySonicWebTurtle, likelyExpressions } from '../../../modules/parsing/sonic-webturtle/isLikelySonicWebTurtle.js';
import { javascript2DCanvasExamples } from '../../helpers/parsing/javascript2DCanvasExamples.js';
import { kturtleExampleFiles } from '../../helpers/parsing/kturtleExampleFiles.js';
import { logo3DExamples } from '../../helpers/parsing/logo3DExamples.js';
import { matchesARegex } from '../../../modules/components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';
import { microAExamples } from
'../../helpers/parsing/basic/microAExamples.js';
import { naiveStripComments } from '../../../modules/parsing/naiveStripComments.js';
import { processingExamples } from '../../helpers/parsing/processingExamples.js';
import { pythonTurtleExampleFilesContent } from '../../helpers/parsing/pythonTurtleExampleFilesContent.js';
import { sonicWebTurtleExamples } from
'../../helpers/parsing/sonicWebTurtleExamples.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';
import { webLogoExamplesContent } from
'../../helpers/parsing/webLogoExamplesContent.js';
import { wrapAndCall } from
'../../helpers/wrapAndCall.js';

const nonExamples = [];
ArrayUtils.pushAll(nonExamples, asmTurtleExamples);
ArrayUtils.pushAll(nonExamples, codeHeartTurtleScriptExamples);
ArrayUtils.pushAll(nonExamples, javascript2DCanvasExamples);
ArrayUtils.pushAll(nonExamples, kturtleExampleFiles);
ArrayUtils.pushAll(nonExamples, logo3DExamples);
ArrayUtils.pushAll(nonExamples, microAExamples);
ArrayUtils.pushAll(nonExamples, processingExamples);
ArrayUtils.pushAll(nonExamples, pythonTurtleExampleFilesContent);
ArrayUtils.pushAll(nonExamples, webLogoExamplesContent);

const cases = [
{'in': '', 'out': false},
{'in': 'fd 100', 'out': false},
{'in': 'forward 100', 'out': false},
{'in': 'setPenSize 100', 'out': false},
{'in': 'GO PATTERN\n', 'out': true},
{'in': '# PATTERN\n', 'out': true},
{'in': 'remember\ndraw 4', 'out': true}
];
sonicWebTurtleExamples.forEach(function(content) {
	cases.push({'in': content, 'out': true});
});
nonExamples.forEach(function(content) {
	cases.push({
		'in': content,
		'out': false
	});
});

function testAntiExpressions(logger) {
	for (const caseInfo of cases.filter(c => c.out === true)) {
		const code = naiveStripComments(caseInfo.in);
		for (const r of antiExpressions) {
			const result = r.test(code);
			if (result)
				logger(`code=${code}, expected out = true so no antiExpressions should match the code but ${r}.test(code) returned ${result}`);
		}
	}
}

function testLikelyExpressions(logger) {
	for (const caseInfo of cases.filter(c => c.out === false)) {
		const code = naiveStripComments(caseInfo.in);
		if (matchesARegex(antiExpressions, code))
			continue;
		for (const r of likelyExpressions) {
			const result = r.test(code);
			if (result)
				logger(`code=${code}, expected out = false but ${r}.test(code) returned ${result} and no antiExpressions matched the code.`);
		}
	}
}

function testGeneralCases(logger) {
	testInOutPairs(cases, isLikelySonicWebTurtle, logger);
}

export function testIsLikelySonicWebTurtle(logger) {
	wrapAndCall([
		testAntiExpressions,
		testGeneralCases,
		testLikelyExpressions
	], logger);
};
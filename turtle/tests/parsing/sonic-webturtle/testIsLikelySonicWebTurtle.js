import { ArrayUtils } from
'../../../modules/ArrayUtils.js';
import { asmTurtleExamples } from '../../helpers/parsing/asmTurtleExamples.js';
import { codeHeartTurtleScriptExamples } from '../../helpers/parsing/codeHeartTurtleScriptExamples.js';
import { isLikelySonicWebTurtle } from '../../../modules/parsing/sonic-webturtle/isLikelySonicWebTurtle.js';
import { kturtleExampleFiles } from '../../helpers/parsing/kturtleExampleFiles.js';
import { logo3DExamples } from '../../helpers/parsing/logo3DExamples.js';
import { pythonTurtleExampleFilesContent } from '../../helpers/parsing/pythonTurtleExampleFilesContent.js';
import { sonicWebTurtleExamples } from
'../../helpers/parsing/sonicWebTurtleExamples.js';
import { testInOutPairs } from
'../../helpers/testInOutPairs.js';
import { webLogoExamplesContent } from
'../../helpers/parsing/webLogoExamplesContent.js';

const nonExamples = [];
ArrayUtils.pushAll(nonExamples, asmTurtleExamples);
ArrayUtils.pushAll(nonExamples, codeHeartTurtleScriptExamples);
ArrayUtils.pushAll(nonExamples, kturtleExampleFiles);
ArrayUtils.pushAll(nonExamples, logo3DExamples);
ArrayUtils.pushAll(nonExamples, pythonTurtleExampleFilesContent);
ArrayUtils.pushAll(nonExamples, webLogoExamplesContent);

export function testIsLikelySonicWebTurtle(logger) {
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
	testInOutPairs(cases, isLikelySonicWebTurtle, logger);
};
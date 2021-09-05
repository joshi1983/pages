import { ArrayUtils } from '../../modules/ArrayUtils.js';
import { asmTurtleExamples } from '../helpers/parsing/asmTurtleExamples.js';
import { exceptionToString } from '../../modules/exceptionToString.js';
import { fmsLogoExamples } from '../helpers/parsing/fmsLogoExamples.js';
import { kturtleExamples } from '../helpers/parsing/kturtleExamples.js';
import { logo3DExamples } from '../helpers/parsing/logo3DExamples.js';
import { logoInterpreterExamples } from '../helpers/parsing/logoInterpreterExamples.js';
import { LogoScanner } from '../../modules/parsing/LogoScanner.js';
import { odinExamples } from '../helpers/parsing/odinExamples.js';
import { osmosianExamples } from '../helpers/parsing/osmosianExamples.js';
import { papertExamples } from '../helpers/parsing/papertExamples.js';
import { povRayExamples } from '../helpers/parsing/povRayExamples.js';
import { processingExamples } from '../helpers/parsing/processingExamples.js';
import { pythonTurtleExampleFilesContent } from '../helpers/parsing/pythonTurtleExampleFilesContent.js';
import { qbasicExamples } from '../helpers/parsing/basic/qbasicExamples.js';
import { smallVisualBasicExamples } from '../helpers/parsing/basic/smallVisualBasicExamples.js';
import { sonicWebTurtleExamples } from '../helpers/parsing/sonicWebTurtleExamples.js';
import { terrapinExamples } from '../helpers/parsing/terrapinExamples.js';
import { webLogoExamplesContent } from '../helpers/parsing/webLogoExamplesContent.js';

const examples = ArrayUtils.combine(asmTurtleExamples, fmsLogoExamples, kturtleExamples,
logo3DExamples, logoInterpreterExamples, odinExamples, osmosianExamples, papertExamples
, povRayExamples, processingExamples, pythonTurtleExampleFilesContent, qbasicExamples,
smallVisualBasicExamples, sonicWebTurtleExamples, terrapinExamples, webLogoExamplesContent);

export function testScanVariousExamples(logger) {
	examples.forEach(function(code, index) {
		try {
			LogoScanner.scan(code);
		} catch (e) {
			console.error(e);
			logger(`Case ${index}, threw error or exception while scanning code ${code}.  The message was: ${exceptionToString(e)}`);
		}
	});
};
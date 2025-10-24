import { applesoftExamples } from
'../../../helpers/parsing/basic/applesoftExamples.js';
import { ArrayUtils } from
'../../../../modules/ArrayUtils.js';
import { asmTurtleExamples } from
'../../../helpers/parsing/asmTurtleExamples.js';
import { bbcBasicExamples } from
'../../../helpers/parsing/basic/bbcBasicExamples.js';
import { billNyeExamples } from
'../../../helpers/parsing/billNyeExamples.js';
import { cheerfulNetherlandsLogoExamples } from
'../../../helpers/parsing/cheerfulNetherlandsLogoExamples.js';
import { cgjenningsExamples } from
'../../../helpers/parsing/cgjenningsExamples.js';
import { codeHeartTurtleScriptExamples } from
'../../../helpers/parsing/codeHeartTurtleScriptExamples.js';
import { exceptionToString } from
'../../../../modules/exceptionToString.js';
import { fixCode } from
'../../../../modules/components/code-editor/code-fixer/fixCode.js';
import { FixLogger } from
'../../../../modules/components/code-editor/code-fixer/FixLogger.js';
import { fmsLogoExamples } from
'../../../helpers/parsing/fmsLogoExamples.js';
import { fractintExamples } from
'../../../helpers/parsing/fractintExamples.js';
import { getProceduresMap } from
'../../../../modules/parsing/parse-tree-analysis/getProceduresMap.js';
import { javascript2DCanvasExamples } from
'../../../helpers/parsing/javascript2DCanvasExamples.js';
import { kturtleExampleFiles } from
'../../../helpers/parsing/kturtleExampleFiles.js';
import { logo3DExamples } from
'../../../helpers/parsing/logo3DExamples.js';
import { logoInterpreterExamples } from
'../../../helpers/parsing/logoInterpreterExamples.js';
import { LogoParser } from
'../../../../modules/parsing/LogoParser.js';
import { odinExamples } from
'../../../helpers/parsing/odinExamples.js';
import { osmosianExamples } from
'../../../helpers/parsing/osmosianExamples.js';
import { papertExamples } from
'../../../helpers/parsing/papertExamples.js';
import { ParseLogger } from
'../../../../modules/parsing/loggers/ParseLogger.js';
import { povRayExamples } from
'../../../helpers/parsing/povRayExamples.js';
import { qbasicExamples } from
'../../../helpers/parsing/basic/qbasicExamples.js';
import { smallVisualBasicExamples } from
'../../../helpers/parsing/basic/smallVisualBasicExamples.js';
import { sonicWebTurtleExamples } from
'../../../helpers/parsing/sonicWebTurtleExamples.js';
import { sugarLabsTurtleBlocksExamples } from
'../../../helpers/parsing/sugarLabsTurtleBlocksExamples.js';
import { sugarLabsTurtleBlocksHTMLExamples } from
'../../../helpers/parsing/sugarLabsTurtleBlocksHTMLExamples.js';
import { terrapinExamples } from
'../../../helpers/parsing/terrapinExamples.js';

const examples = [];
ArrayUtils.pushAll(examples, applesoftExamples);
ArrayUtils.pushAll(examples, asmTurtleExamples);
ArrayUtils.pushAll(examples, bbcBasicExamples);
ArrayUtils.pushAll(examples, billNyeExamples);
ArrayUtils.pushAll(examples, cheerfulNetherlandsLogoExamples);
ArrayUtils.pushAll(examples, cgjenningsExamples);
ArrayUtils.pushAll(examples, codeHeartTurtleScriptExamples);
ArrayUtils.pushAll(examples, fmsLogoExamples);
ArrayUtils.pushAll(examples, fractintExamples);
ArrayUtils.pushAll(examples, javascript2DCanvasExamples);
ArrayUtils.pushAll(examples, kturtleExampleFiles);
ArrayUtils.pushAll(examples, logo3DExamples);
ArrayUtils.pushAll(examples, logoInterpreterExamples);
ArrayUtils.pushAll(examples, odinExamples);
ArrayUtils.pushAll(examples, osmosianExamples);
ArrayUtils.pushAll(examples, papertExamples);
ArrayUtils.pushAll(examples, povRayExamples);
ArrayUtils.pushAll(examples, qbasicExamples);
ArrayUtils.pushAll(examples, smallVisualBasicExamples);
ArrayUtils.pushAll(examples, sonicWebTurtleExamples);
ArrayUtils.pushAll(examples, sugarLabsTurtleBlocksExamples);
ArrayUtils.pushAll(examples, sugarLabsTurtleBlocksHTMLExamples);
ArrayUtils.pushAll(examples, terrapinExamples);

export function testFixCodeWithVariousExamples(logger) {
	examples.forEach(function(code, index) {
		try {
			const parseLogger = new ParseLogger();
			const fixLogger = new FixLogger(parseLogger);
			const tree = LogoParser.getParseTree(code, parseLogger);
			let proceduresMap = new Map();
			if (tree !== undefined) {
				proceduresMap = getProceduresMap(tree);
			}
			fixCode(code, fixLogger, proceduresMap);
		} catch (e) {
			console.error(e);
			logger(`Index ${index}, input code=${code}, exception ${exceptionToString(e)}`);
		}
	});
};
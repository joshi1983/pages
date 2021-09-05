import { allFixers } from
'../../../../modules/components/code-editor/code-fixer/fixers/allFixers.js';
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
'../../../helpers/parsing/l-systems/cgjenningsExamples.js';
import { codeHeartTurtleScriptExamples } from
'../../../helpers/parsing/codeHeartTurtleScriptExamples.js';
import { Command } from
'../../../../modules/parsing/Command.js';
import { exceptionToString } from
'../../../../modules/exceptionToString.js';
import { fixCode } from
'../../../../modules/components/code-editor/code-fixer/fixCode.js';
import { FixLogger } from
'../../../../modules/components/code-editor/code-fixer/FixLogger.js';
import { fmsLogoExamples } from
'../../../helpers/parsing/fmsLogoExamples.js';
import { fractintExamples } from
'../../../helpers/parsing/l-systems/fractintExamples.js';
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
import { ParseTreeTokenType } from
'../../../../modules/parsing/ParseTreeTokenType.js';
import { povRayExamples } from
'../../../helpers/parsing/povRayExamples.js';
import { prefixWrapper } from
'../../../helpers/prefixWrapper.js';
import { ProgressIndicator } from '../../../helpers/ProgressIndicator.js';
import { qbasicExamples } from
'../../../helpers/parsing/basic/qbasicExamples.js';
import { sleep } from '../../../helpers/sleep.js';
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
import { WriteOptimizedCachedParseTree } from
'../../../../modules/parsing/parse-tree-analysis/WriteOptimizedCachedParseTree.js';

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

function checkAllFixers(code, fixLogger, parseLogger, logger) {
	const tree = LogoParser.getParseTree(code, parseLogger);
	if (tree === undefined)
		return;

	let proceduresMap = new Map();
	proceduresMap = getProceduresMap(tree);
	const cachedParseTree = new WriteOptimizedCachedParseTree(tree, proceduresMap);
	let breakOuterLoop = false;
	let plogger;
	try {
		for (let i = 0; i < 2; i++) {
			for (const fixer of allFixers) {
				plogger = prefixWrapper(`i=${i}, running fixer ${fixer.name}`, logger);

				fixer(cachedParseTree, fixLogger);
				plogger = prefixWrapper(`i=${i}, After fixer ${fixer.name}`, logger);
				if (cachedParseTree.checkConsistency('' + fixer.name)) {
					plogger(`Consistency check failed.  See console messages for details.`);
					break;
				}
				else {
					const commandCalls = cachedParseTree.getTokensByType(ParseTreeTokenType.PARAMETERIZED_GROUP);
					for (const call of commandCalls) {
						const info = Command.getCommandInfo(call.val);
						if (info !== undefined) {
							const argCount = Command.getArgCount(info);
							if (argCount.min > call.children.length) {
								plogger(`At least ${argCount.min} arguments required for command ${call.val} but found ${call.children.length} children.`);
								breakOuterLoop = true;
								break;
							}
						}
					}
					if (breakOuterLoop)
						break;
				}
			}
			if (breakOuterLoop)
				break;
		}
	}
	catch (e) {
		if (plogger === undefined)
			plogger = logger;
		const msg = `Failed. e=${exceptionToString(e)}`;
		console.error(msg);
		plogger(msg);
	}
}

export async function testFixCodeWithVariousExamples(logger) {
	const progressIndicator = new ProgressIndicator('testFixCodeWithVariousExamples');
	logger.indicators.push(progressIndicator);
	for (let index = 0; index < examples.length; index++) {
		const code = examples[index];
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		try {
			const parseLogger = new ParseLogger();
			const fixLogger = new FixLogger(parseLogger);
			checkAllFixers(code, fixLogger, parseLogger, plogger);

			const tree = LogoParser.getParseTree(code, parseLogger);
			let proceduresMap = new Map();
			if (tree !== undefined) {
				proceduresMap = getProceduresMap(tree);
			}
			
			fixCode(code, fixLogger, proceduresMap);
		} catch (e) {
			console.error(e);
			plogger(`exception ${exceptionToString(e)}`);
		}
		await sleep(1);
		progressIndicator.setProgressRatio(index / examples.length);
		progressIndicator.setMessage(`${index} of ${examples.length}`);
	}
	progressIndicator.completed();
};
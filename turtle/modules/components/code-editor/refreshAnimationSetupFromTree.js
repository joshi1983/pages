import { analyzeCodeQuality } from '../../parsing/parse-tree-analysis/validation/analyzeCodeQuality.js';
import { Code } from './Code.js';
import { compile } from '../../parsing/compile.js';
import { executeLogoProcedure } from '../../parsing/execution/executeLogoProcedure.js';
import { getProceduresMap } from '../../parsing/parse-tree-analysis/getProceduresMap.js';
import { ParseLogger } from '../../parsing/loggers/ParseLogger.js';
import { Settings } from '../../Settings.js';
import { ToastMessages } from '../ToastMessages.js';

async function refreshAnimationSetup() {
	const parseLogger = new ParseLogger();
	await Code.refreshProgram(parseLogger);
	if (parseLogger.hasLoggedErrors() === false) {
		refreshAnimationSetupFromTree(Code.tree);
	}
}

export function refreshAnimationSetupFromTree(tree) {
	const parseLogger = new ParseLogger();
	const proceduresMap = getProceduresMap(tree);
	const initialVariablesMap = Code.executer === undefined ? new Map() : Code.executer.getGlobalVariables();
	analyzeCodeQuality(tree, parseLogger, proceduresMap, initialVariablesMap);
	if (parseLogger.hasLoggedErrors() === false) {
		const program = compile(undefined, tree, parseLogger, proceduresMap, {'translateToJavaScript': false}, initialVariablesMap);
		if (parseLogger.hasLoggedErrors() === false) {
			const proc = program.procedures.get('animation.setup');
			if (proc !== undefined) {
				executeLogoProcedure(program, proc.name).then(function(animationDurationSeconds) {
					if (typeof animationDurationSeconds === 'number' && !isNaN(animationDurationSeconds) && animationDurationSeconds > 0)
						Settings.animationDurationSeconds = animationDurationSeconds;
					else {
						let msg = 'The animation.setup procedure should return a positive number but instead got ';
						if (typeof animationDurationSeconds === 'string')
							msg += `a string "${animationDurationSeconds}"`;
						else if (typeof animationDurationSeconds === 'number' && animationDurationSeconds <= 0)
							msg += `a negative number ${animationDurationSeconds}`;
						else if (animationDurationSeconds === null)
							msg += 'no value';
						else
							msg += 'something else';

						msg += '.  Adjust your animation.setup implementation to return a number greater than 0.';
						ToastMessages.warn(msg, false);
					}
				});
			}
		}
	}
};

refreshAnimationSetup();
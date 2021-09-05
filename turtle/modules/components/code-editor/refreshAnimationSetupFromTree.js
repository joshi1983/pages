import { analyzeCodeQuality } from '../../parsing/parse-tree-analysis/validation/analyzeCodeQuality.js';
import { Code } from './Code.js';
import { compile } from '../../parsing/compile.js';
import { executeLogoProcedure } from '../../parsing/execution/executeLogoProcedure.js';
import { getProceduresMap } from '../../parsing/parse-tree-analysis/getProceduresMap.js';
import { isNumber } from '../../isNumber.js';
import { ParseLogger } from '../../parsing/loggers/ParseLogger.js';
import { Settings } from '../../Settings.js';
import { ToastMessages } from '../ToastMessages.js';

export function refreshAnimationSetupFromTree(tree) {
	const parseLogger = new ParseLogger();
	const proceduresMap = getProceduresMap(tree);
	const initialVariablesMap = Code.executer === undefined ? new Map() : Code.executer.getGlobalVariables();
	analyzeCodeQuality(tree, parseLogger, proceduresMap, initialVariablesMap, {});
	if (parseLogger.hasLoggedErrors() === false) {
		const compileOptions = {'translateToJavaScript': true, 'mergeJavaScriptInstructions': true};
		const program = compile(undefined, tree, parseLogger, proceduresMap, compileOptions, initialVariablesMap);
		if (parseLogger.hasLoggedErrors() === false) {
			const proc = program.procedures.get('animation.setup');
			if (proc !== undefined) {
				executeLogoProcedure(program, proc.name).then(function(animationSetupResult) {
					if (animationSetupResult instanceof Map && animationSetupResult.has('duration') && 
					isNumber(animationSetupResult.get('duration')) &&
					animationSetupResult.get('duration') > 0) {
						Settings.animationDurationSeconds = animationSetupResult.get('duration');
					}
					else {
						let msg = 'The animation.setup procedure should return a property list with a positive number as duration but instead got ';
						if (animationSetupResult instanceof Map) {
							if (animationSetupResult.has('duration'))
								msg += `a property list with an invalid duration ${animationSetupResult.get('duration')}`;
							else 
								msg += `a property list that does not specify duration`;
						}
						else if (animationSetupResult === null)
							msg += 'no value';
						else
							msg += 'something else';

						msg += '.  Adjust your animation.setup implementation to return a property list and duration number greater than 0.';
						console.error(msg);
						ToastMessages.warn(msg, false);
					}
				});
			}
		}
	}
};
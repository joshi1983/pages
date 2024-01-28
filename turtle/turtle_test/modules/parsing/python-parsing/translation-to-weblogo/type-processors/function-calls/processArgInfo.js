import { mightDegreeScaleBeChanged } from '../../../parse-tree-analysis/procedure-dependencies/mightDegreeScaleBeChanged.js';

function alwaysTrue() {
	return true;
}

export function processArgInfo(argInfo, result, cachedParseTree) {
	if (argInfo.wrapWithCommands instanceof Array) {
		let ignoreIfFalse = alwaysTrue;
		if (argInfo.ignoreIfFalse === 'mightDegreeScaleBeChanged')
			ignoreIfFalse = mightDegreeScaleBeChanged;
		if (ignoreIfFalse(cachedParseTree) === false)
			return;
		argInfo.wrapWithCommands.forEach(function(commandName) {
			result.append(` ${commandName} `);
		});
	}
};
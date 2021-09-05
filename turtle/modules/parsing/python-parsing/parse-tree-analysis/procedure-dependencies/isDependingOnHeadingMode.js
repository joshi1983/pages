import { fetchText } from '../../../../fetchText.js';
import { getTokensByType } from '../../../generic-parsing-utilities/getTokensByType.js';
import { LogoParser } from '../../../LogoParser.js';
import { ParseLogger } from '../../../loggers/ParseLogger.js';
import { ParseTreeTokenType } from '../../ParseTreeTokenType.js';
import { PythonFunctions } from '../../PythonFunctions.js';
import { scrapeProceduresFromParseTreeTokens } from '../../../parse-tree-analysis/scrapeProceduresFromParseTreeTokens.js';
import { SetUtils } from '../../../../SetUtils.js';

await LogoParser.asyncInit();
const code = await fetchText('logo-scripts/python-turtle-content/headingMode.lgo');
const parseLogger = new ParseLogger();
const tree = LogoParser.getParseTree(code, parseLogger, new Map());
const headingModeProcedureNames = new Set(scrapeProceduresFromParseTreeTokens(tree).map( proc => proc.name));
const headingModeFunctionNames = new Set([
	'backward', 'circle', 'forward', 'heading'
]);

PythonFunctions.getAllFunctions().forEach(function(functionInfo) {
	let isAdding = false;
	if (functionInfo.isTranslatedToProcedure === true &&
	headingModeProcedureNames.has(functionInfo.translateToCommand.toLowerCase())) {
		isAdding = true;
	}
	else if (functionInfo.args instanceof Array) {
		if (functionInfo.args.some(argInfo => argInfo.wrapWithCommands !== undefined &&
		argInfo.wrapWithCommands.some(name => headingModeProcedureNames.has(name.toLowerCase()))))
			isAdding = true;
	}
	if (isAdding) {
		SetUtils.addAll(headingModeFunctionNames, functionInfo.names);
	}
});

for (let name of headingModeFunctionNames) {
	const functionInfo = PythonFunctions.getFunctionInfo(name);
	SetUtils.addAll(headingModeFunctionNames, functionInfo.names);
}

export function isDependingOnHeadingMode(cachedParseTree) {
	if (cachedParseTree._isDependingOnHeadingMode === undefined) {
		cachedParseTree._isDependingOnHeadingMode = getTokensByType(cachedParseTree, ParseTreeTokenType.FUNCTION_CALL).
		some(token => headingModeFunctionNames.has(token.val.toLowerCase()));
	}
	return cachedParseTree._isDependingOnHeadingMode;
};
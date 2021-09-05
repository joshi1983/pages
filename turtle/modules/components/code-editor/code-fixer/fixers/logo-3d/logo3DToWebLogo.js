import { breakLinesInProcedures } from './breakLinesInProcedures.js';
import { BufferedParseLogger } from '../../../../../parsing/loggers/BufferedParseLogger.js';
import { compositeFixer } from './compositeFixer.js';
import { fetchJson } from '../../../../../fetchJson.js';
import { FixLogger } from '../../FixLogger.js';
import { flatten } from '../../../../../parsing/generic-parsing-utilities/flatten.js';
import { getProceduresMap } from '../../../../../parsing/parse-tree-analysis/getProceduresMap.js';
import { hasUnsafeErrorMessages } from '../../hasUnsafeErrorMessages.js';
import { LogoParser } from '../../../../../parsing/LogoParser.js';
import { minusFixer } from '../helpers/minusFixer.js';
import { parseTreeToCodeWithComments } from '../../../../../parsing/parseTreeToCodeWithComments.js';
import { ParseTreeTokenType } from '../../../../../parsing/ParseTreeTokenType.js';
import { StringUtils } from '../../../../../StringUtils.js';
import { wrappedFix } from '../../wrappedFix.js';

const migrationInfo = await fetchJson('json/logo-migrations/Logo_3D.json');
const arcUpDownNames = new Map([
	['arcdown', 'arcDown'],
	['arcup', 'arcUp']
]);
const procedureImplementations = new Map([
['arcUp', `to arcUp :angle :radius
	rollRight 90
	arcLeft :angle :radius
	rollLeft 90
end`],
['arcDown', `to arcDown :angle :radius
	rollRight 90
	arcLeft -:angle :radius
	rollLeft 90
end`],
]);
['arcdown', 'arcup'].forEach(function(primaryName) {
	const info = migrationInfo.commands.filter(commandInfo => commandInfo.primaryName === primaryName)[0];
	if (info === undefined)
		throw new Error(`Unable to find a command with primaryName ${primaryName} in Logo 3D's migration file`);
	const newName = arcUpDownNames.get(primaryName);
	arcUpDownNames.set(primaryName, newName);
	if (info.names !== undefined) {
		for (const name of info.names) {
			arcUpDownNames.set(name, newName);
		}
	}
});

function isOfInterest(token) {
	if (token.type !== ParseTreeTokenType.LEAF)
		return false;
	if (!arcUpDownNames.has(token.val))
		return false;
	return true;
}

function getCallsOfInterest(tree) {
	return flatten(tree).filter(isOfInterest);
}

function processArcUpDown(code, fixLogger) {
	const parseLogger = new BufferedParseLogger();
	const tree = LogoParser.getParseTree(code, parseLogger);
	const tokens = getCallsOfInterest(tree);
	const fromNames = new Set();
	const toNames = new Set();
	tokens.forEach(function(token) {
		fromNames.add(token.val);
		const newName = arcUpDownNames.get(token.val);
		token.val = newName;
		toNames.add(newName);
	});
	let proceduresExpression = 'a new procedure';
	if (toNames.size !== 1)
		proceduresExpression = 'new procedures';
	fixLogger.log(`Replaced calls from ${StringUtils.clearEnglishListPhrase(fromNames)} `+
		`to ${StringUtils.clearEnglishListPhrase(toNames)} with calls to ${proceduresExpression}`, tokens[0]);
	let prefix = '';
	for (const name of toNames) {
		const procedureImplementation = procedureImplementations.get(name);
		prefix += procedureImplementation + '\n\n';
	}
	return prefix + parseTreeToCodeWithComments(tree, code);
}

export function logo3DToWebLogo(code, parseLogger) {
	code = breakLinesInProcedures(code);
	code = `setScreenColor "black\nsetColors "white\n` + code;
	const tempParseLogger = new BufferedParseLogger();
	let tree = LogoParser.getParseTree(code, tempParseLogger);
	if (tree === undefined)
		return code; // the code is unfixable if it can't be parsed.
	const proceduresMap = getProceduresMap(tree);
	const fixLogger = new FixLogger(parseLogger);
	code = wrappedFix(code, compositeFixer, fixLogger, proceduresMap, tree);

	const beforeCode = code;
	code = minusFixer(beforeCode, fixLogger);
	if (code !== beforeCode)
		tree = LogoParser.getParseTree(code, tempParseLogger);

	if (getCallsOfInterest(tree).length === 0)
		return code;

	// Parses directly from the code to make sure there is no 
	// inconsistency between state of the parse tree and the corresponding code.
	// The compositeFixer likely made lots of changes which could make values of colIndex mismatch their reparsed values.
	return processArcUpDown(code, fixLogger);
};
import { compileOptionsArray } from
'./parsing/execution/compileOptionsArray.js';
import { exceptionToString } from '../modules/exceptionToString.js';
import { fetchJson } from '../modules/fetchJson.js';
import { getTokenValueBasic } from
'../modules/parsing/parse-tree-analysis/variable-data-types/getTokenValueBasic.js';
import { getTestExecuterForCode } from
'./helpers/getTestExecuterForCode.js';
import { isNumber } from
'../modules/isNumber.js';
import { LogoParser } from '../modules/parsing/LogoParser.js';
import { ParseLogger } from '../modules/parsing/loggers/ParseLogger.js';
import { ParseTreeTokenType } from '../modules/parsing/ParseTreeTokenType.js';
import { prefixWrapper } from './helpers/prefixWrapper.js';

await LogoParser.asyncInit();
const compileOptions = compileOptionsArray[compileOptionsArray.length - 1];

function validateCode(code, logger) {
	const parseLogger = new ParseLogger();
	const tree = LogoParser.getParseTree(code, parseLogger);
	if (tree === undefined)
		logger(`Failed to parse: ${code}`);

	return tree;
}

function isSimple(tree) {
	return tree.children.length === 1 &&
		tree.children[0].type === ParseTreeTokenType.NUMBER_LITERAL;
}

function evaluateSimpleExpression(tree, originalCode, logger) {
	const children = tree.children;
	if (children.length === 1) {
		const result = getTokenValueBasic(children[0]);
		if (result !== undefined)
			return result;
	}
	const code = 'print ' + originalCode;
	const analyzeCodeQuality = false;
	const messages = [];
	const optionalSettings = {
		'print': function(s) {
			messages.push(s);
		}
	};
	const executer = getTestExecuterForCode(code, logger, compileOptions, optionalSettings, analyzeCodeQuality);
	executer.executeInstructionsSync(100);
	if (messages.length !== 1)
		logger(`Expected 1 message but found ${messages.length}`);
	else
		return parseFloat(messages[0]);
}

export async function testEqualities(logger) {
	try {
		const data = await fetchJson('json/equalities.json');
		if (!(data instanceof Array))
			logger(`equalities.json should parse as an Array but found ${data}`);
		else {
			data.forEach(function(equalityInfo, index) {
				if (!(equalityInfo instanceof Array))
					logger(`Each element of equalities should be an Array but found ${equalityInfo} at index ${index}`);
				else if (equalityInfo.length < 2)
					logger(`Each element of equalities should have a minimum length of 2 but found length ${equalityInfo.length} at index ${index}`);
				else {
					const plogger = prefixWrapper(`Equality ${index}, left side = ${equalityInfo[0]}, right side = ${equalityInfo[1]}`, logger);
					for (const child of equalityInfo) {
						if (typeof child !== 'string') {
							plogger(`Every element should be a string but found type ${typeof child}`);
						}
					}
					const tree1 = validateCode(equalityInfo[0], prefixWrapper('Validating [0]', plogger));
					const tree2 = validateCode(equalityInfo[1], prefixWrapper('Validating [1]', plogger));
					if (tree1 !== undefined && tree2 !== undefined) {
						if (isSimple(tree1) || isSimple(tree2)) {
							let val1 = evaluateSimpleExpression(tree1, equalityInfo[0], plogger),
							val2 = evaluateSimpleExpression(tree2, equalityInfo[1], plogger);
							if (!isNumber(val1) || !isNumber(val2))
								plogger(`Expected both results to be a number but val1= ${val1}, val2=${val2}`);
							else {
								if (Math.abs(val1 - val2) > 0.00001)
									plogger(`Expected both results to be equal but val1= ${val1}, val2=${val2}`);
							}
						}
					}
				}
			});
		}
	} catch (e) {
		console.error(e);
		logger(`Error thrown.  e=${exceptionToString(e)}`);
	}
};
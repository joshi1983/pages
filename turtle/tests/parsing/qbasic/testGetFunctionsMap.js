import { getFunctionsMap } from
'../../../modules/parsing/qbasic/getFunctionsMap.js';
import { prefixWrapper } from
'../../helpers/prefixWrapper.js';
import { sanitizeTokens } from
'../../../modules/parsing/qbasic/scanning/sanitizeTokens.js';
import { scan } from
'../../../modules/parsing/qbasic/scanning/scan.js';

function validateFunction(f, logger) {
	if (typeof f.name !== 'string')
		logger(`The function name must be a string but found ${f.name}`);
	else if (f.name.toLowerCase() !== f.name)
		logger(`The function name must be in lower case but found ${f.name}`);
	if (!(f.args instanceof Array))
		logger(`args must be an Array but found ${f.args}.  This is for a function with name ${f.name}`);
	else {
		for (const argInfo of f.args) {
			if (typeof argInfo !== 'object')
				logger(`Every args element must be an object but found ${argInfo}`);
			else {
				if (typeof argInfo.name !== 'string')
					logger(`Every args element must have a string name but found ${argInfo.name}`);
			}
		}
	}
}

export function testGetFunctionsMap(logger) {
	const cases = [
	{'code': '', 'names': []},
	{'code': `FUNCTION Min% (a AS INTEGER, b AS INTEGER)
  IF (a < b) THEN
    Min% = a
  ELSE
    Min% = b
  END IF
END FUNCTION`, 'names': ['min%']},
	{
		'code': 'DECLARE SUB delay (seconds!)',
		'names': ['delay']
	},
	{
		'code': `DECLARE SUB b ()
b`,
		'names': ['b']
	}];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}`, logger);
		const tokens = scan(caseInfo.code);
		sanitizeTokens(tokens);
		const result = getFunctionsMap(tokens);
		if (!(result instanceof Map))
			plogger(`Expected result to be a Map but found ${result}`);
		else if (result.size !== caseInfo.names.length)
			plogger(`Expected ${caseInfo.names.length} functions but found ${result.size}`);
		else {
			for (const name of caseInfo.names) {
				if (!result.has(name))
					plogger(`Expected a function with name ${name} but not found. The names found are ${Array.from(result.keys()).join(', ')}`);
			}
			for (const f of result.values()) {
				validateFunction(f, plogger);
			}
		}
	});
};
import { getProcedureInfo } from '../../modules/components/command-input/getProcedureInfo.js';
import { LogoScanner } from '../../modules/parsing/LogoScanner.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
await LogoScanner.asyncInit();

export function testGetProcedureInfo(logger) {
	const cases = [
		{'code': '', 'guiCommand': 'to', 'matchesAction': false},
		{'code': 'fd 100', 'guiCommand': 'to', 'matchesAction': false},
		{'code': 'make "to 1', 'guiCommand': 'to', 'matchesAction': false},
		{'code': 'to', 'guiCommand': 'to', 'matchesAction': true, 'procName': '', 'params': []},
		{'code': 'to', 'guiCommand': 'edit', 'matchesAction': false},
		{'code': 'edit', 'guiCommand': 'edit', 'matchesAction': true, 'procName': '', 'params': []},
		{'code': 'to someMethodName', 'guiCommand': 'edit', 'matchesAction': false},
		{'code': 'to someMethodName', 'guiCommand': 'to', 'matchesAction': true, 'procName': 'someMethodName', 'params': []},
		{'code': 'to someMethodName :x', 'guiCommand': 'to', 'matchesAction': true, 'procName': 'someMethodName', 'params': ['x']},
		{'code': 'to someMethodName :x :y', 'guiCommand': 'to', 'matchesAction': true, 'procName': 'someMethodName', 'params': ['x', 'y']},
		{'code': 'to someMethodName :X :Y', 'guiCommand': 'to', 'matchesAction': true, 'procName': 'someMethodName', 'params': ['X', 'Y']},
		{'code': 'to someMethodName x', 'guiCommand': 'to', 'matchesAction': true, 'procName': 'someMethodName', 'params': ['x']},
		{'code': 'to someMethodName +', 'guiCommand': 'to', 'matchesAction': true, 'procName': 'someMethodName', 'params': []},
		{'code': 'to someMethodName x;some comment', 'guiCommand': 'to', 'matchesAction': true, 'procName': 'someMethodName', 'params': ['x']},
		{'code': 'edit someMethodName x;some comment', 'guiCommand': 'edit', 'matchesAction': true, 'procName': 'someMethodName', 'params': ['x']},
		{'code': 'edit "someMethodName "x;some comment', 'guiCommand': 'edit', 'matchesAction': true, 'procName': 'someMethodName', 'params': ['x']},
	];
	cases.forEach(function(caseInfo) {
		const tokens = LogoScanner.scan(caseInfo.code);
		const actualResult = getProcedureInfo(tokens, caseInfo.guiCommand);
		const plogger = prefixWrapper('Failure while processing code "' + caseInfo.code + '"', logger);
		if (caseInfo.matchesAction !== (actualResult !== undefined))
			plogger('Expected to match of ' + caseInfo.matchesAction + ' expected but something else was returned.');
		else if (caseInfo.matchesAction) {
			if (actualResult.name !== caseInfo.procName)
				plogger('Expected to get a name ' + caseInfo.procName + ' but got ' + actualResult.name);
			if (actualResult.params.length !== caseInfo.params.length)
				plogger('Expected to get ' + caseInfo.params.length + ' parameters but got ' + actualResult.params.length);
			if (typeof actualResult.templateCode !== 'string')
				plogger('Expected templateCode to be a string but got "' + actualResult.templateCode + '"');
		}
	});
};
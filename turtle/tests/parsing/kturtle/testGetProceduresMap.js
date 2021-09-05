import { getProceduresMap } from '../../../modules/parsing/kturtle/getProceduresMap.js';
import { parse } from '../../../modules/parsing/kturtle/parse.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';

export function testGetProceduresMap(logger) {
	const cases = [
	{'code': '', 'size': 0},
	{'code': `learn p {}`, 'size': 1, 'checks': [
		{'procName': 'p', 'numParameters': 0}
	]},
	{'code': `learn p {}
learn q {}`, 'size': 2},
	{'code': `learn p $x {}`, 'size': 1, 'checks': [
		{'procName': 'p', 'numParameters': 1}
	]},
	{'code': `learn p $x , $y {}`, 'size': 1, 'checks': [
		{'procName': 'p', 'numParameters': 2}
	]},
	{'code': `learn p $x , $y , $z {}`, 'size': 1, 'checks': [
		{'procName': 'p', 'numParameters': 3}
	]},
	];
	cases.forEach(function(caseInfo, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${caseInfo.code}`, logger);
		const parseResult = parse(caseInfo.code);
		const procs = getProceduresMap(parseResult.root);
		if (procs.size !== caseInfo.size)
			plogger(`Expected size to be ${caseInfo.size} but got ${procs.size} procedures.  procedure names are ${Array.from(procs.keys()).join(', ')}`);
		if (caseInfo.checks instanceof Array) {
			caseInfo.checks.forEach(function(checkInfo) {
				const proc = procs.get(checkInfo.procName);
				if (proc === undefined)
					plogger(`Expected to find a procedure named ${checkInfo.procName} but did not.  The procs found are: ${Array.from(procs.keys()).join(', ')}`);
				else if (proc.parameters.length !== checkInfo.numParameters) {
					plogger(`Expected number of parameters to be ${checkInfo.numParameters} but got ${proc.parameters.length}`);
				}
			});
		}
	});
};
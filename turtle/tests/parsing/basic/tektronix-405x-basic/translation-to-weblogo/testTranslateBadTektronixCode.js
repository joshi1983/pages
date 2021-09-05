import { Command } from
'../../../../../modules/parsing/Command.js';
import { exceptionToString } from
'../../../../../modules/exceptionToString.js';
import { fetchJson } from
'../../../../../modules/fetchJson.js';
import { prefixWrapper } from
'../../../../helpers/prefixWrapper.js';
import { QBasicInternalFunctions } from
'../../../../../modules/parsing/basic/qbasic/QBasicInternalFunctions.js';
import { translateTektronix405XBasicToWebLogo } from
'../../../../../modules/parsing/basic/tektronix-405x-basic/translation-to-weblogo/translateTektronix405XBasicToWebLogo.js';

const migrationDataToQBasic = await fetchJson('json/logo-migrations/basic/tektronix-basic/migrationToQBasic.json');

function needsAtLeast1Arg(f) {
	if (f.argCount !== undefined)
		return f.argCount.min !== 0;
	if (f.args instanceof Array)
		return f.args.length !== 0;
	if (f.to !== undefined) {
		const qbInfo = QBasicInternalFunctions.getFunctionInfo(f.to);
		if (qbInfo.argCount !== undefined)
			return qbInfo.argCount.min !== 0;
		if (qbInfo.args !== undefined)
			return qbInfo.args.length !== 0;
		if (qbInfo.to !== undefined) {
			const info = Command.getCommandInfo(qbInfo.to);
			const argCount = Command.getArgCount(info);
			return argCount.min !== 0;
		}
	}
	return false; // We don't really know but return false anyway.
}

export function testTranslateBadTektronixCode(logger) {
	const cases = [
		'degreeacs', 'degreeasn', 'degreeatn', 'degreecos', 'degreesin', 'degreetan',
		'degreerotate',
		'rotate',
		'set DEGREES\nrotate'
	];
	// add some examples calling functions that
	// need more parameters than provided.
	for (const f of migrationDataToQBasic.functions) {
		if (needsAtLeast1Arg(f))
			cases.push(f.name);
	}
	cases.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		try {
			const result = translateTektronix405XBasicToWebLogo(code);
			if (typeof result !== 'string')
				plogger(`Expected a string but found ${result}`);
		}
		catch (e) {
			console.error(e);
			plogger(`Exception thrown while translating.  e=${exceptionToString(e)}`);
		}
	});
};
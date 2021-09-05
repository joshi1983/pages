import { InternalProcedures } from
'../../parsing/compiling/InternalProcedures.js';
import { StringBuffer } from
'../../StringBuffer.js';
import { StringUtils } from
'../../StringUtils.js';

export function getInternalProcedureCodeExample(commandPrimaryName) {
	const result = new StringBuffer();
	result.append('<code>; The following is the internal WebLogo implementation.');
	result.append('\n; If you want something slightly different,');
	result.append('\n; copy this, adapt as you like, and use a different procedure name.\n');
	result.append(StringUtils.escapeHTML(InternalProcedures.getCodeForProcedure(commandPrimaryName)));
	result.append('</code>');
	return result.toString();
};
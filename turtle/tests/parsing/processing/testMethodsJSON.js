import { Command } from '../../../modules/parsing/Command.js';
import { fetchJson } from '../../../modules/fetchJson.js';
import { prefixWrapper } from '../../helpers/prefixWrapper.js';
import { testProcedure } from
'./testProcedure.js';
import { validateIdentifier } from '../../../modules/parsing/parse-tree-analysis/validateIdentifier.js';
const methods = await fetchJson('json/logo-migrations/processing/methods.json');
await Command.asyncInit();

function compareMethods(m1, m2) {
	let result = m1.name.toLowerCase().localeCompare(m2.name.toLowerCase());
	if (result !== 0)
		return result;
	result = m1.name.localeCompare(m2.name);
	if (result !== 0)
		return result;
	if (typeof m1.className === 'string' && typeof m2.className === 'string') {
		result = m1.className.toLowerCase().localeCompare(m2.className.toLowerCase());
		if (result !== 0)
			return result;
		result = m1.className.localeCompare(m2.className);
		if (result !== 0)
			return result;
	}
	return 0;
}

export function testMethodsJSON(logger) {
	if (!(methods instanceof Array))
		logger(`Expected methods to be an Array but got ${methods}`);
	else {
		const procNames = new Set();
		methods.forEach(function(methodData, index) {
			const plogger = prefixWrapper(`Case ${index}, name=${methodData.name}, className=${methodData.className}`, logger);
			if (typeof methodData !== 'object')
				plogger(`Each element of methods.json must be an object but got ${methodData}`);
			else {
				if (methodData.removeInMigration !== undefined) {
					if (typeof methodData.removeInMigration !== 'boolean')
						plogger(`removeInMigration must either be undefined or boolean but got ${methodData.removeInMigration}`);
				}
				if (typeof methodData.name !== 'string')
					plogger(`name must be a string but got ${methodData.name}`);
				else if (index !== 0) {
					const prev = methods[index - 1];
					if (typeof prev === 'object' && typeof prev.name === 'string') {
						const result = compareMethods(prev, methodData);
						if (result !== undefined && result > 0)
							plogger(`Method elements should be sorted but found a pair out of order.`);
					}
				}
				if (methodData.className !== null && typeof methodData.className !== 'string')
					plogger(`className must either be null or be a string but got ${methodData.className}`);
				if (methodData.to !== undefined) {
					if (typeof methodData.to !== 'string')
						plogger(`to must either be undefined or a string but got ${methodData.to}`);
					else {
						const info = Command.getCommandInfo(methodData.to);
						if (info === undefined)
							plogger(`Unable to find WebLogo command from "${methodData.to}"`);
					}
				}
				if (methodData.toProc !== undefined) {
					if (typeof methodData.toProc !== 'string')
						plogger(`toProc must either be undefined or a string but got ${methodData.toProc}`);
					else if (validateIdentifier(methodData.toProc) !== undefined)
						plogger(`toProc must be a valid WebLogo identifier "${methodData.toProc}" is not.  Message: ${validateIdentifier(methodData.toProc)}`);
					else
						procNames.add(methodData.toProc);
				}
				if (methodData.toInline !== undefined) {
					if (typeof methodData.toInline !== 'string')
						plogger(`toInline must either be undefined or be a string but got ${methodData.toInline}`);
					if (methodData.to !== undefined || methodData.toProc !== undefined)
						plogger(`When toInline is specified, to and toProc should not be.`);
				}
				if (methodData.translateAllParametersToSingleColor !== undefined) {
					const val = methodData.translateAllParametersToSingleColor;
					if (typeof val !== 'boolean')
						plogger(`translateAllParametersToSingleColor should either be undefined or boolean but got value ${val}`);
				}
				if (methodData.argCount !== undefined) {
					if (!Number.isInteger(methodData.argCount) || methodData.argCount < 0)
						plogger(`When argCount is specified, it should be a positive integer but got ${methodData.argCount}.`);
					else if (typeof methodData.to === 'string') {
						const info = Command.getCommandInfo(methodData.to);
						if (info !== undefined) {
							let expectedArgCount = methodData.argCount;
							if (methodData.translateAllParametersToSingleColor === true)
								expectedArgCount = 1;
							if (info.args.length !== expectedArgCount)
								plogger(`Expected ${expectedArgCount} from to command but got ${info.args.length}.`);
						}
					}
				}
				if (methodData.ignoreExtraParameters !== undefined) {
					if (typeof methodData.ignoreExtraParameters !== 'boolean') {
						plogger(`When ignoreExtraParameters is specified, it must be boolean but got ${methodData.ignoreExtraParameters}`);
					}
				}
			}
		}
		);
		for (const procName of procNames) {
			testProcedure(procName, logger);
		}
	}
};
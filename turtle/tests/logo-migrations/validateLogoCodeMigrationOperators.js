import { Command } from '../../modules/parsing/Command.js';
import { Operators } from '../../modules/parsing/Operators.js';
import { prefixWrapper } from '../helpers/prefixWrapper.js';
import { validateIdentifier } from '../../modules/parsing/parse-tree-analysis/validateIdentifier.js';
await Command.asyncInit();
await Operators.asyncInit();

export function validateLogoCodeMigrationOperators(fullInfoObject, logger) {
	if (fullInfoObject.operators === undefined)
		return; // nothing to validate.  undefined is valid, though.

	if (!(fullInfoObject.operators instanceof Array))
		logger(`Expected operators to either be undefined or be an Array but got ${fullInfoObject.operators}`);
	else {
		fullInfoObject.operators.forEach(function(operatorInfo, index) {
			const plogger = prefixWrapper(`Operator ${index}, symbol ${operatorInfo.symbol}`, logger);
			if (typeof operatorInfo.symbol !== 'string')
				plogger(`Expected symbol to be a string but got ${operatorInfo.symbol}`);
			else {
				if (index > 0 && typeof fullInfoObject.operators[index - 1].symbol === 'string' &&
				fullInfoObject.operators[index - 1].symbol >= operatorInfo.symbol) {
					const symbols = fullInfoObject.operators.map(op => op.symbol);
					symbols.sort();
					const sortedMsg = symbols.join(', ');
					plogger(`Expected operators to be sorted by symbol but found a pair out of order.  ${fullInfoObject.operators[index - 1].symbol} and ${operatorInfo.symbol}.  ${operatorInfo.symbol} should be first/(earlier or higher file).  The fully sorted operator symbols are: ${sortedMsg}`);
				}
			}
			if (operatorInfo.precedence !== undefined && !Number.isInteger(operatorInfo.precedence))
				plogger(`Expected precedence to either be undefined or an integer but got ${operatorInfo.precedence}`);
			if (operatorInfo.to !== undefined) {
				if (typeof operatorInfo.to !== 'string')
					plogger(`Expected to to be a string but got ${operatorInfo.to}`);
			}
			['toCommand', 'toProc'].forEach(function(key) {
				if (operatorInfo[key] !== undefined)
					plogger(`Key ${key} should be left undefined because another key should be used instead.`);
			});
			if (operatorInfo.convertToProc !== undefined) {
				if (typeof operatorInfo.convertToProc !== 'string')
					plogger(`convertToProc must be a string but found ${operatorInfo.convertToProc}`);
				else if (validateIdentifier(operatorInfo.convertToProc) !== undefined) {
					plogger(`convertToProc must be a valid identifier in WebLogo but found ${operatorInfo.convertToProc}`);
				}
			}
			if (operatorInfo.convertToCommand !== undefined) {
				if (typeof operatorInfo.convertToCommand !== 'string')
					plogger(`Expected convertToCommand to be a string but got ${operatorInfo.convertToCommand}`);
				else {
					const info = Command.getCommandInfo(operatorInfo.convertToCommand);
					if (info === undefined)
						plogger(`convertToCommand expected to match a WebLogo command but did not find a command for ${operatorInfo.convertToCommand}`);
				}
			}
		});
	}
};
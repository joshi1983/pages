import { Command } from '../../../../../modules/parsing/Command.js';
import { DataTypes } from '../../../../../modules/parsing/data-types/DataTypes.js';
import { prefixWrapper } from '../../../../helpers/prefixWrapper.js';
import { typePredicateMap } from 
'../../../../../modules/parsing/parse-tree-analysis/variable-data-types/variable-assignment-scopes/typePredicateMap.js';
await Command.asyncInit();

export function testTypePredicateMap(logger) {
	for (const [key, value] of typePredicateMap) {
		const plogger = prefixWrapper(`key=${key}, datatypes=${value}`, logger);
		const info = Command.getCommandInfo(key);
		if (info === undefined)
			plogger(`Command not found`);
		else if (info.args.length !== 1)
			plogger(`Expected args.length to be 1 but got ${info.args.length}`);
		if (!(value instanceof DataTypes))
			plogger('Expected an instance of DataTypes but the value is not');
	}
};
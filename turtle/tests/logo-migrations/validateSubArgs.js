import { Command } from '../../modules/parsing/Command.js';
import { DataTypes } from '../../modules/parsing/data-types/DataTypes.js';
await Command.asyncInit();
await DataTypes.asyncInit();

export function validateSubArgs(commandInfo, subArgs, logger) {
	if (!(subArgs instanceof Array))
		logger(`If subArgs is specified, it must be an Array but got ${subArgs}`);
	else {
		for (const subArg of subArgs) {
			if (typeof subArg !== 'object' || subArg === null)
				logger(`Expected subArgs elements to be objects but got ${subArg}`);
			else {
				if (typeof subArg.name !== 'string')
					logger(`Expected every subArgs element name to be a string but found ${subArg.name}`);
				if (subArg.types !== undefined)
					new DataTypes(subArg.types);
				if (subArg.nameLinked !== undefined) {
					if (typeof subArg.nameLinked !== 'boolean')
						logger(`Expected nameLinked to either be undefined or a boolean but found ${subArg.nameLinked}`);
					else if (subArg.nameLinked === true) {
						if (commandInfo.to === undefined)
							logger(`When a subArg's namedLinked is true, the command's to must be specified but it was not`);
						else {
							const info = Command.getCommandInfo(commandInfo.to);
							if (info !== undefined) {
								if (!info.args.some(a => a.name === subArg.name)) {
									logger(`nameLinked is true but unable to find a corresponding argument with name ${subArg.name} in command ${info.primaryName}.  The found names were ${info.args.map(a => a.name).join(',')}`);
								}
							}
						}
					}
				}
			}
		}
	}
};
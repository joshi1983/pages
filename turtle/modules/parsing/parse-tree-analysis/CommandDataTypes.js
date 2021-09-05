import { Command } from '../Command.js';
import { commandGetParameterTypes } from './command-data-types/commandGetParameterTypes.js';
import { commandGetReturnTypes } from './command-data-types/commandGetReturnTypes.js';
import { DataTypes } from '../data-types/DataTypes.js';
import { removeNull } from '../data-types/removeNull.js';

export class CommandDataTypes {
	static isReturnTypesAffectedByInputTypes(commandName) {
		const info = Command.getCommandInfo(commandName);
		return info !== undefined && commandGetReturnTypes[info.primaryName] !== undefined;
	}

	static getReturnDataTypesFromInputs(commandName, parameterTypesArray) {
		const info = Command.getCommandInfo(commandName);
		commandName = info.primaryName;
		if (commandGetReturnTypes[commandName] !== undefined) {
			for (let i = 0; i < parameterTypesArray.length; i++) {
				let requiredTypes = new DataTypes(Command.getParameterTypes(info, i));
				const p = parameterTypesArray[i];
				let actualParamTypes;
				if (!(p instanceof DataTypes))
					actualParamTypes = new DataTypes(removeNull(p));
				else
					actualParamTypes = p;

				if (actualParamTypes !== undefined)
					requiredTypes.intersectWith(actualParamTypes);
				parameterTypesArray[i] = requiredTypes.toString();
			}
			return commandGetReturnTypes[commandName](...parameterTypesArray);
		}
		else
			return info.returnTypes;
	}

	static getCommandNamesWhereRequiredParameterTypesAffectEachOther() {
		return Object.keys(commandGetParameterTypes);
	}

	static getRequiredParameterTypes(commandName, parameterIndex, getTypesForParameter) {
		const info = Command.getCommandInfo(commandName);
		commandName = info.primaryName;
		if (commandGetParameterTypes[commandName] !== undefined)
			return commandGetParameterTypes[commandName](parameterIndex, getTypesForParameter);
		else
			return info.returnTypes;
	}
};
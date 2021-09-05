import { fetchJson } from '../../fetchJson.js';

const migrationInfo = await fetchJson('json/logo-migrations/ASMTurtle.json');
const instructionsMap = new Map();
migrationInfo.commands.forEach(function(commandInfo) {
	instructionsMap.set(commandInfo.primaryName.toLowerCase(), commandInfo);
});

export class Instruction {
	static getAllInstructionsInfo() {
		return migrationInfo.commands;
	}

	static getInstructionInfo(name) {
		return instructionsMap.get(name.toLowerCase());
	}

	static isJumpOrCall(info) {
		const name = info.primaryName.toLowerCase();
		if (name === 'call')
			return true;
		if (name[0] === 'j' && name.length < 5 && info.args.length === 1)
			return true;
		return false;
	}
};
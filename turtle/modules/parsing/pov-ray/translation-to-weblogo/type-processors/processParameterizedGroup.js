import { PovRayCommand } from '../../PovRayCommand.js';
import { processSpecial } from './special/processSpecial.js';
import { processTokens } from './processTokens.js';

export function processParameterizedGroup(token, result) {
	if (processSpecial(token, result))
		return;
	const info = PovRayCommand.getCommandInfo(token.val);
	if (info !== undefined) {
		if (info.removeInMigration)
			return;
		const name = typeof info.to === 'string' ? info.to : token.val;
		result.append(name + ' ');
		processTokens(token.children, result);
	}
	else
		result.append(`\n; Failed to translate because unable to find a directive or function named ${token.val}\n`);
};
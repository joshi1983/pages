import { PovRayCommand } from '../../../modules/parsing/pov-ray/PovRayCommand.js';

export function testPovRayCommand(logger) {
	const info = PovRayCommand.getCommandInfo('#include');
	if (typeof info !== 'object')
		logger(`Expected info to be an object for the #include command`);
};
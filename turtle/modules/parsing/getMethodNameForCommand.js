/*
This is not in the Command.js module because Command.js uses a lot of dependencies
and this function is very simple.
Some of those dependencies can lead to dependency-cycles when importing Command.js 
into the modules that need getMethodNameForCommand.
*/
export function getMethodNameForCommand(name) {
	if (typeof name !== 'string')
		throw new Error(`name must be a string.  It must be a command's primaryName.  name=${name}`);
	if (name.endsWith('?'))
		name = name.substring(0, name.length - 1) + 'p';

	return name.replace(/\./g, '_');
};
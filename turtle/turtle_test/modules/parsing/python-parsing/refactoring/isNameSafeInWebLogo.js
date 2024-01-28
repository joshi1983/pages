import { Command } from '../../Command.js';
import { Keyword } from '../../Keyword.js';
import { SetUtils } from '../../../SetUtils.js';
await Command.asyncInit();

const unsafeNames = new Set([
'convertcolorusingmode', 'colormode', 'pycircle',
'pydegrees', 'pydot',
'pyheading', 'pyidiv', 'pyscaleangletodegrees',
'pysetheading',
]);
Command.getAllCommandsInfo().forEach(function(info) {
	SetUtils.addAll(unsafeNames, Command.getLowerCaseCommandNameSet(info));
});
SetUtils.addAll(unsafeNames, Array.from(Keyword.getAllKeywords()));

export function isNameSafeInWebLogo(name) {
	name = name.toLowerCase();
	return !unsafeNames.has(name);
};
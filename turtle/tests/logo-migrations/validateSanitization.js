import { sanitizerMap } from
'../../modules/components/code-editor/code-fixer/fixers/helpers/sanitization/sanitizeForLogoMigration.js';

export function validateSanitization(fullInfoObject, logger) {
	if (fullInfoObject.sanitization === undefined)
		return;
	if (!(fullInfoObject.sanitization instanceof Array))
		logger(`sanitization expected to either be undefined or an Array but got ${fullInfoObject.sanitization}`);
	else {
		fullInfoObject.sanitization.forEach(function(element) {
			if (typeof element !== 'string')
				logger(`Expected every element in sanitization to be a string but got ${element}`);
			else if (!sanitizerMap.has(element))
				logger(`Expected to find name ${element} in sanitizerMap but did not.  sanitizerMap has the keys ${Array.from(sanitizerMap.keys()).join(',')}`);
		});
	}
};
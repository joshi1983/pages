import { isNameSafeInWebLogo } from './isNameSafeInWebLogo.js';
import { SetUtils } from '../../../SetUtils.js';

// FIXME: consider refactoring to use only the lower case names or find 
// a compelling reason to have both lower case and case sensitive names to avoid.
export function getWebLogoSafeFunctionNameFrom(pythonName, lowerCaseNamesToAvoid, caseSensitiveNamesToAvoid) {
	if (caseSensitiveNamesToAvoid === undefined)
		caseSensitiveNamesToAvoid = new Set();
	else if (caseSensitiveNamesToAvoid instanceof Array)
		caseSensitiveNamesToAvoid = new Set(caseSensitiveNamesToAvoid);
	if (lowerCaseNamesToAvoid === undefined)
		lowerCaseNamesToAvoid = new Set();
	else if (lowerCaseNamesToAvoid instanceof Array)
		lowerCaseNamesToAvoid = new Set(lowerCaseNamesToAvoid);
	SetUtils.addAll(lowerCaseNamesToAvoid, Array.from(caseSensitiveNamesToAvoid).map(s => s.toLowerCase()));
	if (isNameSafeInWebLogo(pythonName) && !lowerCaseNamesToAvoid.has(pythonName.toLowerCase()))
		return pythonName;
	for (let i = 2; true; i++) {
		const newName = `${pythonName}${i}`;
		if (isNameSafeInWebLogo(newName) &&
		!lowerCaseNamesToAvoid.has(newName.toLowerCase()) &&
		!caseSensitiveNamesToAvoid.has(newName)) {
				return newName;
		}
	}
};
import { geosphereFixer } from '../../../../../../modules/components/code-editor/code-fixer/fixers/logo-3d/geosphereFixer.js';
import { processTestCases } from '../processTestCases.js';

export function testGeosphereFixer(logger) {
	const cases = [
		{'code': 'circle 200', 'logged': false},
		{'code': 'sphere 200', 'logged': false},
		{'code': 'geosphere2 200 magenta', 'to': 'setFillColor magenta sphere 200 ', 'logged': true},
		// The quote on a colour name is required by WebLogo but another fixer will handle that.
		{'code': 'geosphere3 300 red', 'to': 'setFillColor red sphere 300 ', 'logged': true},
	];
	processTestCases(cases, geosphereFixer, logger);
};
import { matchesARegex } from '../../components/code-editor/code-fixer/fixers/helpers/matchesARegex.js';

const antisignals = [
];

const signals = [
	/(^|[\n])\s*@(AuraEnabled|RestResource)\s*\(/,
	/(^|[\n])\s*@IsTest\s*[\n\r]/,
	/(^|[\n])\s*(global|private|protected|public)\s+(with|without)\s+sharing\s+(class|enum|interface)\s/,
	/(^|[\n])\s*global\s+(class|enum|interface|static)\s/
];

/*
Some patterns that might match some Java, Processing or other examples
*/
const weakSignals1 = [
	/(^|[\n])\s*(private|protected|public)\s+(class|enum|interface|static)\s/
];

/*
Some other patterns that might match other languages but
would be weird to find in them
*/
const weakSignals2 = [
	/\.salesforce\.com/
];
 
export function isLikelyApex(code) {
	if (matchesARegex(antisignals, code))
		return false;
	if (matchesARegex(signals, code))
		return true;
	if (matchesARegex(weakSignals1, code) &&
	matchesARegex(weakSignals2, code)) {
		return true;
	}
	return false;
};
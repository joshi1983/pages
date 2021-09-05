import { AllASCIICharacters } from './AllASCIICharacters.js';
import { exceptionToString } from '../../../modules/exceptionToString.js';
import { prefixWrapper } from
'../prefixWrapper.js';

export function genericTranslateBadExamples(badExamples, translate, logger) {
	if (!(badExamples instanceof Array))
		throw new Error(`badExamples must be an Array but found ${badExamples}`);
	if (typeof translate !== 'function')
		throw new Error(`translate must be a function but found ${translate}`);
	if (typeof logger !== 'function')
		throw new Error(`logger must be a function but found ${logger}`);
	badExamples = badExamples.concat(AllASCIICharacters);
	badExamples.forEach(function(code, index) {
		const plogger = prefixWrapper(`Case ${index}, code=${code}`, logger);
		try {
			const result = translate(code);
			if (typeof result !== 'string')
				plogger(`Expected result to be a string but found ${result}`);
		} catch (e) {
			console.error(e);
			plogger(`An exception was thrown while translating ${code}. exception message = ${exceptionToString(e)}`);
		}
	});
};
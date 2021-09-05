export function testCommandArg(commandInfo, arg, argIndex, logger) {
	if (typeof arg.name !== 'string')
		logger('Missing an argument name for argument index ' + argIndex);
	if (typeof arg.types !== 'string')
		logger('Missing argument types for argument index ' + argIndex);
	else if (arg.types.toLowerCase() !== arg.types)
		logger('arg.types must always be in lower case.  This is not the case for argument at index ' + argIndex + '.  types = ' + arg.types);
	if (arg.min !== undefined && typeof arg.min !== 'number')
		logger('Should either set min to a number or not set it at all.  Instead min is set to ' + arg.min);
	if (arg.max !== undefined && typeof arg.max !== 'number')
		logger('Should either set max to a number or not set it at all.  Instead max is set to ' + arg.max);
	if (arg.uselessCases !== undefined && !(arg.uselessCases instanceof Array))
		logger('uselessCases should be an Array.  Instead uselessCases is set to ' + arg.uselessCases);
	if (arg.errorCases !== undefined && !(arg.errorCases instanceof Array))
		logger('errorCases should be an Array.  Instead errorCases is set to ' + arg.errorCases);
	if (arg.alwaysReturnValue !== undefined &&
	typeof arg.alwaysReturnValue !== 'boolean')
		logger(`alwaysReturnValue must be either undefined or be boolean but found ${arg.alwaysReturnValue}`);

	// minLen might be replaced by the list(minlen=...) and string(minlen=...) 
	// feature in the data type language.
	if (arg.minLen !== undefined && !Number.isInteger(arg.minLen))
		logger('Should either set minLen to an integer number or not set it at all.  Instead minLen is set to ' + arg.minLen);

	if (arg.listElementTypes !== undefined)
		logger('listElementTypes should not be specified.  Instead listElementTypes should be calculated off the subtypes found in a list data type.');
	if (arg.sanitization !== undefined && typeof arg.sanitization !== 'string') {
		// should match methods on the JavaScriptInstruction class.
		logger('sanitization should either be undefined or a string');
	}
	if (arg.format !== undefined) {
		if (typeof arg.format !== 'string')
			logger('format must be either undefined or a string.  Not: ' + arg.format);
	}
	if (arg.typeEqualitySymbol !== undefined) {
		if (arg.disableTypeEqualitySymbolIfTypes !== undefined) {
			if (typeof arg.disableTypeEqualitySymbolIfTypes !== 'string')
				logger(`disableTypeEqualitySymbolIfTypes expected to be a data types expression string but got: ${arg.disableTypeEqualitySymbolIfTypes}`);
		}
		if (typeof arg.typeEqualitySymbol !== 'string') {
			logger('typeEqualitySymbol must be either undefined or a string');
		}
		else {
			const matches = commandInfo.args.filter(a => a.typeEqualitySymbol === arg.typeEqualitySymbol);
			if (matches.length === 1)
				logger('typeEqualitySymbol must have more than 1 match for the same name but only one was found for typeEqualitySymbol of ' + arg.typeEqualitySymbol);
		}
	}
};
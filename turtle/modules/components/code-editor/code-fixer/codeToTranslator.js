const translatorPairs = new Map([
]);
const defaultResult = [(code) => code, false];

export function codeToTranslator(code) {
	let result = defaultResult;
	for (const [isFunc, resultPair] of translatorPairs) {
		if (isFunc(code)) {
			/*
			These translators can make a lot of changes to the code.
			It is better to make no changes than make the wrong changes.
			For this reason, if more than 1 translator is matched, do nothing.

			Ideally, only 1 category or classification will be matched so we
			can be pretty confident that the changes are appropriate.
			*/
			if (result !== defaultResult)
				return defaultResult;
			result = resultPair;
		}
	}
	return result;
};
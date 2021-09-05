export function addTokenEquality(fromToken, toToken, result) {
	if (!(result instanceof Map))
		throw new Error(`result must be a Map but found ${result}`);

	let equalSet = result.get(fromToken);
	if (equalSet === undefined) {
		equalSet = new Set();
		result.set(fromToken, equalSet);
	}
	equalSet.add(toToken);
};
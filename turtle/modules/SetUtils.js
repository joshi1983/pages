export class SetUtils {
	static addAll(set1, newElements) {
		for (let i = 0; i < newElements.length; i++) {
			set1.add(newElements[i]);
		}
	}
};
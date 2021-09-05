export class SetUtils {
	static addAll(set1, newElements) {
		if (!(newElements instanceof Array))
			newElements = Array.from(newElements);
		for (let i = 0; i < newElements.length; i++) {
			set1.add(newElements[i]);
		}
	}

	static getIntersection(set1, set2) {
		const result = new Set();
		for (const val1 of set1) {
			if (set2.has(val1))
				result.add(val1);
		}
		
		return result;
	}

	static isIntersecting(set1, set2) {
		for (const val1 of set1) {
			if (set2.has(val1))
				return true;
		}
		return false;
	}

	static remove(set, isKept) {
		const toDelete = [];
		for (const i of set) {
			if (!isKept(i))
				toDelete.push(i);
		}
		for (let i = 0; i < toDelete.length; i++) {
			set.delete(toDelete[i]);
		}
	}
};
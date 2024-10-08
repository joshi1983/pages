export class SetUtils {
	static addAll(set1, newElements) {
		if (!(newElements instanceof Array))
			newElements = Array.from(newElements);
		for (let i = 0; i < newElements.length; i++) {
			set1.add(newElements[i]);
		}
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
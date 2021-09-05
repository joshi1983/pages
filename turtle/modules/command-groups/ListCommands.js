function _flatten(vals, doNotProcess) {
	const result = [];
	vals.forEach(function(e) {
		if ((e instanceof Array) && !doNotProcess.has(e)) {
			doNotProcess.add(e);
			const elements = _flatten(e, doNotProcess);
			elements.forEach(function(flattenedElement) {
				result.push(flattenedElement);
			});
		}
		else
			result.push(e);
	});
	return result;
}

export class ListCommands {
	butFirst(list1) {
		if (list1 instanceof Array)
			return list1.slice(1);
		else if (typeof list1 === 'string')
			return list1.substring(1);
		else
			throw new Error('list or string required');
	}

	butLast(list1) {
		if (list1 instanceof Array)
			return list1.slice(0, list1.length - 1);
		else if (typeof list1 === 'string')
			return list1.substring(0, list1.length - 1);
		else
			throw new Error('list or string required');
	}

	count(list1) {
		if (list1 instanceof Array || typeof list1 === 'string')
			return list1.length;
		else
			return list1.size; // for Map
	}

	dequeue2(list1) {
		const result = list1[0];
		list1.shift();
		return result;
	}

	emptyp(list1) {
		return this.count(list1) === 0;
	}

	first(val) {
		if (val[0] === undefined)
			return null;
		return val[0];
	}

	fput(thing, list1) {
		const result = list1.slice(0);
		result.unshift(thing);
		return result;
	}

	iseq(first, last) {
		const result = [];
		for (let i = first; i <= last; i++) {
			result.push(i);
		}
		return result;
	}

	item(index, thing) {
		if (index < 1)
			throw new Error('Index must be at least 1 but index given as ' + index);
		else if (index > thing.length)
			throw new Error('Index must be at most ' + (thing.length) + '(number of elements in the given list) but index given as ' + index);
		return thing[index - 1];
	}

	last(list1) {
		return list1[list1.length - 1];
	}

	list() {
		const result = [];
		for (let i = 0; i < arguments.length; i++)
			result.push(arguments[i]);
		return result;
	}

	listp(val) {
		return val instanceof Array;
	}

	lput(thing, list1) {
		const result = list1.slice(0);
		result.unshift(thing);
		return result;
	}

	pick(list1) {
		const index = Math.floor(Math.random() * list1.length);
		return list1[index];
	}

	queue2(list1, val) {
		if (!(list1 instanceof Array))
			throw new Error('list1 must be a list but got ' + list1);
		list1.push(val);
	}

	reverse(val) {
		if (val instanceof Array)
			return val.slice().reverse();
		else if (typeof val === 'string')
			return val.split("").reverse().join("");
		else
			this._error('reverse expects a list or word.');
	}

	rput(thing, list1) {
		const result = list1.slice(0);
		result.push(thing);
		return result;
	}

	rseq(first, last, count) {
		if (count <= 0)
			return [];
		if (first === last) {
			const result = [];
			for (let i = 0; i < count; i++) {
				result.push(first);
			}
			return result;
		}
		const step = (last - first) / (count - 1);
		const result = [];
		let v = first;
		for (let i = 0; i < count; i++) {
			result.push(v);
			v += step;
		}
		return result;
	}

	sentence() {
		const vals = [];
		for (let i = 0; i < arguments.length; i++)
			vals.push(arguments[i]);
		return _flatten(vals, new Set());
	}
};
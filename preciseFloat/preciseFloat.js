class PreciseFloat {
	constructor(num, precision) {
		/*
		The value of this is maintained as:
		this.bigInt * 2 ^ this.exponent
		
		this.precision is a guide for how big this.bigInt should get.
		*/
		if (num === undefined)
			num = 0;
		if (precision === undefined)
			precision = 128;
		else if (typeof precision !== 'number' || isNaN(precision)) {
			throw new Error('precision must either be undefined or a number.');
		}
		if (typeof num === 'number') {
			if (isNaN(num))
				throw new Error('num must not be NAN if it is a number.');
			if (num === 0) {
				this.exponent = 0;
			}
			else {
				this.exponent = Math.floor(Math.log2(Math.abs(num)));
			}
			if (isNaN(this.exponent)) {
				throw new Error('exponent calculated to be ' + this.exponent + ', num = ' + num);
			}
			this.precision = precision;
			this.exponent -= this.precision;
			this.bigInt = BigInt(Math.round(num * Math.pow(2, -this.exponent)));
		}
		else if (typeof num === 'bigint') {
			this.bigInt = num;
			this.exponent = 0;
			this.precision = precision;
		}
		else if (num instanceof PreciseFloat) {
			this.precision = num.precision;
			this.exponent = num.exponent;
			this.bigInt = num.bigInt;
		}
		else {
			throw new Error('PreciseFloat must be initialized with a number, bigint, or a PreciseFloat.');
		}
	}

	_isInvalidNumber(num) {
		if (num === undefined)
			return true;
		if (num instanceof PreciseFloat)
			return false;
		var type = typeof num;
		if (type === 'bigint')
			return false;
		
		return type !== 'number' || isNaN(num);
	}

	bitShift(numBits) {
		if (typeof numBits !== 'number' || isNaN(numBits)) {
			throw new Error('bitShift requires a number.');
		}
		if (numBits !== 0) {
			this.exponent += numBits;
		}
	}

	getBitShift(numBits) {
		var result = new PreciseFloat(this);
		result.bitShift(numBits);
		return result;
	}

	toBinary() {
		var index;
		if (this.bigInt === 0n)
			return '0';
		else if (this.exponent >= 0) {
			var binary = this.bigInt.toString(2);
			var padding = '';
			for (var i = 0; i < this.exponent; i++) {
				padding += '0';
			}
			return binary + padding;
		}
		else if (this.exponent < 0) {
			var binary = this.bigInt.toString(2);
			var isNegative = (this.bigInt < 0n);
			if (isNegative) {
				binary = binary.substring(1); // remove the leading -.
			}
			while (this.exponent <= -binary.length) {
				binary = '0' + binary;
			}
			if (isNegative) {
				binary = '-' + binary;
			}
			var index = binary.length + this.exponent;
			binary = binary.substring(0, index) + "." + binary.substring(index);
			return binary;
		}
	}

	// Warning: the resulting number may be less precise.
	toNumber() {
		var binary = this.toBinary();
		var intPart = binary;
		var fractionalPart = '0';
		if (intPart.indexOf(".") !== -1) {
			fractionalPart = binary.substring(binary.indexOf('.') + 1);
			intPart = intPart.substring(0, intPart.indexOf("."));
		}
		intPart = parseInt(intPart, 2);
		var result = intPart;
		if (fractionalPart !== '0') {
			var sign = binary.charAt(0) === '-' ? -1 : 1;
			for (var i = 0; i < fractionalPart.length; i++) {
				if (fractionalPart.charAt(i) === '1')
					result += sign * Math.pow(2, -1 - i);
			}
		}
		return result;
	}

	/*
	Enforces the this.precision value.
	Prevents this.bigInt from getting too long, using too much memory, and getting too slow to process.
	*/
	_enforcePrecision() {
		var hex = this.bigInt.toString(16);
		var digitsToRemove = (hex.length - this.precision / 4 - 1) * 4;
		if (digitsToRemove > 0) {
			this.bigInt = this.bigInt / (1n << BigInt(digitsToRemove));
			this.exponent += digitsToRemove;
		}
	}

	/*
	This adjusts the exponent while trying to not change the represented value.
	The only way the value might change is if the exponent is being increased 
	and some digits from bigInt must be removed.
	*/
	_setExponent(newExponent) {
		var de = newExponent - this.exponent;
		if (de !== 0) {
			if (de < 0)
				this.bigInt = this.bigInt << BigInt(-de);
			else {
				if (this.bigInt < 0) {
					// process in larger intervals for performance.
					while (de >= 20) {
						this.bigInt /= 1048576n; // 1048576 is 2^20.
						de -= 20;
					}
					while (de >= 5) {
						this.bigInt /= 32n; // 32 is 2^5.
						de -= 5;
					}
					while (de > 0) {
						this.bigInt /= 2n;
						de--;
					}
				}
				else {
					this.bigInt = this.bigInt >> BigInt(de); // might lose precision.
				}
			}
			
			this.exponent = newExponent;
		}
	}

	_compareBigInt(bigInt1, bigInt2) {
		if (bigInt1 < bigInt2)
			return -1;
		else if (bigInt1 === bigInt2)
			return 0;
		else
			return 1;
	}

	compare(num) {
		var isNewNumNeeded = true; // recorded to avoid needlessly creating a clone of num.
		/*
		All of these if-statements are to speed up performance for cases 
		where conversion or cloning of num and this aren't necessary.
		*/
		if (typeof num === 'number') {
			// check a few simple cases.
			if (num < 0 && this.bigInt > 0)
				return 1;
			else if (num > 0 && this.bigInt < 0)
				return -1;
			num = new PreciseFloat(num);
			isNewNumNeeded = false;
		}
		else if (!(num instanceof PreciseFloat)) {
			num = new PreciseFloat(num);
			isNewNumNeeded = false;
		}
		if (this.bigInt < 0 && num.bigInt > 0)
			return -1;
		else if (this.bigInt > 0 && num.bigInt < 0)
			return 1;
		
		if (this.exponent === num.exponent) {
			return this._compareBigInt(this.bigInt, num.bigInt);
		}
		
		// Switch to the same exponent for easier comparison.
		// Create a clone in case the passed value
		if (isNewNumNeeded)
			num = new PreciseFloat(num);

		// Get a common exponent so the bigInt's can be compared.
		var other = new PreciseFloat(this);
		var minExponent = Math.min(num.exponent, other.exponent);
		other._setExponent(minExponent);
		num._setExponent(minExponent);
		return this._compareBigInt(other.bigInt, num.bigInt);
	}

	add(num) {
		if (this._isInvalidNumber(num))
			throw new Error('add requires a number of some kind.');
		if (!(num instanceof PreciseFloat)) {
			num = new PreciseFloat(num, this.precision);
		}
		if (num.bigInt !== 0n)
		{
			if (this.exponent !== num.exponent) {
				// adjust the exponent to match.
				num = new PreciseFloat(num, this.precision);
				num._setExponent(this.exponent);
			}
			this.bigInt += num.bigInt;
			this._enforcePrecision();
		}
	}

	getAdd(num) {
		var result = new PreciseFloat(num);
		result.add(this);
		return result;
	}

	negate() {
		this.bigInt = -this.bigInt;
	}

	getNegative() {
		var result = new PreciseFloat(this);
		result.negate();
		return result;
	}

	subtract(num) {
		var restoreSignNeeded = true;
		if (!(num instanceof PreciseFloat)) {
			num = new PreciseFloat(num, this.precision);
			restoreSignNeeded = false;
		}
		num.negate();
		this.add(num);
		if (restoreSignNeeded)
			num.negate(); // restore the original sign.
	}

	multiply(num) {
		if (this._isInvalidNumber(num))
			throw new Error('multiply requires a number of some kind.  Not ' + num);
		if (!(num instanceof PreciseFloat))
			num = new PreciseFloat(num);
		this.exponent += num.exponent;
		this.bigInt *= num.bigInt;
		this._enforcePrecision();
	}

	getMultipliedWith(num) {
		var result = new PreciseFloat(this);
		result.multiply(num);
		return result;
	}

	divideBy(num) {
		// If no difference can be made, just return.
		if (this.bigInt === 0n)
			return;
		if (this._isInvalidNumber(num))
			throw new Error('divideBy requires a number of some kind.');
		if (!(num instanceof PreciseFloat))
			num = new PreciseFloat(num);
		var shiftAmount = Math.max(this.precision, num.precision);
		var coefficient = 1n << BigInt(shiftAmount);
		this.bigInt = this.bigInt * coefficient / num.bigInt;
		this.exponent -= num.exponent + shiftAmount;
		this._enforcePrecision();
	}

	getDividedBy(num) {
		var result = new PreciseFloat(this);
		result.divideBy(num);
		return result;
	}

	square() {
		this.multiply(this);
	}

	getSquare() {
		var result = new PreciseFloat(this);
		result.square();
		return result;
	}

	toString() {
		return '' + this.toNumber();
	}
}
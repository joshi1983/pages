export class GLTFAccessorType {
	static get SCALAR() {
		return 'SCALAR';
	}

	static get VEC2() {
		return 'VEC2';
	}

	static get VEC3() {
		return 'VEC3';
	}

	static get VEC4() {
		return 'VEC4';
	}

	static get MAT2() {
		return 'MAT2';
	}

	static get MAT3() {
		return 'MAT3';
	}

	static get MAT4() {
		return 'MAT4';
	}

	static getNumberOfComponents(typeName) {
		return {
			'SCALAR': 1,
			'VEC2': 2,
			'VEC3': 3,
			'VEC4': 4,
			'MAT2': 4,
			'MAT3': 9,
			'MAT4': 16
		}[typeName];
	}
}
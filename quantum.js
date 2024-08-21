export class Imaginary {
    static phi(phi) {
        return new Imaginary(Math.cos(phi), Math.sin(phi));
    };

    constructor(real = 0, imaginary = 0) {
        this.real = real;
        this.imaginary = imaginary;
    };

    /**
     * @param {Imaginary} other
     * @returns {Imaginary}
     */
    add(other) {
        return new Imaginary(this.real + other.real, this.imaginary + other.imaginary);
    };

    /**
     * @param {Imaginary} other
     * @returns {Imaginary}
     */
    sub(other) {
        return new Imaginary(this.real - other.real, this.imaginary - other.imaginary);
    };

    /**
     * @param {Imaginary} other
     * @returns {Imaginary}
     */
    mul(other) {
        return new Imaginary(this.real * other.real - this.imaginary * other.imaginary, this.real * other.imaginary + this.imaginary * other.real);
    };

    /**
     * @param {number} other
     * @returns {Imaginary}
     */
    mulScalar(other) {
        return new Imaginary(this.real * other, this.imaginary * other);
    };

    /**
     * @param {Imaginary} other
     * @returns {Imaginary}
     */
    div(other) {
        const divisor = other.real * other.real + other.imaginary * other.imaginary;
        return new Imaginary((this.real * other.real + this.imaginary * other.imaginary) / divisor, (this.imaginary * other.real - this.real * other.imaginary) / divisor);
    };

    conjugate() {
        return new Imaginary(this.real, -this.imaginary);
    };

    neg() {
        return new Imaginary(-this.real, -this.imaginary);
    };

    inv() {
        const divisor = this.real * this.real + this.imaginary * this.imaginary;
        return new Imaginary(this.real / divisor, -this.imaginary / divisor);
    };

    abs() {
        return Math.sqrt(this.real * this.real + this.imaginary * this.imaginary);
    };

    toString() {
        return `${this.real} + ${this.imaginary}i`;
    };
}

export const I = new Imaginary(0, 1);
export const NEGATIVE_I = new Imaginary(0, -1);
export const ONE = new Imaginary(1, 0);
export const NEGATIVE_ONE = new Imaginary(-1, 0);
export const ZERO = new Imaginary(0, 0);

export class Qubit {
    /**
     * @param {Imaginary} alpha
     * @param {Imaginary} beta
     */
    constructor(alpha, beta) {
        this.alpha = alpha;
        this.beta = beta;
    };

    /*** @returns {Qubit} */
    hadamard() {
        return new Qubit(
            this.alpha.add(this.beta).mulScalar(Math.SQRT1_2),
            this.alpha.sub(this.beta).mulScalar(Math.SQRT1_2)
        );
    };

    /**
     * @param {Qubit} control
     * @param {Qubit} target
     * @returns {{control: Qubit, target: Qubit}}
     */
    static controlledNot(control, target) {
        const _00 = control.alpha * target.alpha;
        const _01 = control.alpha * target.beta;
        const _10 = control.beta * target.alpha;
        const _11 = control.beta * target.beta;

        return {
            control: new Qubit(new Imaginary(_00 + _01), new Imaginary(_11 + _10)),
            target: new Qubit(new Imaginary(_00 + _11), new Imaginary(_01 + _10))
        };
    };

    /**
     * @param {Qubit} control
     * @param {Qubit} target
     * @param {[[number, number], [number, number]]} U
     * @returns {{control: Qubit, target: Qubit}}
     */
    static controlledU(control, target, U) {
        const _00 = control.alpha * target.alpha;
        const _01 = control.alpha * target.beta;
        const _10 = control.beta * target.alpha;
        const _11 = control.beta * target.beta;

        const out0 = U[0][0] * _10 + U[0][1] * _11;
        const out1 = U[1][0] * _10 + U[1][1] * _11;

        return {
            control: new Qubit(new Imaginary(_00 + _01), new Imaginary(out0 + out1)),
            target: new Qubit(new Imaginary(_00 + out0), new Imaginary(_01 + out1))
        };
    };

    phaseShift(phi) {
        return new Qubit(
            this.alpha,
            Imaginary.phi(phi).mul(this.beta)
        );
    };

    pauliX() {
        return new Qubit(
            this.beta,
            this.alpha
        );
    };

    pauliY() {
        return new Qubit(
            this.beta.mul(NEGATIVE_I),
            this.alpha.mul(I)
        );
    };

    pauliZ() {
        return new Qubit(
            this.alpha,
            this.beta.neg()
        );
    };

    copy() {
        return new Qubit(this.alpha, this.beta);
    };

    toString() {
        return `${this.alpha} ∣0⟩ + ${this.beta} ∣1⟩`;
    };
}
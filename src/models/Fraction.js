export default class Fraction {
  constructor(numerator = 1, denominator = 1) {
    this.numerator = numerator
    this.denominator = denominator || 1
  }

  isFraction() {
    return true
  }
}

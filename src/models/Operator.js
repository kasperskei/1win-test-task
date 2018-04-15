export default class Operator {
  constructor(name, sign, calculate) {
    this.name = name
    this.sign = sign
    this.calculate = calculate
  }

  isOperator() {
    return true
  }
}

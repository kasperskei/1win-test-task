<template>
  <div class="calculator">
    <section class="equation row">
      <AppExpression class="cell" ref="expression" :expression.sync="expression" :operators="operators" :isRoot="true" />
      <span class="cell">=</span>
      <AppFraction class="cell" :numerator="result.numerator" :denominator="result.denominator" />
    </section>
    <section>
      <!-- <button @click="calculate()">Calculate</button> -->
      <button @click="addFraction()">Add fraction</button>
      <button @click="addBrackets()">Add brackets</button>
      <!-- <pre class="code">{{ expression }}</pre> -->
    </section>
  </div>
</template>

<script>
import Expression from '@/models/Expression'
import Fraction from '@/models/Fraction'
import Operator from '@/models/Operator'

import AppExpression from '@/components/AppExpression'
import AppFraction from '@/components/AppFraction'

export default {
  name: 'Calculator',
  data() {
    return {
      expression: [],
      operators: [
        [
          new Operator(
            'multiplication',
            '×',
            (a, b) =>
              new Fraction(
                a.numerator * b.numerator,
                a.denominator * b.denominator
              )
          ),
          new Operator(
            'division',
            '÷',
            (a, b) =>
              new Fraction(
                a.numerator * b.denominator,
                a.denominator * b.numerator
              )
          )
        ],
        [
          new Operator(
            'addition',
            '+',
            (a, b) =>
              new Fraction(
                a.numerator * b.denominator + b.numerator * a.denominator,
                a.denominator * b.denominator
              )
          ),
          new Operator(
            'subtraction',
            '−',
            (a, b) =>
              new Fraction(
                a.numerator * b.denominator - b.numerator * a.denominator,
                a.denominator * b.denominator
              )
          )
        ]
      ],
      result: {}
    }
  },
  computed: {},
  watch: {
    expression: {
      handler(newVal, oldVal) {
        this.$nextTick(() => {
          this.calculate()
        })
      },
      deep: true
    }
  },
  methods: {
    addBrackets() {
      this.expression.push(this.operators[0][0])
      this.expression.push(
        new Expression([new Fraction(), this.operators[0][0], new Fraction()])
      )
    },
    addFraction() {
      this.expression.push(this.operators[0][0])
      this.expression.push(new Fraction())
    },
    calculate() {
      const expression = this.expression.slice()
      this.result = this.$refs.expression.calculate(expression)
    }
  },
  created() {
    this.result = new Fraction()
    this.expression.push(new Fraction())
    this.addFraction()
    this.addBrackets()
  },
  components: { AppExpression, AppFraction }
}
</script>

<style lang="scss" scoped>
.calculator {
  width: fit-content;
  margin: 0 auto;
  .equation {
    align-items: center;
    margin-bottom: 0.75rem;
  }
}
</style>

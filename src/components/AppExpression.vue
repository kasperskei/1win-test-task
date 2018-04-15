<template>
  <section class="expression row">
    <div v-if="!isRoot" class="bracket"></div>
    <div class="content row">
      <div class="cell" v-for="(it, i) in expression" :key="i">
        <AppExpression :ref="`expression-${i}`" v-if="it.isExpression" :operators="operators" :expression="it.expression" />
        <AppFraction v-if="it.isFraction" :numerator.sync="it.numerator" :denominator.sync="it.denominator" />

        <section v-if="it.isOperator" class="operator">
          <select v-model="expression[i]">
            <option v-for="operator in visibleOperators" :key="operator.name" :value="operator">{{ operator.sign }}</option>
          </select>
        </section>

        <!-- < v-if="it.isOperator" :operators="operators" :operator.sync="it" /> -->
      </div>
    </div>
    <div v-if="!isRoot" class="bracket"></div>
  </section>
</template>

<script>
import Expression from '@/models/Expression'
import Fraction from '@/models/Fraction'
import Operator from '@/models/Operator'

import AppExpression from '@/components/AppExpression'
import AppFraction from '@/components/AppFraction'

export default {
  name: 'AppExpression',
  props: {
    isRoot: {
      type: Boolean,
      default: false
    },
    expression: {
      type: Array,
      required: true
    },
    operators: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      newExpression: this.expression
    }
  },
  computed: {
    visibleOperators() {
      return [].concat(...this.operators)
    }
  },
  watch: {
    expression(value) {
      this.newOperatorName = value
    },
    newOperatorName(value) {
      this.$emit('update:expression', value)
    }
  },
  methods: {
    calculate(expression) {
      for (let i = 0; i < expression.length; i++) {
        if (!expression[i].isExpression) continue

        const ref = this.$refs[`expression-${i}`]
        const component = Array.isArray(ref) ? ref[0] : ref
        const newExpression = expression[i].expression.slice()

        expression[i] = component.calculate(newExpression)
      }

      for (let operators of this.operators) {
        for (let i = 0; i < expression.length; i++) {
          const operator = operators.find(it => it.name === expression[i].name)
          if (!expression[i].isOperator || !operator) continue

          const fraction = operator.calculate(
            expression[i - 1], // first fraction
            expression[i + 1] // second fraction
          )
          const GCD = this.findGCD(fraction.numerator, fraction.denominator)

          fraction.numerator /= GCD
          fraction.denominator /= GCD
          expression.splice(i - 1, 3, fraction)

          return this.calculate(expression)
        }
      }

      // TODO: Проверять expression.length
      return expression[0]
    },
    findGCD(a, b) {
      a = Math.abs(a)
      b = Math.abs(b)
      if (!a || !b) return Math.max(a, b)
      while (a != b)
        if (a > b) a = a - b
        else b = b - a
      return a
    }
  },
  components: { AppExpression, AppFraction }
}
</script>

<style lang="scss" scoped>
@import '../styles/colors';

.expression {
  .bracket {
    border: 0.1rem solid $primary-dark;
    margin: -0.25rem 0.25rem;
    width: 0.25rem;
    &:first-child {
      border-right: none;
      margin-left: 0;
    }
    &:last-child {
      border-left: none;
      margin-right: 0;
    }
  }

  .content {
    align-items: center;
  }
}
</style>

<template>
  <section class="fraction" :class="{ 'invalid': !isValid }">
    <input v-model.number="newNumerator" class="numerator" type="number" :readonly="isReadonly" />
    <hr>
    <input v-model.number="newDenominator" class="denominator" type="number" :readonly="isReadonly" />
  </section>
</template>

<script>
export default {
  name: 'MathFraction',
  props: {
    numerator: {
      type: Number,
      required: true
    },
    denominator: {
      type: Number,
      required: true,
      validator(value) {
        return value !== 0
      }
    },
    readonly: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      newNumerator: this.numerator,
      newDenominator: this.denominator,
      isReadonly: this.readonly
    }
  },
  computed: {
    isValid() {
      return (
        this.newNumerator !== '' &&
        this.newDenominator !== '' &&
        this.newDenominator !== 0
      )
    }
  },
  watch: {
    numerator(value) {
      this.newNumerator = value
    },
    denominator(value) {
      this.newDenominator = value
    },
    newNumerator(value) {
      this.$emit('update:numerator', value)
    },
    newDenominator(value) {
      this.$emit('update:denominator', value)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../styles/colors';

.fraction {
  &.invalid {
    border: 0.1rem solid $danger;
  }

  .numerator,
  .denominator {
    -moz-appearance: textfield;
    margin: 0.25rem;
    text-align: center;
    width: 4rem;

    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
  }
}
</style>

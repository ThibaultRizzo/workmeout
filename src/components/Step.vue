<template>
  <div class="step__wrapper">
    <div class="step" :class="[step.isByRep ? 'by-rep' : 'by-time']">
      <span class="order">{{step.order}}</span>
      <span class="exercise">{{step.exercise}}</span>
      <span class="exercise-nb">{{step.isByRep ? step.repNb : step.repTime}}</span>
    </div>
    <div v-if="step.restTime" class="rest-time">{{step.restTime}}</div>
  </div>
</template>

<script>
export default {
  props: {
    step: {
      type: Object,
      required: true
    }
  }
};
</script>

<style lang="scss" scoped>
%step-icon {
  position: absolute;
  right: -10px;
  width: 20px;
  height: 20px;
  text-align: center;
}

.step__wrapper,
.step-form__wrapper {
  z-index: 4;
}

.step__wrapper {
  .step {
    &.by-rep::after {
      @extend %step-icon;
      content: "🔥";
    }
    &.by-time::after {
      @extend %step-icon;
      content: "⏱";
    }
  }
}

.step {
  margin-bottom: 10px;
  background: white;
  border-radius: 10px;
  border: 1px solid $primary;
  position: relative;
  display: flex;
  align-items: center;
  .order {
    position: absolute;
    left: -10px;
    background: $primary;
    width: 20px;
    height: 20px;
    color: $white;
    border-radius: 50%;
    text-align: center;
  }
  .exercise {
    margin: 10px 20px;
    flex: 1;
  }
  .exercise-nb {
    padding: 10px;
    width: 60px;
    background: $primary;
    border-radius: 0 9px 9px 0;
    color: $white;
    align-self: stretch;
    height: 100%;
  }
}

.rest-time {
  background: white;
  margin-bottom: 10px;
  &::before {
    content: "💧";
    padding: 5px;
  }
}
</style>
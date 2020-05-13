<template>
  <div v-if="edit" class="step-form__wrapper">
    <div class="step" :class="[currentStep.isByRep ? 'by-rep' : 'by-time']">
      <span class="order">{{currentStep.order}}</span>

      <span class="exercise">
        <md-field>
          <label>Exercise Name</label>
          <md-input
            v-model.trim="currentStep.exercise"
            type="text"
            name="exercise"
            required
            autofocus
            tabindex="1"
          ></md-input>
        </md-field>
      </span>
      <span class="exercise-nb">
        <md-field v-if="currentStep.isByRep">
          <label>Rep Number</label>
          <md-input v-model="currentStep.repNb" type="number" name="repNb" id="repNb" tabindex="2"></md-input>
        </md-field>

        <md-field v-else>
          <label>Rep Time</label>
          <md-input
            v-model="currentStep.repTime"
            type="time"
            min="00:00"
            value="00:00"
            name="repTime"
            id="repTime"
            tabindex="2"
          ></md-input>
        </md-field>
      </span>
      <span class="is-by-rep__toggle" @click="toggleRepFlag">
        <md-switch v-model="currentStep.isByRep">{{currentStep.isByRep ? "🔥 By Rep" : "⏱ By Time"}}</md-switch>
      </span>
    </div>
    <div v-if="showRestTime" class="rest-time">
      <md-field>
        <label>Rest Time</label>
        <md-input
          v-model="currentStep.restTime"
          min="00:00"
          type="time"
          name="restTime"
          id="restTime"
        ></md-input>
      </md-field>
    </div>
  </div>

  <div v-else class="step__wrapper">
    <div class="step" :class="[currentStep.isByRep ? 'by-rep' : 'by-time']">
      <span class="order">{{currentStep.order}}</span>
      <span class="exercise">{{currentStep.exercise}}</span>
      <span class="exercise-nb">{{currentStep.isByRep ? currentStep.repNb : currentStep.repTime}}</span>
    </div>
    <div v-if="currentStep.restTime && showRestTime" class="rest-time">{{currentStep.restTime}}</div>
  </div>
</template>

<script>
export default {
  props: {
    step: {
      type: Object,
      required: true
    },
    isEdit: {
      type: Boolean,
      default: false
    },
    showRestTime: {
      type: Boolean,
      default: true
    }
  },
  updated() {
    console.log(this.step);
  },
  data() {
    return {
      currentStep: this.step,
      edit: this.isEdit
    };
  },
  methods: {
    toggleRepFlag: function() {
      if (this.currentStep.isByRep) {
        this.currentStep.repTime = null;
        this.currentStep.repNb = 0;
      } else {
        this.currentStep.repNb = null;
        this.currentStep.repTime = "00:00";
      }
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
.step-form__wrapper {
  display: flex;
  flex-flow: column;
  .md-field {
    max-height: 45px;
    padding-top: 15px;
    margin: 0;
  }
  .step {
    .exercise-nb {
      width: 130px;
      color: white;
      .md-field {
        display: flex;
        flex-flow: column;
      }
    }
  }
  .rest-time {
    align-self: center;
    display: flex;
    align-items: center;
  }
  .is-by-rep__toggle {
    border: 1px solid red;
    background: white;
    top: -20px;
    right: -120px;
    position: absolute;
    border-radius: 10px;

    .md-switch {
      display: flex;
      justify-content: flex-start;
      margin: 0;
      padding: 10px;
      label {
        padding-left: 4px;
      }
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
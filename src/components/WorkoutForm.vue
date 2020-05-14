<template>
  <form @submit.prevent id="workout__form" @submit="submitForm">
    <h2>{{isUpdating ? 'Update your Workout: ' + workoutForm.title : 'Create your Workout'}}</h2>
    <md-field>
      <label>Workout Title</label>
      <md-input
        v-model.trim="workoutForm.title"
        type="text"
        placeholder="Morning Workout"
        name="title"
        required
        autofocus
        tabindex="1"
      ></md-input>
    </md-field>

    <button class="flat add-step__button" type="button" @click="addStep">
      <Add />Add Step
    </button>
    <div v-for="(step, index) in workoutForm.steps" :key="step.order" class="step-line">
      <span @click="removeStep(step.order)" class="delete-step__button">
        <md-tooltip>Remove step</md-tooltip>
        <md-icon class="clickable md-accent">delete</md-icon>
      </span>

      <div class="step-form__wrapper">
        <div class="step" :class="[step.isByRep ? 'by-rep' : 'by-time']">
          <span class="order">{{step.order}}</span>

          <span class="exercise">
            <md-field>
              <label>Exercise Name</label>
              <md-input
                v-model.trim="step.exercise"
                type="text"
                name="exercise"
                required
                autofocus
                :tabindex="2 * index + 2"
              ></md-input>
            </md-field>
          </span>
          <span class="exercise-nb">
            <md-field v-if="step.isByRep">
              <label>Rep Number</label>
              <md-input
                v-model="step.repNb"
                type="number"
                name="repNb"
                id="repNb"
                :tabindex="2 * index + 3"
              ></md-input>
            </md-field>

            <md-field v-else>
              <label>Rep Time</label>
              <md-input
                v-model="step.repTime"
                type="time"
                min="00:00"
                value="00:00"
                name="repTime"
                id="repTime"
                tabindex="2"
              ></md-input>
            </md-field>
          </span>
          <md-switch
            class="is-by-rep__toggle"
            @change="toggleRepFlag(step)"
            v-model="step.isByRep"
          >{{step.isByRep ? "🔥 By Rep" : "⏱ By Time"}}</md-switch>
        </div>
        <div v-if="workoutForm.steps.length !== index + 1" class="rest-time">
          <md-field>
            <label>Rest Time</label>
            <md-input v-model="step.restTime" min="00:00" type="time" name="restTime" id="restTime"></md-input>
          </md-field>
        </div>
      </div>
    </div>
    <button
      type="submit"
      class="primary"
      :disabled="!formValid"
    >{{isUpdating ? 'Update' : 'Create'}}</button>
  </form>
</template>

<script>
import Add from "vue-material-design-icons/Plus";
const getDefaultWorkout = () => ({
  title: "",
  steps: [
    {
      order: 1,
      exercise: "",
      restTime: "00:00",
      isByRep: true,
      repNb: 0,
      repTime: null
    }
  ]
});

export default {
  components: { Add },
  props: {
    updatableWorkout: Object
  },
  computed: {
    formValid: function() {
      const { title, steps } = this.workoutForm;
      return (
        Boolean(title) &&
        steps &&
        (steps.length > 0) &
          steps.every(s => {
            return Boolean(s.exercise);
          })
      );
    },
    isUpdating() {
      return this.updatableWorkout !== null;
    }
  },
  watch: {
    updatableWorkout(newWorkout) {
      if (newWorkout !== null) {
        this.workoutForm = {
          ...getDefaultWorkout(),
          ...newWorkout
        };
      }
    }
  },
  data() {
    return {
      workoutForm: getDefaultWorkout()
    };
  },
  methods: {
    toggleRepFlag: function(step) {
      console.log(step.order);
      if (step.isByRep) {
        step.repTime = null;
        step.repNb = 0;
      } else {
        step.repNb = null;
        step.repTime = "00:00";
      }
    },
    resetForm() {
      this.workoutForm = getDefaultWorkout();
    },
    submitForm() {
      // Ensure last step does not have a rest time
      this.workoutForm.steps[this.workoutForm.steps.length - 1].restTime = null;
      this.$emit(this.isUpdating ? "update" : "create", this.workoutForm);
    },
    addStep() {
      this.workoutForm.steps.push({
        order: Math.max(...this.workoutForm.steps.map(s => s.order)) + 1,
        exercise: "",
        repNb: 0,
        repTime: null,
        restTime: "00:00",
        isByRep: true,
        details: ""
      });
    },
    removeStep(order) {
      this.workoutForm.steps = this.workoutForm.steps
        .filter(s => s.order !== order)
        .map((workout, i) => {
          workout.order = i + 1;
          return workout;
        });
      // TODO: Reorder all further steps
    }
  }
};
</script>

<style lang="scss" scoped>
// Workout form styles
%step-icon {
  position: absolute;
  right: -10px;
  width: 20px;
  height: 20px;
  text-align: center;
}

#workout__form {
  display: flex;
  flex-flow: column;
  align-items: center;
  margin: 10px;
}
.step-line {
  display: flex;
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

    display: flex;
    justify-content: flex-start;
    margin: 0;
    padding: 10px;
    label {
      padding-left: 4px;
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

.add-step__button {
  padding-right: 11px;
  margin: 10px;
}
.delete-step__button {
  cursor: pointer;
  align-self: flex-start;
}

// Step Form
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
</style>
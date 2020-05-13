<template>
  <div id="workouts">
    <ExpandableButton
      class="expandable-button"
      label="Create Workout"
      ref="expandableButton"
      @collapse="resetForm"
    >
      <form @submit.prevent id="workout__form" @submit="submitForm">
        <h2>{{updatableWorkout ? 'Update your Workout: ' + updatableWorkout.title : 'Create your Workout'}}</h2>
        <md-field>
          <label>Workout Title</label>
          <md-input
            v-model.trim="workoutForm.title"
            type="text"
            placeholder="Morning Workout"
            name="title"
            required
            autofocus
          ></md-input>
        </md-field>

        <button class="flat add-step__button" type="button" @click="addStep">
          <Add />Add Step
        </button>

        <div>
          <!-- <span @click="removeStep(step.order)" class="delete-step__button">
            <md-tooltip>Remove step</md-tooltip>
            <md-icon class="clickable md-accent">delete</md-icon>
          </span>-->
          <Step
            v-for="(step, index) in workoutForm.steps"
            :key="step.order"
            class="step-line"
            :step="step"
            :isEdit="true"
            :showRestTime="workoutForm.steps.length !== index + 1"
          />
        </div>
        <button type="submit" class="primary" :disabled="!formValid">Create</button>
      </form>
    </ExpandableButton>

    <section id="workout__list">
      <template v-if="workouts.data && workouts.data.length > 0">
        <WorkoutCard
          v-for="(workout, i) in workouts.data"
          :key="'workout-'+ i"
          :workout="workout"
          @update="selectWorkout(workout)"
          @delete="deleteWorkout(workout.id)"
          @play="alert('o')"
        />
      </template>
      <template v-else>
        <p>There are currently no workout</p>
      </template>
    </section>
  </div>
</template>
<script>
import fb from "../firebaseConfig";
import { mapGetters } from "vuex";
import Step from "@/components/Step";
import Add from "vue-material-design-icons/Plus";
import WorkoutCard from "@/components/WorkoutCard";

import ExpandableButton from "@/components/atomic/ExpandableButton";

const DEFAULT_WORKOUT = {
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
};

export default {
  components: { WorkoutCard, Step, Add, ExpandableButton },
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
    ...mapGetters({ workouts: "workouts" })
  },
  data() {
    return {
      workoutForm: DEFAULT_WORKOUT,
      selectedWorkout: this.workout,
      updatableWorkout: null
    };
  },
  methods: {
    resetForm() {
      alert("reset");
      this.workoutForm.steps.splice(0, this.workoutForm.steps.length, {
        order: 1,
        exercise: "",
        restTime: "00:00",
        isByRep: true,
        repNb: 0,
        repTime: null
      });
      // this.workoutForm = {
      //   title: "",
      //   steps: [
      //     {
      //       order: 1,
      //       exercise: "",
      //       restTime: "00:00",
      //       isByRep: true,
      //       repNb: 0,
      //       repTime: null
      //     }
      //   ]
      // };
    },
    submitForm() {
      this.$emit(
        this.selectedWorkout !== null ? "update" : "create",
        this.workoutForm
      );
      if (this.selectedWorkout !== null) {
        alert("Updating");
      } else {
        alert("Creating");
      }
    },

    toggleRepFlag(step) {
      if (step.isByRep) {
        step.repTime = null;
        step.repNb = 0;
      } else {
        step.repNb = null;
        step.repTime = "00:00";
      }
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
    },

    selectWorkout(workout) {
      console.log(workout);
      this.updatableWorkout = this.cloneWorkout(workout);
    },
    cloneWorkout({ steps, ...workout }) {
      return {
        ...workout,
        steps: steps.map(a => a)
      };
    },
    closeForm() {
      this.$refs.expandableButton.toggleExpand();
    },

    // API Methods

    createWorkout(workout) {
      fb.workoutsCollection
        .add({
          createdOn: new Date(),
          ...workout
        })
        .then(this.closeForm)
        .catch(err => console.error(err));
    },
    deleteWorkout(id) {
      if (confirm("Are you sure you want to delete this workout ?")) {
        fb.workoutsCollection
          .doc(id)
          .delete()
          .then(() => {
            console.log("Deleted successfully");
          })
          .catch(err => console.error(err));
      }
    },
    updateWorkout(id) {
      fb.workoutsCollection
        .doc(id)
        .update({ ...this.workoutForm, id })
        .then(() => {
          console.log("Upated successfully");
          this.closeForm();
        })
        .catch(err => console.error(err));
    }
  },
  filters: {
    trimLength(val) {
      if (val.length < 200) {
        return val;
      }
      return `${val.substring(0, 200)}...`;
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

// Workouts style
.add-step__button {
  padding-right: 11px;
  margin: 10px;
}
.delete-step__button {
  align-self: flex-start;
}

.expandable-button {
  margin: 0vh 22.5vh;
}

#workout__list {
  display: flex;
  margin: 5vh 0;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: flex-start;
  > * {
    margin: 10px;
  }
}

.expanded {
  transform: rotate(180);
}
.md-card-expand-content {
  display: none;
}
.md-expand-active {
  .md-card-expand-content {
    display: block;
  }
}

.card__list {
  display: flex;
  flex-flow: column;
  margin: 0 10vw;
}
</style>
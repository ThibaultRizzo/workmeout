<template>
  <div id="dashboard">
    <section id="workout__form">
      <md-button
        v-if="!showForm"
        class="md-raised md-primary call-to-action"
        @click="openForm()"
      >Create Workout</md-button>
      <md-button
        v-else
        class="md-icon-button md-raised md-accent close-form__button"
        @click="closeForm()"
      >
        <md-icon>close</md-icon>
      </md-button>

      <form v-if="showForm" @submit.prevent>
        <md-steppers :md-active-step.sync="stepper.active" md-linear>
          <md-step id="first" md-label="Set your workout" :md-done.sync="stepper.first">
            <div class="stepper-wrapper">
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

              <md-switch
                v-model="workoutForm.isByRep"
                class="md-primary"
                @click="toggleRepFlag(true)"
              >{{workoutForm.isByRep ? "By Rep" : "By Time"}}</md-switch>

              <md-field>
                <label>Rest Time</label>
                <md-input
                  v-model="workoutForm.restTime"
                  min="00:00"
                  type="time"
                  name="restTime"
                  id="restTime"
                ></md-input>
              </md-field>
              <md-button
                class="next-step__button md-raised md-primary"
                @click="setDone('first', 'second')"
                :disabled="!firstStepValid"
              >Continue</md-button>
            </div>
          </md-step>
          <md-step id="second" md-label="Compose your steps" :md-done.sync="stepper.second">
            <div class="second-step"></div>
            <md-button class="md-primary" @click="addStep">
              <md-icon>add</md-icon>
              {{" "}} Add Step
            </md-button>
            <div v-for="(step, index) in workoutForm.steps" :key="index" class="step-line">
              <span @click="removeStep(step.order)">
                <md-tooltip>Delete step</md-tooltip>
                <md-icon class="clickable md-accent" @click="removeStep(step.order)">delete</md-icon>
              </span>

              <h3>{{step.order}}</h3>

              <md-field>
                <label>Exercise Name</label>
                <md-input
                  v-model.trim="step.exercise"
                  :key="index"
                  type="text"
                  name="exercise"
                  required
                  autofocus
                ></md-input>
              </md-field>

              <md-field v-if="workoutForm.isByRep">
                <label>Rep Number</label>
                <md-input v-model="step.repNb" type="number" name="repNb" id="repNb"></md-input>
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
                ></md-input>
              </md-field>
            </div>
            <md-button
              class="md-raised md-primary"
              @click="submitForm"
              :disabled="!secondStepValid"
            >Create Workout</md-button>
          </md-step>
        </md-steppers>
      </form>
    </section>

    <section id="workout__list">
      <div v-if="workouts.data && workouts.data.length > 0" class="card__list card-expansion">
        <div
          v-for="(workout, i) in workouts.data"
          :key="'workout-'+ i"
          class="expandable-card"
          :class="{expanded: expandedWorkout === i}"
        >
          <div class="card">
            <div class="card-header" @click="toggleExpandedWorkout(i)">
              <h3 class="title md-title">{{workout.title}}</h3>
              <div class="duration">
                <strong>Duration:</strong>
                {{getTotalDuration(workout)}}
              </div>
            </div>

            <md-button class="md-icon-button expand-button" @click="toggleExpandedWorkout(i)">
              <md-icon>keyboard_arrow_down</md-icon>
            </md-button>
          </div>
          <div class="card-expand-content">
            <div class="extras">
              <md-button class="md-raised md-primary" @click="openForm(workout.id)">
                <md-icon>edit</md-icon>
                {{" "}} Update
              </md-button>
              <md-button class="md-raised md-accent" @click="deleteWorkout(workout.id)">
                <md-icon>delete</md-icon>
                {{" "}} Delete
              </md-button>
            </div>
            <div v-for="(step, j) in workout.steps" class="step" :key="'step-'+ j">
              <h5
                class="md-subheading"
              >{{step.order}}. {{step.exercise}} - {{workout.isByRep ? (`${step.repNb} reps`) : (`Duration: ${step.repTime}`)}}</h5>
              <span class="step__rest-time">Rest Time: {{workout.restTime | formatDuration}}</span>
            </div>
          </div>
        </div>
      </div>
      <div v-else>
        <p>There are currently no workout</p>
      </div>
    </section>
  </div>
</template>
<script>
import fb from "../firebaseConfig";
import { mapGetters } from "vuex";
import moment from "moment";
import { timeToSeconds, secondsToHumanDuration } from "../utils/TimeUtils";

const DEFAULT_FORM_STATE = {
  title: "",
  isByRep: true,
  restTime: "00:00",
  steps: [
    {
      order: 1,
      exercise: "",
      repNb: 0,
      repTime: null,
      details: ""
    }
  ]
};

const DEFAULT_STEPPER = {
  active: "first",
  first: false,
  second: false
};

export default {
  computed: {
    firstStepValid: function() {
      return Boolean(this.workoutForm.title);
    },
    secondStepValid: function() {
      return (
        this.workoutForm.steps &&
        this.workoutForm.steps.length > 0 &&
        this.workoutForm.steps.every(
          s => Boolean(s.exercise) && (s.repNb > 0 || s.repTime !== null)
        )
      );
    },
    ...mapGetters({ workouts: "workouts" })
  },
  data() {
    return {
      workoutForm: { ...DEFAULT_FORM_STATE },
      updatedId: null,
      showForm: false,
      stepper: { ...DEFAULT_STEPPER },
      expandedWorkout: null
    };
  },
  methods: {
    toggleExpandedWorkout(id) {
      this.expandedWorkout =
        this.expandedWorkout === id ? null : (this.expandedWorkout = id);
    },
    setDone(id, index) {
      this.stepper[id] = true;
      if (index) {
        this.stepper.active = index;
      }
    },
    submitForm() {
      if (this.updatedId) {
        this.updateWorkout(this.updatedId);
      } else {
        this.createWorkout();
      }
      this.stepper = DEFAULT_STEPPER;
    },

    openForm(id) {
      this.showForm = true;
      if (id) {
        this.updatedId = id;
        const updatableWorkout = this.workouts.data.find(w => w.id === id);
        this.workoutForm = {
          ...this.workoutForm,
          ...updatableWorkout,
          steps: updatableWorkout.steps.map()
        };
      }
    },
    closeForm() {
      this.showForm = false;
      this.updatedId = null;
      this.resetForm();
    },
    toggleRepFlag() {
      this.workoutForm.steps.forEach(step => {
        if (this.workoutForm.isByRep) {
          step.repTime = null;
          step.repNb = 0;
        } else {
          step.repNb = null;
          step.repTime = "00:00";
        }
      });
    },
    addStep() {
      this.workoutForm.steps.push({
        order: Math.max(...this.workoutForm.steps.map(s => s.order)) + 1,
        exercise: "",
        repNb: this.workoutForm.isByRep ? 0 : null,
        repTime: this.workoutForm.isByRep ? null : "00:00",
        restTime: 0,
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
    resetForm() {
      this.workoutForm = { ...DEFAULT_FORM_STATE };
      this.stepper = { ...DEFAULT_STEPPER };
    },
    createWorkout() {
      fb.workoutsCollection
        .add({
          createdOn: new Date(),
          ...this.workoutForm
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
    },
    getTotalDuration(workout) {
      return secondsToHumanDuration(
        workout.steps
          .map(s =>
            workout.isByRep
              ? this.repNbToRepTime(s.repNb)
              : timeToSeconds(s.repTime)
          )
          .reduce((acc, val) => acc + val, 0)
      );
    },
    repNbToRepTime(repNb) {
      return repNb * 3; // Arbitrarely set avg rep takes 3 seconds to do
    }
  },
  filters: {
    formatDate(val) {
      if (!val) {
        return "-";
      }
      let date = val.toDate();
      return moment(date).fromNow();
    },
    formatDuration(val) {
      return moment.duration(timeToSeconds(val) * 1000).humanize();
    },
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
#workout__form {
  margin: 0 10vw;
}
.close-form__button {
  margin: 10px;
}
.stepper-wrapper {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items: center;
  .md-field,
  .md-switch {
    flex-basis: 30%;
  }
  .next-step__button {
    margin-left: auto;
  }
}
.second-step {
  display: flex;
  flex-flow: column;
  align-items: center;
}
.step-line {
  display: flex;
  align-items: center;
  > * {
    margin-right: 10px;
  }
}
.md-switch {
  display: flex;
  justify-content: center;
}
.clickable {
  cursor: pointer;
}

#workout__list {
}
.card-expansion {
  height: 480px;
}

.card__list {
}
.md-card {
  width: 320px;
  margin: 4px;
  display: inline-block;
  vertical-align: top;
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

.card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);
  .card-header {
    display: flex;
    flex-flow: column;
    align-items: center;
    flex: 1;
    cursor: pointer;
    > * {
      margin-right: 10px;
    }
  }
}

.expandable-card {
  background-color: white;
  box-shadow: 0 3px 1px -2px rgba(0, 0, 0, 0.2), 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 1px 5px 0 rgba(0, 0, 0, 0.12);

  margin: 10px;
  .extras {
    display: flex;
    justify-content: flex-end;
  }
  .card-expand-content {
    max-height: 0;
    opacity: 0;
    transition: 1s;
  }
  &.expanded {
    .expand-button {
      transform: rotate(180deg);
    }
    .card-expand-content {
      transition: 1s;
      transition: max-height ease-out 0.5s;

      opacity: 1;
      margin-top: 10px;
      max-height: 1000px;
    }
  }
}

.step {
  display: flex;
  flex-flow: column;
  margin: 10px;
  h5 {
    margin: 0;
  }
  .step__rest-time {
  }
}
</style>
<template>
  <div id="dashboard">
    <section id="create-workout__form">
      <button @click="toggleCreationForm">Create workout</button>
      <form v-if="showCreationForm" @submit="createWorkout" @submit.prevent>
        <label for="title">Workout Title</label>
        <input
          v-model.trim="workoutForm.title"
          type="text"
          placeholder="Morning Workout"
          name="title"
          required
          autofocus
        />

        <button @click="addStep">Add step</button>
        <div v-for="(step, index) in workoutForm.steps" :key="index">
          <h3>{{step.order}}</h3>
          <button @click="removeStep(step.order)">Delete</button>

          <label for="exercise">Exercise Name</label>
          <input
            v-model.trim="step.exercise"
            :key="index"
            type="text"
            placeholder="Crunches"
            name="exercise"
            required
            autofocus
          />

          <button
            type="button"
            @click="toggleRepFlag(step.order, true)"
            :disabled="step.isByRep"
          >By Rep</button>
          <button
            type="button"
            @click="toggleRepFlag(step.order, false)"
            :disabled="!step.isByRep"
          >By Time</button>

          <div v-if="step.isByRep">
            <label for="repNb">Rep Number</label>
            <input v-model="step.repNb" type="number" name="repNb" id="repNb" />
          </div>
          <div v-else>
            <label for="repTime">Rep Time</label>
            <input v-model="step.repTime" type="time" min="00:00" name="repTime" id="repTime" />
          </div>

          <label for="restTime">Rest Time</label>
          <input v-model="step.restTime" min="00:00" type="time" name="restTime" id="restTime" />

          <label for="details">More details</label>
          <textarea v-model.trim="step.details" name="details" id="details" rows="3"></textarea>
        </div>

        <button type="submit" class="button">Create workout</button>
      </form>
    </section>
    <section id="workout-list">
      <div v-if="workouts.data && workouts.data.length > 0">
        <div v-for="(workout, i) in workouts.data" class="workout" :key="'workout-'+ i">
          <h3>{{workout.title}}</h3>
          <span>{{workout.createdOn | formatDate}}</span>

          <div v-for="(step, j) in workout.steps" class="step" :key="'step-'+ j">
            <h5>{{step.order}} - {{step.exercise}}</h5>
            <span>{{step.isByRep ? (`${step.repNb} reps`) : (`Duration: ${step.repTime}`)}}</span>
            <span>Rest Time: {{step.restTime}}</span>
            <p>{{step.details | trimLength}}</p>
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
export default {
  computed: {
    ...mapGetters({ workouts: "workouts" })
  },
  data() {
    return {
      workoutForm: {
        title: "",
        steps: [
          {
            order: 1,
            exercise: "",
            repNb: 0,
            repTime: null,
            restTime: "00:00",
            details: "",
            isByRep: true
          }
        ]
      },
      showCreationForm: false
    };
  },
  methods: {
    toggleCreationForm() {
      this.showCreationForm = !this.showCreationForm;
    },
    toggleRepFlag(order, isByRep) {
      const step = this.workoutForm.steps.find(s => s.order === order);
      if (isByRep) {
        step.repTime = null;
        step.repNb = 0;
        step.isByRep = true;
      } else {
        step.repNb = null;
        step.repTime = "00:00";
        step.isByRep = false;
      }
    },
    addStep() {
      this.workoutForm.steps.push({
        order: Math.max(...this.workoutForm.steps.map(s => s.order)) + 1,
        exercise: "",
        repNb: 0,
        repTime: null,
        restTime: 0,
        isByRep: true,
        details: ""
      });
    },
    removeStep(order) {
      this.workoutForm.steps = this.workoutForm.steps.filter(
        s => s.order !== order
      );
      // TODO: Reorder all further steps
    },
    resetForm() {
      this.workoutForm = {
        title: "",
        steps: [
          {
            order: 1,
            exercise: "",
            repNb: 0,
            repTime: null,
            restTime: 0,
            isByRep: true,
            details: ""
          }
        ]
      };
    },
    createWorkout() {
      fb.workoutsCollection
        .add({
          createdOn: new Date(),
          ...this.workoutForm
        })
        .then(this.resetForm)
        .catch(err => console.error(err));
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
    trimLength(val) {
      if (val.length < 200) {
        return val;
      }
      return `${val.substring(0, 200)}...`;
    }
  }
};
</script>
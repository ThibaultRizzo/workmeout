<template>
  <section id="workout-player">
    <div id="workout-selection">
      <select v-model="selectedWorkout">
        <option disabled value="null">Please select one</option>
        <option
          v-for="workout in workouts.data"
          v-bind:value="workout"
          :key="workout.id"
        >{{workout.title}}</option>
      </select>
      <span>Selected: {{ isFinished }}</span>
    </div>
    <span>Selected: {{ currentStep }}</span>

    <div v-if="selectedWorkout">
      <h2>{{`${selectedWorkout.title} - ${this.currentOrder}`}}</h2>

      <div v-if="currentOrder === 0">
        <h3>Let's get started</h3>

        <button @click="goToNextTick">Start</button>
      </div>

      <div v-else-if="isRestTime">
        <BaseTimer id="rest-time-timer" :time="timeToSeconds(currentStep.restTime)" />
        <strong>{{currentStep.restTime}}</strong>
        <button>Pause</button>
        <button @click="goToNextTick">Skip</button>
      </div>

      <div v-else-if="isFinished">
        <h3>You are done!!!</h3>
      </div>

      <div v-else-if="currentStep && currentStep.isByRep">
        <h3>{{currentStep.exercise}}</h3>
        <strong>{{currentStep.repNb}} reps</strong>
        <p>{{currentStep.details}}</p>
        <button @click="goToNextTick">Done</button>
      </div>

      <div v-else-if="currentStep && !currentStep.isByRep">
        <h3>{{currentStep.exercise}}</h3>
        <BaseTimer id="rep-time-timer" :time="timeToSeconds(currentStep.repTime)" />
        <strong>{{`Duration: ${currentStep.repTime}`}}</strong>
        <p>{{currentStep.details}}</p>
        <button>Pause</button>
        <button @click="goToNextTick">Skip</button>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import BaseTimer from "@/components/BaseTimer";
import moment from "moment";

export default {
  components: {
    BaseTimer
  },
  computed: {
    ...mapGetters({ workouts: "workouts" })
  },
  data() {
    return {
      selectedWorkout: null,
      currentOrder: 0,
      currentStep: null,
      isRestTime: false,
      isFinished: false
    };
  },
  watch: {
    selectedWorkout: function() {
      this.currentOrder = 0;
      this.isRestTime = false;
      this.isFinished = false;
    },
    currentOrder: function(order) {
      const steps = this.selectedWorkout.steps
        .filter(s => s.order >= order)
        .sort((a, b) => a.order - b.order);
      if (steps.length === 0) {
        this.currentStep = null;
        this.isFinished = true;
      } else {
        this.currentStep = steps[0];
        if (this.currentStep.order !== this.currentOrder) {
          this.currentOrder = this.currentStep.order;
        }
      }
    }
  },
  methods: {
    goToNextTick() {
      if (this.isRestTime) {
        this.currentOrder++;
        this.isRestTime = false;
      } else {
        this.isRestTime = true;
      }
    },
    timeToSeconds(time) {
      // time should be "mm:ss"
      console.log("Time: ", time);
      return moment.duration("00:" + time).asSeconds();
    }
  }
};
</script>
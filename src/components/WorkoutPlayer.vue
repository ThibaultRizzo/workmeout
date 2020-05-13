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
    </div>

    <div v-if="selectedWorkout" id="current-workout">
      <h2>{{selectedWorkout.title}}</h2>

      <div v-if="currentOrder === 0">
        <h3 class="important">Let's get started</h3>

        <button @click="goToNextTick">
          <Bomb />Start
        </button>
      </div>

      <div v-else-if="isRestTime">
        <BaseTimer
          id="rest-time-timer"
          key="rest-time-timer"
          :time="timeToSeconds(selectedWorkout.restTime)"
          @timer-up="goToNextTick"
        >
          <strong>Rest!</strong>
        </BaseTimer>
      </div>

      <div v-else-if="isFinished">
        <h3>You are done!!!</h3>
      </div>

      <div v-else-if="selectedWorkout.isByRep">
        <RepLayout :repNb="currentStep.repNb" @done="goToNextTick">
          <h3>{{currentStep.exercise}}</h3>
        </RepLayout>
      </div>

      <div v-else-if="!selectedWorkout.isByRep">
        <BaseTimer
          id="rep-time-timer"
          key="rep-time-timer"
          :time="timeToSeconds(currentStep.repTime)"
          @timer-up="goToNextTick"
        >
          <strong>{{currentStep.exercise}}</strong>
        </BaseTimer>
      </div>
    </div>

    <div class="workout-program">
      <div class="horizontal-path" />
      <div v-for="(step, i) in stepsLeft" :key="step.order" class="exercise-wrapper">
        <div
          class="rest-time"
          v-if="!isRestTime || i !==0"
        >{{getDuration(selectedWorkout.restTime)}}</div>
        <h5
          class="exercise"
        >{{selectedWorkout.isByRep ? `${step.repNb} ${step.exercise}` : `${step.exercise} for ${getDuration(step.repTime)}`}}</h5>
      </div>
    </div>
  </section>
</template>

<script>
import { mapGetters } from "vuex";
import BaseTimer from "@/components/BaseTimer";
import RepLayout from "@/components/RepLayout";
import Bomb from "vue-material-design-icons/Bomb.vue";
import moment from "moment/moment";
import { timeToSeconds, secondsToHumanDuration } from "../utils/TimeUtils";

export default {
  components: {
    BaseTimer,
    RepLayout,
    Bomb
  },
  computed: {
    stepsLeft: function() {
      const hasStepsLeft =
        this.selectedWorkout &&
        this.currentOrder < this.selectedWorkout.steps.length;
      return hasStepsLeft
        ? this.selectedWorkout.steps
            .filter(s => s.order > this.currentOrder)
            .sort((a, b) => a.order - b.order)
        : [];
    },
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
      this.currentStep = null;
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
    getDuration: function(time) {
      return secondsToHumanDuration(timeToSeconds(time));
    },
    goToNextTick() {
      if (
        this.isRestTime ||
        this.currentOrder === 0 ||
        this.currentOrder === this.selectedWorkout.steps.length
      ) {
        this.currentOrder++;
        this.isRestTime = false;
      } else {
        this.isRestTime = true;
      }
    },
    timeToSeconds(time) {
      // time should be "mm:ss"
      return moment.duration("00:" + time).asSeconds();
    }
  }
};
</script>
<style lang="scss" scoped>
.important {
  padding: 10px;
  font-size: 2em;
}
#current-workout {
  display: flex;
  align-items: center;
  flex-flow: column;
}

.workout-program {
  margin: 10px;
  position: relative;

  .rest-time {
    background: #41b883;
    color: #fafafa;
    padding: 10px;
    border-radius: 10px;
  }
  .exercise {
    border: 2px solid #41b883;
    border-radius: 10px;
    background: #fafafa;
    color: grey;
    padding: 10px;
  }

  .exercise-wrapper {
    display: flex;
    flex-flow: column;
    align-items: center;
  }
}

.horizontal-path {
  position: absolute;
  left: 50%;
  top: -30px;
  width: 0;
  height: 100%;
  border: 1px solid #41b883;
  z-index: -1;
}
</style>
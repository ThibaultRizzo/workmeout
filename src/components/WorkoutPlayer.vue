<template>
  <transition name="slide">
    <section id="workout-player">
      <button @click="$router.push('/workouts')">
        <Return />Return
      </button>
      <div v-if="selectedWorkout" id="current-workout">
        <h2>{{selectedWorkout.title}}</h2>

        <div v-if="currentOrder === 0">
          <h3 class="important">Let's get started</h3>

          <button class="primary" @click="goToNextTick">
            <Bomb />Start
          </button>
        </div>

        <div v-else-if="isRestTime">
          <Step :step="currentStep" :showStep="false" />
          <BaseTimer
            id="rest-time-timer"
            key="rest-time-timer"
            :time="timeToSeconds(currentStep.restTime)"
            :isRest="true"
            @timer-up="goToNextTick"
          >
            <strong>Rest!</strong>
          </BaseTimer>
        </div>

        <div v-else-if="isFinished">
          <h3>You are done!!!</h3>
        </div>

        <div v-else-if="currentStep.isByRep">
          <Step :step="currentStep" :showRestTime="false" />
          <RepLayout :repNb="currentStep.repNb" @done="goToNextTick">
            <h3>{{currentStep.exercise}}</h3>
          </RepLayout>
        </div>

        <div v-else-if="!currentStep.isByRep">
          <Step :step="currentStep" :showRestTime="false" />
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
        <Step
          v-for="(step, i) in stepsLeft"
          :key="i"
          :step="step"
          :showStep="!(currentOrder === step.order && isRestTime)"
          class="exercise-wrapper"
        />
      </div>
    </section>
  </transition>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import BaseTimer from "@/components/BaseTimer";
import RepLayout from "@/components/RepLayout";
import Step from "@/components/Step";
import Bomb from "vue-material-design-icons/Bomb.vue";
import Return from "vue-material-design-icons/ArrowLeft.vue";
import moment from "moment/moment";
import { timeToSeconds, secondsToHumanDuration } from "../utils/TimeUtils";

export default {
  components: {
    BaseTimer,
    RepLayout,
    Step,
    Return,
    Bomb
  },
  props: {
    id: {
      required: true
    }
  },
  data() {
    return {
      currentOrder: 0,
      currentStep: null,
      isRestTime: false,
      isFinished: false
    };
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
    selectedWorkout() {
      return this.getWorkoutById(this.id);
    },
    ...mapGetters(["getWorkoutById"])
  },
  created() {
    this.fetchWorkoutsIfNeeded();
  },

  watch: {
    workouts() {
      console.log("Done");
      this.selectedWorkout = this.getWorkoutById(this.id);
    },
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
    ...mapActions(["fetchWorkoutsIfNeeded"]),
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
    background: $primary;
    color: #fafafa;
    padding: 10px;
    border-radius: 10px;
  }
  .exercise {
    border: 2px solid $primary;
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
  border: 3px solid $primary;
  z-index: -1;
}
</style>
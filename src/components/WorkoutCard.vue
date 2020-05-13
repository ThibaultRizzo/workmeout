<template>
  <ExpandableCard class="workout-card">
    <template v-slot:main>
      <h3>{{workout.title}}</h3>
      <p class="subtitle">{{getTotalDuration(workout)}}</p>
      <div class="card__controls">
        <Play class="play-icon icon-button" @click="$emit('play')" />
      </div>
    </template>
    <template v-slot:expandable-content>
      <div class="steps-card">
        <div class="steps-list">
          <Step v-for="step in workout.steps" :step="step" :key="'step-' + step.order" />
          <!-- <template>
            <div
              
              class="step"
              :class="[step.isByRep ? 'by-rep' : 'by-time']"
            >
              <span class="order">{{step.order}}</span>
              <span class="exercise">{{step.exercise}}</span>
              <span class="exercise-nb">{{step.isByRep ? step.repNb : step.repTime}}</span>
            </div>
            <div
              v-if="step.restTime"
              :key="'rest-' + step.order"
              class="rest-time"
            >💧 {{step.restTime}}</div>
          </template>-->
        </div>
        <div class="steps__controls">
          <Edit class="edit-icon icon-button" @click="$emit('update')" />
          <Delete class="delete-icon icon-button" @click="$emit('delete')" />
        </div>
      </div>
    </template>
  </ExpandableCard>
</template>

<script>
import ExpandableCard from "@/components/atomic/ExpandableCard";
import Step from "@/components/Step";
import Play from "vue-material-design-icons/Play";
import Edit from "vue-material-design-icons/Pencil";
import Delete from "vue-material-design-icons/Delete";

import { timeToSeconds, secondsToHumanDuration } from "../utils/TimeUtils";

export default {
  components: { ExpandableCard, Step, Play, Edit, Delete },
  props: {
    workout: {
      type: Object,
      required: true
    }
  },
  methods: {
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
  }
};
</script>

<style lang="scss" scoped>
.workout-card {
  width: 300px;
  display: flex;
  flex-flow: column;
  text-align: left;
}
.subtitle {
  text-transform: capitalize;
  text-align: left;
  margin: 5px 0;
}
.card__controls {
  display: flex;
  justify-content: center;
  align-items: center;
}
.steps-card {
  display: flex;
  flex-flow: column;
  align-items: stretch;
  padding: 0px 30px;
  background-color: white;
  .steps-list {
    display: flex;
    flex-flow: column;
    justify-content: space-between;
    position: relative;
    padding-top: 15px;
    text-align: center;
    &::after {
      content: "";
      display: block;
      height: calc(100% - 10px);
      width: 2px;
      position: absolute;
      top: 0;
      background: $primary;
      align-self: center;
    }
  }
  .steps__controls {
    display: flex;
    justify-content: center;
    margin: 5px;
    color: $accent;
  }
}

.icon-button {
  &.play-icon {
    height: 50px;
    width: 50px;
    padding: 5px;
  }
  &.edit-icon {
    height: 30px;
    width: 30px;
    margin: 5px;
    background: $warning;
  }
  &.delete-icon {
    height: 30px;
    width: 30px;
    margin: 5px;
    background: $primary;
  }
}
</style>
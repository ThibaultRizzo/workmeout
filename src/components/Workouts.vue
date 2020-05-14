<template>
  <div id="workouts">
    <ExpandableButton
      class="expandable-button"
      label="Create Workout"
      ref="expandableButton"
      @collapse="resetForm"
    >
      <WorkoutForm
        :updatableWorkout="updatableWorkout"
        ref="workoutForm"
        @update="updateWorkout"
        @create="createWorkout"
      />
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

import WorkoutCard from "@/components/WorkoutCard";
import WorkoutForm from "@/components/WorkoutForm";

import ExpandableButton from "@/components/atomic/ExpandableButton";

export default {
  components: { WorkoutCard, WorkoutForm, ExpandableButton },
  computed: {
    ...mapGetters({ workouts: "workouts" })
  },
  data() {
    return {
      updatableWorkout: null
    };
  },
  methods: {
    selectWorkout(workout) {
      this.updatableWorkout = this.cloneWorkout(workout);
      this.$refs.expandableButton.expand();
    },
    cloneWorkout({ steps, ...workout }) {
      return {
        ...workout,
        steps: steps.map(a => a)
      };
    },
    closeForm() {
      this.resetForm();
      this.$refs.expandableButton.collapse();
    },

    resetForm() {
      if (this.updatableWorkout) {
        this.updatableWorkout = null;
      }
      this.$refs.workoutForm.resetForm();
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
    updateWorkout(workout) {
      console.log(workout);
      fb.workoutsCollection
        .doc(workout.id)
        .update(workout)
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
// Workouts style

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
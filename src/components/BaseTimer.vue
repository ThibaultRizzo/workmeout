<template>
  <div class="base-timer">
    <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <g class="base-timer__circle">
        <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45" />
        <path
          :stroke-dasharray="circleDasharray"
          class="base-timer__path-remaining"
          :class="remainingPathColor"
          d="
            M 50, 50
            m -45, 0
            a 45,45 0 1,0 90,0
            a 45,45 0 1,0 -90,0
          "
        />
      </g>
    </svg>
    <span class="base-timer__label">{{ formattedTimeLeft }}</span>
    <Play v-if="isTimePaused" :disabled="timeLeft === 0" @click="play" />
    <Pause v-else :disabled="timeLeft === 0" @click="pause" />

    <SkipNext @click="skip" />

    <div id="slot">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Play from "vue-material-design-icons/Play";
import SkipNext from "vue-material-design-icons/SkipNext.vue";
import Pause from "vue-material-design-icons/Pause.vue";

const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
  info: {
    color: "green"
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD
  }
};
const beepSrc = require("../assets/beep.mp3");
const longBeepSrc = require("../assets/long_beep.mp3");
const doubleBeepSrc = require("../assets/double_beep.mp3");
const beep = new Audio(beepSrc);
beep.src = beepSrc;
const longBeep = new Audio(longBeepSrc);
beep.src = longBeepSrc;
const doubleBeep = new Audio(doubleBeepSrc);
beep.src = doubleBeepSrc;

export default {
  props: {
    time: {
      type: Number,
      default: 30
    },
    isRest: {
      type: Boolean,
      default: false
    }
  },
  components: {
    Play,
    SkipNext,
    Pause
  },
  data() {
    return {
      timeLimit: this.time,
      timePassed: 0,
      timerInterval: null,
      isTimePaused: false
    };
  },

  computed: {
    circleDasharray() {
      return `${(this.timeFraction * FULL_DASH_ARRAY).toFixed(0)} 283`;
    },

    formattedTimeLeft() {
      const timeLeft = this.timeLeft;
      const minutes = Math.floor(timeLeft / 60);
      let seconds = timeLeft % 60;

      if (seconds < 10) {
        seconds = `0${seconds}`;
      }

      return `${minutes}:${seconds}`;
    },

    timeLeft() {
      return this.timeLimit - this.timePassed;
    },

    timeFraction() {
      const rawTimeFraction = this.timeLeft / this.timeLimit;
      return rawTimeFraction - (1 / this.timeLimit) * (1 - rawTimeFraction);
    },

    remainingPathColor() {
      const { alert, warning, info } = COLOR_CODES;

      if (this.timeLeft <= alert.threshold) {
        return alert.color;
      } else if (this.timeLeft <= warning.threshold) {
        return warning.color;
      } else {
        return info.color;
      }
    }
  },

  watch: {
    timeLeft(newValue) {
      if (newValue === 0) {
        this.onTimesUp();
      }
    }
  },

  mounted() {
    this.startTimer();
  },

  beforeDestroy() {
    beep.removeAttribute("src");
    beep.load();
    doubleBeep.removeAttribute("src");
    doubleBeep.load();
    longBeep.removeAttribute("src");
    longBeep.load();
  },

  methods: {
    pause() {
      if (!this.isTimePaused && this.timeLeft > 0) {
        this.isTimePaused = true;
        clearInterval(this.timerInterval);
      }
    },
    play() {
      if (this.isTimePaused && this.timeLeft > 0) {
        this.isTimePaused = false;
        this.timePassed++;
        this.startTimer();
      }
    },
    skip() {
      this.timePassed = this.timeLimit;
    },
    onTimesUp() {
      // const audio = new Audio(AudioFile);
      // audio.play();
      clearInterval(this.timerInterval);
      setTimeout(() => {
        this.$emit("timer-up");
        // audio.pause();
        // audio.currentTime = 0;
      }, 2000);
    },

    startTimer() {
      this.timerInterval = setInterval(() => {
        if (!this.isRest && [6, 5, 4, 3, 2].includes(this.timeLeft)) {
          console.log(this.timeLeft);
          beep.currentTime = 0;
          beep.play();
          this.timePassed += 1;
        } else if (this.timeLeft === 1) {
          this.timePassed += 1;
          if (this.isRest) {
            doubleBeep.play();
          } else {
            longBeep.play();
          }
        } else if (this.timeLeft < -1) {
          console.log("Zero");
          console.log("times up: ", this.timePassed, " ", this.timeLeft);
          this.onTimesUp();
        } else {
          this.timePassed += 1;
        }
      }, 1000);
    }
  }
};
</script>

<style scoped lang="scss">
.base-timer {
  position: relative;
  width: 300px;
  height: 300px;

  &__svg {
    transform: scaleX(-1);
  }

  &__circle {
    fill: none;
    stroke: none;
  }

  &__path-elapsed {
    stroke-width: 7px;
    stroke: grey;
  }

  &__path-remaining {
    stroke-width: 7px;
    stroke-linecap: round;
    transform: rotate(90deg);
    transform-origin: center;
    transition: 1s linear all;
    fill-rule: nonzero;
    stroke: currentColor;

    &.green {
      color: rgb(65, 184, 131);
    }

    &.orange {
      color: orange;
    }

    &.red {
      color: red;
    }
  }

  &__label {
    position: absolute;
    width: 300px;
    height: 300px;
    top: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 48px;
  }
}

.material-design-icon {
  cursor: pointer;
  position: absolute;
  height: 42px;
  top: 200px;
  width: 47px;
  &.play-icon,
  &.pause-icon {
    left: 99px;
  }
  &.skip-next-icon {
    left: 159px;
  }
  svg {
    height: 100%;
    width: auto;
  }
  &:disabled {
    opacity: 0.5;
  }
}

#slot {
  position: absolute;
  top: 70px;
  width: 160px;
  height: 50px;
  left: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
}
</style>

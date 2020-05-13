<template>
  <div class="card" :class="{expanded}">
    <div class="card__main">
      <slot name="main"></slot>
      <ChevronDown class="card__expand-btn" @click="toggleExpand" />
      <div class="card__expandable-content">
        <slot name="expandable-content" v-if="expanded"></slot>
      </div>
    </div>
  </div>
</template>

<script>
import ChevronDown from "vue-material-design-icons/ChevronDown";

export default {
  components: {
    ChevronDown
  },
  data() {
    return {
      expanded: false
    };
  },
  methods: {
    toggleExpand() {
      this.expanded = !this.expanded;
    }
  }
};
</script>

<style lang="scss" scoped>
%card-shadow {
  box-shadow: 0px 1px 3px 1px rgba(0, 0, 0, 0.4);
}
.card {
  position: relative;
  .card__main {
    @extend %card-shadow;
    position: relative;
    padding: 12px;
    width: 100%;
    height: 100%;
    z-index: 1;
    background: white;

    .card__expand-btn {
      position: absolute;
      right: 0;
      bottom: 0;
      transition: 0.4s;
      cursor: pointer;
    }
  }

  @keyframes slideIn {
    0% {
      max-height: 0;
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      max-height: 1000px;
      opacity: 1;
    }
  }

  .card__expandable-content {
    // max-height: 0;
    transform-origin: top left;
    transform: scaleY(0);
    opacity: 0;
    transition: 0.4s;
  }

  &.expanded {
    transition: 0.4s;

    .card__main {
      // margin-bottom: 0;
    }
    .card__expand-btn {
      z-index: 10;
      transform: rotate(180deg);
    }
    .card__expandable-content {
      transition: 0.4s;
      transform: scaleY(1);
      opacity: 1;

      // animation: slideIn forwards ease-in-out 1s;
    }
  }
}
</style>
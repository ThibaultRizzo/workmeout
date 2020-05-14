<template>
  <div class="card__wrapper">
    <div class="card" :class="{expanded: isExpanded}">
      <Close class="close-icon icon-button" @click="toggleExpand" />
      <button class="primary expand-button call-to-action" @click="toggleExpand">{{label}}</button>
      <div
        class="expand-content"
        ref="expanding"
        :style="{'max-height': isExpanded ? contentScrollHeight + 'px' : '0'}"
      >
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
import Close from "vue-material-design-icons/Close";

export default {
  components: { Close },
  props: {
    label: {
      type: String,
      required: true
    }
  },
  mounted: function() {
    this.observer = new MutationObserver(
      function() {
        this.contentScrollHeight = this.$refs.expanding.scrollHeight;
      }.bind(this)
    );

    // Setup the observer
    this.observer.observe(this.$el, {
      attributes: true,
      childList: true,
      characterData: true,
      subtree: true
    });
  },
  data() {
    return {
      isExpanded: false,
      contentScrollHeight: 0
    };
  },
  methods: {
    toggleExpand() {
      this.isExpanded = !this.isExpanded;
      this.$emit(this.isExpanded ? "expand" : "collapse");
    },
    collapse() {
      this.isExpanded = false;
    },
    expand() {
      this.isExpanded = true;
    }
  }
};
</script>

<style lang="scss" scoped>
.card__wrapper {
  display: flex;
  justify-content: center;
}
.card {
  position: relative;
  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  overflow: hidden;
  transition: flex 0.5s ease-in;

  background: $primary;
  box-shadow: 0px 3px 8px 3px #00000057;
  &.expanded {
    background: white;
    flex: 1;
    .expand-button {
      transform: translateY(-50px);
      max-width: 100%;
      border-radius: 10px;
      background: white;
      white-space: nowrap;
    }
    .close-icon {
      transition: top 0.5s ease-in;
      top: 10px;
    }
    .expand-content {
      transform: scaleY(1);
    }
  }
}
button.expand-button {
  transition: transform 0.5s ease-in;
  box-shadow: none;
  &:hover {
    transform: none;
  }
}
.expand-content {
  transition: max-height 0.5s ease-in, transform 0.5s ease-in;
  flex-basis: 100%;
  width: 0;
  transform: scaleY(0);
  transform-origin: top;
  // max-height is set programmatically
}

.close-icon {
  position: absolute;
  top: -80px;
}
</style>
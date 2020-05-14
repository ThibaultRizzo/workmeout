<template>
  <div class="rep-layout">
    <div class="rep-nb">{{repNb}}</div>
    <br />
    <slot></slot>
    <h5 class="done-button" @click="$emit('done')">Done</h5>
  </div>
</template>

<script>
export default {
  props: {
    repNb: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      reps: this.repNb
    };
  }
};
</script>

<style lang="scss" scoped>
.rep-layout {
  position: relative;
  width: 300px;
  height: 300px;
  display: flex;
  flex-flow: column;
  align-items: center;
  background: #41b883;
  color: white;
  font-size: 32px;
  border-radius: 50%;
  font-weight: bold;
}
.rep-nb {
  height: 40px;
  margin-top: 70px;
}
.done-button {
  cursor: pointer;
  position: absolute;
  bottom: 50px;
  margin: 0;
  &:hover {
    text-decoration: underline;
  }
}
</style>
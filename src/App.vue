<template>
  <div>
    <transition name="fade">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>

export default {
  name: "app",
  components: {
  },
  data() {
    return {
      mvDataList: [],
      limit: 50,
      offset: 0
    };
  },
  mounted() {
    // this.init();
  },
  methods: {
    init() {
      this.axios
        .get("/top/mv", {
          params: {
            area: "内地",
            limit: this.limit,
            offset: this.offset
          }
        })
        .then(res => {
          if (res.data.code == 200) {
            console.log(res.data.data);
            for (let item of res.data.data) {
              this.getDetail(item.id);
            }
          } else {
          }
        })
        .catch(function(error) {});
    },
    getDetail(id) {
      this.axios
        .get("/mv/detail", {
          params: {
            mvid: id
          }
        })
        .then(res => {
          if (res.data.code == 200) {
            console.log(res.data.data);
            this.mvDataList.push(res.data.data);
          }
        })
        .catch(function(error) {});
    },
    toView(id) {
      console.log("22");
    }
  }
};
</script>

<style>
a {
  text-decoration: none;
  color: black;
}
#app {
  margin: 0;
  padding: 0;
}
html,
body {
  padding: 0;
  margin: 0;
  height: 100%;
  overflow: hidden;
}
.fade-enter {
  opacity:0;
}
.fade-leave{
  opacity:1;
}
.fade-enter-active{
  transition:opacity 0.1s;
}
.fade-leave-active{
  opacity:0;
  transition:opacity 0.1s;
}
</style>

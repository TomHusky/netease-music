<template>
  <div>
    <div v-for="item in comments" :key="item.id">
      <el-row id="comment_main" class="border">
        <el-col class="comment_left" :xs="4" :sm="4" :md="4" :lg="4" :xl="4">
          <img class="round_icon" :src="item.head_img" alt />
        </el-col>
        <el-col
          class="comment_right"
          :xs="20"
          :sm="20"
          :md="20"
          :lg="20"
          :xl="20"
        >
          <div class="comment_name">{{ item.name }}</div>
          <div class="comment_time">{{ item.time }}</div>
          <div class="comment_text">{{ item.text }}</div>
          <div>
            <span class="icon_span">
              <img class="icon_img" src="./../assets/icon/dot.svg" alt />
              <span class="dot_text">{{ item.dot_size }}</span>
            </span>
            <span class="icon_span">
              <img class="icon_img" src="./../assets/icon/send.svg" alt />
            </span>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    comments: [],
  },
  data() {
    return {};
  },
  computed: {},
  methods: {},
};
</script>

<style>
#comment_main {
  padding-top: 8px;
  padding-bottom: 10px;
}
.border {
  border-bottom: rgb(230, 230, 230) 1px solid;
}
.comment_name {
  margin-bottom: 5px;
  font-size: 14px;
  color: rgb(117, 117, 117);
}
.comment_time {
  margin-bottom: 5px;
  font-size: 10px;
  color: rgb(153, 153, 153);
}
.comment_text {
  margin-bottom: 10px;
  margin-right: 10px;
  font-size: 14px;
}
.round_icon {
  width: 70%;
  text-align: center;
  display: flex;
  margin: 0 auto;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.icon_span {
  font-size: 12px;
  color: rgb(153, 153, 153);
  margin-right: 20px;
}
.icon_img {
  width: 16px;
  height: 16px;
  margin-bottom: 3px;
  vertical-align: middle;
}
.dot_text {
  margin-left: 5px;
  vertical-align: middle;
}
</style>
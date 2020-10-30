<template>
  <div class="comment">
    <Comment :comments="comments"></Comment>
    <div class="bottom">
      <span>╮(╯3╰)╭再怎么找也没有啦</span>
    </div>
  </div>
</template>

<script>
import Comment from "./Comment";
export default {
  props: {
    mvId: "10883448",
  },
  data() {
    return {
      comments: [],
      total: 0,
      lastTime: "",
    };
  },
  components: { Comment },
  mounted() {
    this.getMvComment();
  },
  methods: {
    getMvComment() {
      this.axios
        .get("/comment/mv", {
          params: {
            id: "10883448",
            limit: 50,
            offset: 0,
            before: null,
          },
        })
        .then((res) => {
          let data = res.data;
          if (data.code == 200) {
            this.total = data.total;
            let commentsCopy = data.hotComments;
            let len = data.hotComments.length;
            for (let i = 0; i < len; i++) {
              let item = commentsCopy[i];
              let time = this.getTime(item.time);
              let comment = {
                head_img: item.user.avatarUrl,
                name: item.user.nickname,
                time: time,
                text: item.content,
                dot_size: item.likedCount,
              };
              this.comments.push(comment);
            }
          }
        })
        .catch(function (error) {});
    },
    getTime(dateTimeStamp) {
      let result = "";
      let minute = 1000 * 60;
      let hour = minute * 60;
      let day = hour * 24;
      let month = day * 30;
      let nowTime = new Date().getTime();
      let diffValue = nowTime - dateTimeStamp;
      if (diffValue < 0) {
        return;
      }
      let monthC = diffValue / month;
      let hourC = diffValue / hour;
      let minC = diffValue / minute;
      if (monthC > 12) {
        result = this.utils.dateFormat("Y年M月D日", new Date(dateTimeStamp));
      } else if (hourC > 24) {
        result = this.utils.dateFormat("M月D日", new Date(dateTimeStamp));
      } else if (hourC >= 1 && hourC <= 24) {
        result = "" + parseInt(hourC) + "小时前";
      } else if (minC >= 1) {
        result = "" + parseInt(minC) + "分钟前";
      } else {
        result = "刚刚";
      }
      return result;
    },
  },
};
</script>

<style>
.comment {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
}
.bottom {
  height: 30px;
  text-align: center;
  padding: 15px;
  margin-bottom: 50px;
}
</style>
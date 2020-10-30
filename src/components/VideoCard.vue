<template>
  <el-card style="font-size:8px;" :body-style="{ padding: '0px' }">
    <div class="pic" :style="{backgroundImage: 'url(' + mvData.cover + ')'}">
      <span class="left">
        <img class="mini-icon" src="./../assets/icon/playSize.svg" />
        <span class="views">{{getPlayCount(mvData.playCount)}}</span>
        <img class="mini-icon" src="./../assets/icon/text.svg" />
        <span class="discuss">{{getPlayCount(mvData.commentCount)}}</span>
      </span>
      <span class="right">{{millisecondToDate(mvData.duration)}}</span>
    </div>
    <div class="footer">
      <p class="title">{{mvData.name}}</p>
      <div class="tag">
        <p>{{mvData.artistName}}</p>
      </div>
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    mvData: {}
  },
  computed: {
    getPlayCount(count) {
      return function(count) {
        if (count < 10000) {
          return count + "";
        } else {
          return parseInt(count / 10000) + "万";
        }
      };
    },
    millisecondToDate(msd) {
      return function(msd) {
        let time = parseFloat(msd) / 1000;
        if (null != time && "" != time) {
          if (time > 60 && time < 60 * 60) {
            time =
              parseInt(time / 60.0) +
              ":" +
              parseInt((parseFloat(time / 60.0) - parseInt(time / 60.0)) * 60);
          } else if (time >= 60 * 60 && time < 60 * 60 * 24) {
            time =
              parseInt(time / 3600.0) +
              ":" +
              parseInt(
                (parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60
              ) +
              ":" +
              parseInt(
                (parseFloat(
                  (parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60
                ) -
                  parseInt(
                    (parseFloat(time / 3600.0) - parseInt(time / 3600.0)) * 60
                  )) *
                  60
              );
          } else {
            time = "0:"+parseInt(time);
          }
        }
        let index = String(time).lastIndexOf(":") + 1;
        let len = String(time).length - index;
        if (len == 1) {
          time = time + "0";
        }
        return time;
      };
    }
  },
  methods: {}
};
</script>

<style>
.footer {
  padding: 5px 10px 0px 10px;
}
.title {
  margin: 0;
  font-weight: 400;
  height: 30px;
  overflow: hidden;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  text-overflow: ellipsis;
  display: -webkit-box;
}
.tag p {
  color: #a8abbd;
  margin: 5px 0;
}

.left {
  position: absolute;
  left: 5px;
  color: #fff;
  bottom: 5px;
  margin-right: 20px;
}
.left .views {
  margin-right: 10px;
}
.right {
  position: absolute;
  right: 10px;
  bottom: 5px;
  margin-bottom: 1px;
  color: #fff;
}
.mini-icon {
  line-height: 12px;
  height: 12px;
  margin-right: 5px;
  margin-bottom: 3px;
  background-size: cover;
  background-repeat: no-repeat;
  vertical-align: middle;
}

.pic {
  position: relative;
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  height: 100px;
}
</style>
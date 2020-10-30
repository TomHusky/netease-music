<template>
  <div>
    <div
      id="header"
      @touchstart="volumeStart($event)"
      @touchmove="volumeMove($event)"
      @touchEnd="volumeEnd($event)"
      @dblclick="play($event)"
      @click="setShowContro()"
    >
      <video
        id="video"
        preload="Metadata"
        poster="http://p1.music.126.net/kQEqVIRhxHNaCZhOq2l3vA==/109951164293462891.jpg"
      >
        <source type="video/mp4" />
      </video>
      <div class="turn" id="turn"></div>

      <div id="contro" @click.stop="test" class="contro">
        <div id="play" class="play1" @click="play($event)"></div>
        <div id="progress" @click="jump($event)">
          <div id="progressBg"></div>
        </div>
        <div
          class="marker"
          @touchstart="touchstart($event)"
          @touchmove.prevent="touchmove($event)"
          @touchend="touchend($event)"
          id="dot"
        ></div>
        <span id="timing" class="timing">{{timing}}</span>
        <span id="timed" class="timed">/{{timed}}</span>
        <span id="fullScreen" class="fullScreen" @click="full"></span>
      </div>
    </div>
    <el-row id="bar" class="bar">
      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
        <span :class="{show_bottom: showBottom}" class="choice" @click="introduce">简介</span>
      </el-col>
      <el-col :xs="12" :sm="12" :md="12" :lg="12" :xl="12">
        <span :class="{show_bottom: !showBottom}" class="choice" @click="comments">评论</span>
      </el-col>
    </el-row>
    <div id="footer">
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showBottom: true, //显示bar选中的标题的下边框
      video: null,
      progressLen: 0,
      progress: null,
      progressBg: null,
      maxLen: 0, //进度条最大值
      minLen: 0,
      startX: 0, //控制音量
      startY: 0,
      isDown: false,
      dot: null,
      timing: "00:00",
      timed: "00:15",
      playDot: null,
      duration: 962000,
      header: null,
      dotLeft: 0, //控制进度小点的位置
      videoHeight: 0, //video放大之前高度
      headerHeight: 0, //放大之前的高度
      windowWidth: 0 //浏览器窗口原始宽度
    };
  },
  mounted() {
    this.initData(10883448);

    this.video = document.getElementById("video");
    this.header = document.getElementById("header");
    let footer = document.getElementById("footer");
    let bar = document.getElementById("bar");
    //获取header初始高度
    this.headerHeight = header.offsetHeight;
    //获取video初始高度
    this.videoHeight = video.offsetHeight;
    this.windowWidth = window.screen.width;
    let addHeight = this.headerHeight + bar.offsetHeight;
 
    footer.style.height = window.screen.height - addHeight + "px";

    this.settingContro();

    //使用事件监听方式捕捉事件， 播放时间改变
    this.video.addEventListener(
      "timeupdate",
      () => {
        //用秒数来显示当前播放进度
        let timeDisplay = this.video.currentTime * 1000;
        if (timeDisplay != 0) {
          this.timing = this.millisecondToDate(timeDisplay);
          this.progressBg.style.width =
            (timeDisplay / this.duration) * 100 + "%";
          this.dotLeft =
            this.progress.offsetLeft + this.progressBg.offsetWidth - 11;
          this.dot.style.left = this.dotLeft + "px";
        }
      },
      false
    );
    this.video.addEventListener(
      "playing",
      () => {
        this.playDot.className = "play2";
      },
      false
    );
    this.video.addEventListener(
      "canplay",
      () => {
        let turn = document.getElementById("turn");
        turn.style.display = "none";
      },
      false
    );
    this.video.addEventListener(
      "waiting",
      () => {
        this.playDot.className = "play1";
        let turn = document.getElementById("turn");
        turn.style.display = "block";
      },
      false
    );

    this.video.addEventListener(
      "progress", //客户端正在请求数据
      () => {
        if (this.video.buffered != null) {
          console.log(
            this.video.buffered.start(this.video.buffered.length - 1)
          );
          console.log(this.video.buffered.end(this.video.buffered.length - 1));
        }
      },
      false
    );

    //监听播放结束
    this.video.addEventListener("ended", () => {
      this.playDot.className = "play1";
    });

    //监控浏览器全屏事件
    window.onresize = () => {
      if (!this.isFullScreen()) {
        document.body.parentNode.style.overflowY = "auto";
      } else {
        document.body.parentNode.style.overflowY = "hidden";
      }
      //刷新控制面板布局
      this.settingContro();
    };
    this.timed = this.millisecondToDate(this.duration);
  },
  computed: {},
  methods: {
    initData(key) {
      this.axios
        .get("/mv/url", {
          params: {
            id: key
          }
        })
        .then(res => {
          if (res.data.code == 200) {
            this.video.src = res.data.data.url;
          }
        })
        .catch(function(error) {});
    },
    addScroll() {
      $("#div").on("mousewheel", function() {
        //我这没有做兼容firefox，你可以看下mousewheel
        var _self = $(this),
          delta = event.wheelDelta
            ? event.wheelDelta / 120
            : -(event.detail || 0) / 3;
        if (delta > 0 && _self.scrollTop() === 0) {
          //滑动到顶部，再往上滑就
          e.preventDefault();
          //滑动到底部，再往下滑就阻止默认行为
        } else if (
          delta < 0 &&
          _self.scrollTop() == _self.get(0).scrollHeight - _self.height()
        ) {
          e.preventDefault();
        }
      });
    },
    settingContro() {
      this.progress = document.getElementById("progress");

      //全屏位置动态设置
      let fullScreen = document.getElementById("fullScreen");
      fullScreen.style.marginTop = -fullScreen.offsetHeight / 2 + "px";

      //时间进度位置动态获取
      let timing = document.getElementById("timing");
      let timed = document.getElementById("timed");

      timed.style.marginLeft =
        fullScreen.offsetLeft - timed.offsetWidth - 10 + "px";
      timing.style.marginLeft = timed.offsetLeft - timing.offsetWidth + "px";

      timing.style.marginTop = -timing.offsetHeight / 2 + "px";
      timed.style.marginTop = -timed.offsetHeight / 2 + "px";

      //进度条背景,
      this.progressBg = document.getElementById("progressBg");
      this.playDot = document.getElementById("play");
      let contro = document.getElementById("contro");

      // 62= (40-18)+10+20 + 15(进度条右边距离)
      this.progress.style.width =
        100 -
        ((this.playDot.offsetWidth +
          timing.offsetWidth +
          timed.offsetWidth +
          fullScreen.offsetWidth +
          57) /
          contro.offsetWidth) *
          100 +
        "%";
      let height = progress.offsetHeight;
      this.progress.style.marginTop = -(height / 2) + "px";

      this.minLen = this.progress.offsetLeft;
      this.maxLen = this.progress.offsetWidth + this.minLen;

      this.dot = document.getElementById("dot");

      this.dotLeft = this.minLen - 11;
      this.dot.style.left = this.dotLeft + "px";
      this.dot.style.marginTop = (34 - 22 - 4) / 2 + "px";
    },
    millisecondToDate(msd) {
      let time = parseFloat(msd) / 1000;
      if (null != time && "" != time) {
        if (time > 60 && time < 60 * 10) {
          time =
            "0" +
            parseInt(time / 60.0) +
            ":" +
            parseInt((parseFloat(time / 60.0) - parseInt(time / 60.0)) * 60);
        } else if (time >= 60 * 10 && time < 60 * 60) {
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
          time = "00:" + parseInt(time);
        }
      }
      let index = String(time).lastIndexOf(":") + 1;
      let len = String(time).length - index;
      if (len == 1) {
        time = this.insertStr(time, index, "0");
      }
      return time;
    },
    insertStr(soure, start, newStr) {
      return soure.slice(0, start) + newStr + soure.slice(start);
    },
    test() {
      //空方法阻止在控制面板中点击了父元素
    },
    play(event) {
      if (this.video.paused == true) {
        this.playDot.className = "play2";
        this.video.play();
      } else {
        this.playDot.className = "play1";
        this.video.pause();
      }
    },
    volumeStart(event) {
      this.startX = event.changedTouches[0].pageX;
      this.startY = event.changedTouches[0].pageY;
    },
    volumeEnd(event) {
      this.startX = event.changedTouches[0].pageX;
      this.startY = event.changedTouches[0].pageY;
    },
    volumeMove(event) {
      let moveEndX = event.changedTouches[0].pageX;
      let moveEndY = event.changedTouches[0].pageY;
      let X = moveEndX - this.startX;
      let Y = moveEndY - this.startY;
      if (this.isFullScreen() && this.startX > window.screen.width / 2) {
        if (Math.abs(X) > Math.abs(Y) && X > 0) {
          //"left 2 right"
        } else if (Math.abs(X) > Math.abs(Y) && X < 0) {
          // alert("right 2 left");
        } else if (Math.abs(Y) > Math.abs(X) && Y > 0) {
          // alert("top 2 bottom");
          if (this.video.volume != 0) {
            this.video.volume -= 0.1;
          }
        } else if (Math.abs(Y) > Math.abs(X) && Y < 0) {
          if (this.video.volume != 1) {
            this.video.volume += 0.1;
          }
        }
        console.log(this.video.volume);
      }
    },
    setShowContro() {
      let contro = document.getElementById("contro");
      if (contro.style.zIndex == "-1") {
        contro.style.zIndex = "99999";
      } else {
        contro.style.zIndex = "-1";
      }
    },
    jump(event) {
      let nl = event.pageX;
      this.dot.style.left = nl - 22 + "px";
      this.progressBg.style.width =
        ((nl - 30 - 11) / this.progress.offsetWidth) * 100 + "%";
      let jumpIndex = nl - 40;
      let width = this.progress.offsetWidth;
      this.video.currentTime = (this.duration * jumpIndex) / (width * 1000);
    },
    full() {
      if (this.isFullScreen()) {
        this.header.style.height = this.headerHeight + "px";
        this.video.style.height = this.videoHeight + "px";
        this.exitFullscreen();
      } else {
        this.video.style.height = this.windowWidth + "px";
        this.header.style.height = this.windowWidth + "px";
        this.fullScreen();
      }
    },
    //是否全屏
    isFullScreen() {
      if (
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      ) {
        return true;
      } else {
        return false;
      }
    },
    //进入全屏
    fullScreen() {
      let ele = document.documentElement;
      if (ele.requestFullscreen) {
        ele.requestFullscreen();
      } else if (ele.mozRequestFullScreen) {
        ele.mozRequestFullScreen();
      } else if (ele.webkitRequestFullScreen) {
        ele.webkitRequestFullScreen();
      } else if (ele.msRequestFullscreen) {
        ele.msRequestFullscreen();
      }
    },
    //退出全屏
    exitFullscreen() {
      let de = document;
      if (de.exitFullscreen) {
        de.exitFullscreen();
      } else if (de.mozCancelFullScreen) {
        de.mozCancelFullScreen();
      } else if (de.webkitCancelFullScreen) {
        de.webkitCancelFullScreen();
      }
    },
    getAbsoluteLeft(obj) {
      let oLeft = obj.offsetLeft;
      while (obj.offsetParent != null) {
        let oParent = obj.offsetParent;
        oLeft += oParent.offsetLeft;
        obj = oParent;
      }
      return oLeft;
    },
    getAbsoluteTop(obj) {
      let oTop = obj.offsetTop;
      while (obj.offsetParent != null) {
        let oParent = obj.offsetParent;
        oTop += oParent.offsetTop;
        obj = oParent;
      }
      return oTop;
    },
    getElementWidth(obj) {
      return obj.offsetWidth;
    },
    touchstart(event) {
      //获取x坐标
      this.x = event.changedTouches[0].pageX;
      this.l = this.dot.offsetLeft;
      //开关打开
      this.isDown = true;
    },
    touchmove(event) {
      if (this.isDown == false) {
        return;
      }
      //获取x
      let nx = event.changedTouches[0].pageX;
      if (nx > this.maxLen + 10 || nx < this.minLen + 10) {
        return;
      }
      this.dot.style.left = nx - 22 + "px";
      this.progressBg.style.width =
        ((nx - 30 - 11) / this.progress.offsetWidth) * 100 + "%";

      let moveIndex = nx - 40;
      let width = this.progress.offsetWidth;
      let timeDisplay = (this.duration * moveIndex) / (width * 1000);
      this.timing = this.millisecondToDate(timeDisplay);
      this.video.currentTime = timeDisplay;
    },
    touchend(e) {
      //开关关闭
      this.isDown = false;
      this.playDot.className = "play2";
      this.video.play();
    },
    introduce() {
      this.showBottom = true;
      this.$router.replace("/videoTitle");
    },
    comments() {
      this.showBottom = false;
      this.$router.replace("/videoText");
    }
  }
};
</script>

<style scoped>
.main {
  width: 100%;
  margin: 0;
  left: 0;
}
#header {
  position: relative;
  background-color: black;
  padding: 0;
  margin: 0;
}
#video {
  position: relative;
  margin: 0 auto;
  display: block;
  width: 100%;
}
#footer{
  height: 100%;
}

.turn {
  position: absolute;
  height: 30px;
  width: 30px;
  left: 50%;
  top: 50%;
  margin-top: -15px;
  margin-left: -15px;
  background-image: url("./../assets/icon/loading.png");
  background-size: cover;
  background-repeat: no-repeat;
  animation: turn 1.5s linear infinite;
}
/* 
  turn : 定义的动画名称
  1s : 动画时间
  linear : 动画以何种运行轨迹完成一个周期
  infinite :规定动画应该无限次播放
  */
@keyframes turn {
  0% {
    -webkit-transform: rotate(0deg);
  }
  25% {
    -webkit-transform: rotate(90deg);
  }
  50% {
    -webkit-transform: rotate(180deg);
  }
  75% {
    -webkit-transform: rotate(270deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
  }
}
.contro {
  position: absolute;
  height: 34px;
  width: 100%;
  right: 10px;
  left: 10px;
  bottom: 2px;
  z-index: 99999;
}
.play1 {
  position: absolute;
  width: 18px;
  height: 18px;
  top: 50%;
  margin-top: -10px;
  background-image: url("./../assets/icon/play.svg");
  background-size: cover;
  background-repeat: no-repeat;
}
.play2 {
  position: absolute;
  width: 18px;
  height: 18px;
  top: 50%;
  margin-top: -9px;
  background-image: url("./../assets/icon/stop.svg");
  background-size: cover;
  background-repeat: no-repeat;
}
#progress {
  position: absolute;
  height: 2px;
  background-color: white;
  padding: 0;
  border-radius: 5px;
  margin-left: 30px;
  top: 50%;
  width: 50%;
  overflow: hidden;
}

#progressBg {
  background-color: lightcoral;
  padding: 0;
  margin: 0;
  height: 100%;
  border-radius: 5px;
  width: 0%;
  pointer-events: none;
}

.marker {
  position: absolute;
  width: 22px;
  height: 22px;
  background-image: url("./../assets/icon/bilibili.png");
  background-size: cover;
  background-repeat: no-repeat;
}

.timing {
  font-weight: 800;
  font-size: 10px;
  color: aliceblue;
  position: absolute;
  top: 50%;
  margin-top: -9px;
}
.timed {
  font-weight: 800;
  font-size: 10px;
  color: aliceblue;
  position: absolute;
  top: 50%;
  margin-top: -9px;
}
.fullScreen {
  position: absolute;
  top: 50%;
  width: 22px;
  height: 22px;
  right: 20px;
  background-image: url("./../assets/icon/full.svg");
  background-size: cover;
  background-repeat: no-repeat;
}

.bar {
  width: 100%;
  height: 40px;
  background-color: rgb(254, 254, 254);
  -moz-box-shadow: 1px 1px 5px rgb(230, 230, 230);
  box-shadow: 1px 1px 5px rgb(230, 230, 230);
  text-align: center;
}

.bar .choice {
  line-height: 40px;
  padding: 10px;
  font-size: 14px;
}

.show_bottom {
  border-bottom: 2px solid rgb(249, 113, 151);
}

video::-webkit-media-controls,
video::-moz-media-controls,
video::-o-media-controls,
video::media-controls {
  display: none !important;
}
video::-webkit-media-controls {
  display: none !important;
}
</style>
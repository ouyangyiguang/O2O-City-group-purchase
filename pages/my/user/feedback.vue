<template>
  <qs-page>
    <!-- 公共组件-每个页面必须引入 -->
    <public-module></public-module>
    <!--isFullScreen 可以实其全屏显示-->
    <ourLoading
      isFullScreen
      :active="loadstatus"
      :text="loadstxt"
      color="#63E5CB"
      textColor="#63E5CB"
    />
    <u-tabs
      :list="tabslist"
      :is-scroll="false"
      :current="tabscurrent"
      @change="change"
    ></u-tabs>
    <view class="account-form-box">
      <u-form :model="model" ref="uForm" :errorType="form.errorType">
        <u-form-item
          class="form-item"
          label="反馈类型"
          prop="payType"
          :label-position="form.labelPosition"
        >
          <u-radio-group v-model="radio" @change="radioGroupChange">
            <u-radio
              shape="circle"
              v-for="(item, index) in radioList"
              :key="index"
              :name="item.name"
              >{{ item.name }}</u-radio
            >
          </u-radio-group>
        </u-form-item>
        <u-form-item
          class="form-item"
          label="反馈内容"
          prop="menotext"
          :label-position="form.labelPosition"
        >
          <u-input
            v-model="model.menotext"
            placeholder="请输入反馈详细"
            type="textarea"
            style="border: solid 1px #dddddd; padding: 10rpx"
          />
        </u-form-item>
        <u-form-item
          class="form-item"
          label="问题截图"
          :label-position="form.labelPosition"
          :border-bottom="false"
        >
          <u-upload></u-upload>
        </u-form-item>
      </u-form>

      <u-gap height="40"></u-gap>

      <u-button type="primary" @click="submit">确认设置</u-button>
    </view>

    <u-gap height="40"></u-gap>
  </qs-page>
</template>

<script>
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      loadstatus: false,
      loadstxt: "loadstxt",
      title: "修改",
      desc: "修改用户信息",
      form: {
        errorType: ["message"],
        labelPosition: "top",
      },

      tabslist: [
        {
          name: "我要反馈",
        },
        {
          name: "已发反馈",
        },
        {
          name: "已回反馈",
          count: 1,
        },
      ],
      tabscurrent: 0,
      model: {
        /* 用户名 */
        menotext: "",
        payType: "",
      },
      radioList: [
        {
          name: "注册",
          checked: false,
          disabled: false,
        },
        {
          name: "申诉",
          checked: false,
          disabled: false,
        },
        {
          name: "奖项",
          checked: false,
          disabled: false,
        },
        {
          name: "其他",
          checked: false,
          disabled: false,
        },
      ],
      radio: "",
      rules: {
        payType: [
          {
            required: true,
            message: "请选择反馈问题类型",
            trigger: "change",
          },
        ],
        menotext: [
          {
            required: true,
            message: "请填写内容",
            trigger: ["change", "blur"],
          },
          {
            min: 10,
            max: 1000,
            message: "内容太短",
            trigger: ["change", "blur"],
          },
        ],
      },
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  onLoad() {},
  methods: {
    radioGroupChange(e) {
      this.model.payType = e;
    },
    submit() {
      this.$refs.uForm.validate((valid) => {
        if (valid) {
          this.loadstatus = true;
          this.loadstxt = "数据更新中";
          return new Promise((resolve, reject) => {
            this.$api("user.feedbackadd", {
              attr_26: this.model.menotext,
            })
              .then((res) => {
                if (res.code == 200) {
                  //this.$store.commit('USER_INFO',res.data);
                  this.$store.dispatch("getUserInfo");
                  uni.navigateBack(1);
                  //this.$tools.routerTo('/pages/my/user/user')
                }
                this.loadstatus = false;
              })
              .catch((e) => {
                this.loadstatus = false;
                resolve(false);
              });
          });
        } else {
          console.log("验证失败");
        }
      });
    },
  },
  onReady() {
    this.$refs.uForm.setRules(this.rules);
  },
};
</script>

<style lang="scss" scoped>
.account-form-box {
  padding: 0 32rpx;
}
</style>

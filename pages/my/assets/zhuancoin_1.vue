<template>
  <account-page :title="title" :desc="desc">
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
    <view class="account-form-box">
      <u-form ref="uForm" :errorType="form.errorType">
        <coinselect
          @eventChange="coinChange"
          :forminfo="form"
          :default_id="default_id"
        ></coinselect>
        <u-form-item
          class="form-item"
          label="可用余额"
          :label-position="form.labelPosition"
          :label-width="form.labelwidth"
        >
          <u-input
            placeholder=""
            type="text"
            :value="coin_info.balance_available + ' ' + coin_info.unit"
            :disabled="true"
          />
        </u-form-item>
        <u-form-item
          class="form-item"
          label="手续费"
          :label-position="form.labelPosition"
          :label-width="form.labelwidth"
        >
          <u-input
            placeholder=""
            type="text"
            :value="coin_info.shouxufei_zhuanzhang"
            :disabled="true"
          />
        </u-form-item>
        <u-form-item
          class="form-item"
          label="对方帐户"
          prop="obj_users_name"
          :label-position="form.labelPosition"
          :label-width="form.labelwidth"
        >
          <u-input
            v-model="obj_users_name"
            placeholder="请输入对方帐号/手机"
            type="text"
          />
          <u-button
            slot="right"
            :type="usertipsinfo"
            size="mini"
            @click="finduser"
            >{{ userTips }}</u-button
          >
        </u-form-item>
        <u-form-item
          class="form-item"
          :label="this.$t('assets.depositnum')"
          prop="nums"
          :label-position="form.labelPosition"
          :label-width="form.labelwidth"
        >
          <u-input
            v-model="nums"
            :placeholder="
              $t('usercenter.pls_required') + $t('assets.depositnum')
            "
            type="text"
          />
        </u-form-item>
        <u-form-item
          class="form-item"
          label="附言"
          :label-position="form.labelPosition"
          :label-width="form.labelwidth"
        >
          <u-input v-model="remark" placeholder="" type="text" />
        </u-form-item>
      </u-form>

      <u-gap height="40"></u-gap>

      <u-button type="primary" @click="submit">确认转帐</u-button>
    </view>

    <u-gap height="40"></u-gap>
  </account-page>
</template>

<script>
import coinselect from "@/components/coinselect.vue";
import { mapState, mapMutations } from "vuex";
export default {
  components: {
    coinselect,
  },
  data() {
    return {
      loadstatus: false,
      loadstxt: "loadstxt",
      title: "转帐",
      desc: "填写对方正确信息已确保正常输入",
      userTips: "检查用户",
      default_id: "3",
      usertipsinfo: "info",
      obj_users_id: "",
      remark: "",
      form: {
        errorType: ["message"],
        labelPosition: "left",
        labelwidth: "150",
      },
      coin_info: {
        balance_available: "",
        unit: "",
      },
      input: {},
      obj_users_name: "",
      nums: "",
      rules: {
        nums: [
          {
            // 自定义验证函数，见上说明
            validator: (rule, value, callback) => {
              if (this.nums == "") {
                callback(new Error("请输入数量"));
              } else {
                if (this.nums < this.coin_info.balance_available) {
                  callback();
                } else {
                  callback(new Error("可用余额不足"));
                }
              }
            },
            // 触发器可以同时用blur和change
            trigger: ["change", "blur"],
          },
        ],
        obj_users_name: [
          // 校验用户是否已存在
          {
            asyncValidator: (rule, value, callback) => {
              this.$api("user.ckuser", {
                ckusername: this.obj_users_name,
              }).then((res) => {
                // 如果验证不通过，需要在callback()抛出new Error('错误提示信息')
                if (res.data.is_zai == 0) {
                  callback(new Error("用户不存在"));
                } else {
                  // 如果校验通过，也要执行callback()回调
                  callback();
                }
              });
            },
            // 如果是异步校验，无需写message属性，错误的信息通过Error抛出即可
            // message: 'xxx'
          },
        ],
      },
    };
  },
  computed: {
    ...mapState(["user"]),
  },
  onLoad(option) {
    if (option.query) {
      let query = JSON.parse(option.query);
      this.default_id = query.selectcoinid;
    }
  },
  methods: {
    finduser() {
      this.$api("user.ckuser", {
        ckusername: this.obj_users_name,
      })
        .then((res) => {
          if (res.data.is_zai == 0) {
            this.userTips = "用户不存在";
            this.usertipsinfo = "error";
          } else {
            this.userTips = "用户存在";
            this.usertipsinfo = "success";
          }
        })
        .catch((e) => {});
    },
    coinChange(data) {
      this.coinclass = data.value;
      this.$api("assets.coin_detail", {
        coinclass: data.value,
      })
        .then((res) => {
          console.log(res.data);
          if (res.code == 200) {
            this.coin_info = res.data;
          }
        })
        .catch((e) => {});
    },
    submit() {
      this.$refs.uForm.validate((valid) => {
        if (valid) {
          this.loadstatus = true;
          this.loadstxt = "转帐中";
          return new Promise((resolve, reject) => {
            this.$api("assets.zhuan_zhang", {
              coinclass: this.coinclass,
              obj_users_name: this.obj_users_name,
              nums: this.nums,
              remark: this.remark,
            })
              .then((res) => {
                this.loadstatus = false;
                console.log("edit", res);
                if (res.code == 200) {
                  this.$router.push({
                    path: "/pages/my/success",
                    query: {
                      title: "转帐成功",
                      msg: res.msg,
                    },
                  });
                } else {
                  this.$tools.msg(res.msg);
                }
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

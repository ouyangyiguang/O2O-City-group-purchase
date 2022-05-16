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
          :exclude_id="1"
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
          label="钱包类型"
          :label-position="form.labelPosition"
          :label-width="form.labelwidth"
        >
          <u-radio-group v-model="radiovalue" @change="radioGroupChange">
            <u-radio
              v-for="(item, index) in coin_info.wallet"
              :key="index"
              :name="item.type"
            >
              {{ item.type }}
            </u-radio>
          </u-radio-group>
        </u-form-item>
        <u-form-item
          class="form-item"
          label="系统手续费"
          :label-position="form.labelPosition"
          :label-width="form.labelwidth"
        >
          <u-input
            placeholder=""
            :value="coin_info.tibi_sys_shouxufei * 10 + '%'"
            :disabled="true"
            type="text"
          />
          <text slot="right" style="font-size: 22rpx">{{
            coin_info.tibi_msg
          }}</text>
        </u-form-item>
        <u-form-item
          class="form-item"
          label="转帐手续费"
          :label-position="form.labelPosition"
          :label-width="form.labelwidth"
        >
          <u-input
            placeholder=""
            :value="tibi_shouxufei + coin_info.unit"
            :disabled="true"
            type="text"
          />
          <text slot="right" style="font-size: 22rpx">转帐手续费</text>
        </u-form-item>
        <u-form-item
          class="form-item"
          label="提币数额"
          prop="nums"
          :label-position="form.labelPosition"
          :label-width="form.labelwidth"
        >
          <u-input
            v-model="nums"
            :placeholder="
              $t('usercenter.pls_required') + $t('assets.withdrawalnum')
            "
            type="text"
            @input="jsrealnums()"
          />
        </u-form-item>
        <u-form-item
          class="form-item"
          label="钱包地址"
          :label-position="form.labelPosition"
          :label-width="form.labelwidth"
        >
          <u-input
            v-model="walletaddress"
            :placeholder="
              $t('usercenter.pls_required') +
              radiovalue +
              $t('assets.walletaddress')
            "
            type="text"
          />
        </u-form-item>
        <u-form-item
          class="form-item"
          label="实际到帐"
          :label-position="form.labelPosition"
          :label-width="form.labelwidth"
        >
          <u-input
            v-model="realnums"
            placeholder=""
            type="text"
            :disabled="true"
          />
        </u-form-item>
      </u-form>

      <u-gap height="40"></u-gap>

      <u-button type="primary" @click="submit">确认</u-button>
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
      title: "提币",
      desc: "提币申请后24小时内审核",
      default_id: "",
      form: {
        errorType: ["message"],
        labelPosition: "left",
        labelwidth: "170",
      },
      coin_info: {
        balance_available: "",
        unit: "",
        tibi_shouxufei: "",
        wallet: [],
      },
      tibi_shouxufei: "",
      coinclass: "",
      nums: "",
      realnums: "0",
      walletaddress: "",
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
        walletaddress: [
          {
            required: true,
            message: "请填写钱包地址",
            trigger: ["change", "blur"],
          },
        ],
      },
      radiovalue: "",
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
    jsrealnums() {
      if (this.nums > this.coin_info.balance_available) {
        this.realnums = 0;
      } else {
        this.realnums = (
          this.nums -
          this.tibi_shouxufei -
          this.nums * this.coin_info.tibi_sys_shouxufei
        ).toFixed(4);
      }
    },
    radioGroupChange(e) {
      console.log(e);
      this.radiovalue = e;
      for (let i = 0; i < this.coin_info.wallet.length; i++) {
        if (this.coin_info.wallet[i].type == e) {
          this.tibi_shouxufei = this.coin_info.wallet[i].tibi_shouxufei;
        }
      }
    },
    coinChange(data) {
      this.coinclass = data.value;
      this.$api("assets.coin_detail", {
        coinclass: data.value,
      })
        .then((res) => {
          if (res.code == 200) {
            this.coin_info = res.data;
            this.tibi_shouxufei = res.data.wallet[0].tibi_shouxufei;
            this.radiovalue = res.data.wallet[0].type;
          }
        })
        .catch((e) => {});
    },
    submit() {
      this.$refs.uForm.validate((valid) => {
        if (valid) {
          this.loadstatus = true;
          this.loadstxt = "数据更新中";
          return new Promise((resolve, reject) => {
            this.$api("assets.ti_bi", {
              coinclass: this.coinclass,
              wallettype: this.radiovalue,
              nums: this.nums,
              walletaddress: this.walletaddress,
            })
              .then((res) => {
                this.loadstatus = false;
                console.log("edit", res);
                if (res.code == 200) {
                  this.$router.push({
                    path: "/pages/my/success",
                    query: {
                      title: "提币成功",
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

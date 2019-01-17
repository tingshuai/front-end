<template>
  <el-dialog title="发起压图确认单"  :visible.sync="dialogVisible" :close-on-click-modal="false" :append-to-body="true" width="440px" class="send-pressure-image">
    <div slot="title">
      发起压图确认单
    </div>
    <press-image-body @totalAll="setTotalAll" ref="pressImageBody"></press-image-body>
      <el-form ref="ruleForm" :model="formData" :rules="rules" label-width="100px">
        <el-form-item label="客户签收人" prop="signer">
         <el-select v-model="formData.signer" filterable placeholder="请选择">
            <el-option v-for="item in getGroupData.groupUsers" v-if="item.openId !== getfromUser.fromUserId" :key="item.openId"
              :label="item.username" :value="item.username+','+item.openId">
            </el-option>
         </el-select>
        </el-form-item>
      </el-form>
    <div slot="footer" class="dialog-footer">
      <div>价格汇总(元): <span>{{totalAll}}</span></div>
      <button class="dialog-bule" :disabled="totalAll===0" :class="{'dialog-disabled':totalAll===0}" @click="save">提交</button>
    </div>
  </el-dialog>
</template>
<script>
  import {
    diagramAdd
  } from '../../api/index.js'
  import {
    mapGetters,
    mapMutations
  } from 'vuex'
  import pressImageBody from './pressImageBody.vue'
  export default {
    data() {
      return {
        dialogVisible: false,
        totalAll:0,
        formData:{signer:''},
        rules:{
          signer:[{required: true, message: '请选择签收人', trigger: ['blur','change']}]
        }
      }
    },
    computed: {
      ...mapGetters(['getfromUser', 'getGroupData'])
    },
    methods: {
      close() {
        this.dialogVisible = false;
      },
      show() {
        this.dialogVisible = true;
        setTimeout(()=>{
             this.$refs.pressImageBody.reset();
             this.$refs.ruleForm.resetFields();
             this.totalAll = 0;
        },0)
      },
      save() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            let signer = this.formData.signer.split(',');
            let pressImage = this.$refs.pressImageBody;
                diagramAdd({Vue:this,params:{
                  diagramText:JSON.stringify({dataList:pressImage.dataList,totalAll:this.totalAll}),
                  groupId:this.getGroupData.groupId,//群组ID
                  groupName:this.getGroupData.groupName,//群名称
                  creatorOpenId:this.getfromUser.fromUserId,//发起人OpenID
                  creatorName:this.getfromUser.fromUserName,//发起人名称
                  signerOpenId:signer[1],//签收人ID
                  signerName:signer[0],//签收人名称
                  headImgUrl:this.getfromUser.fromUserImg,//发起人头像
                  position:this.getfromUser.fromUserPosition//发起人职位
              }}).then(data=>{
                  this.$message({
                    message: data.message,
                    type: 'success'
                  });
              })
              this.close();
          } else {
            console.log('error submit!!');
            return false;
          }
        });

      },
      setTotalAll(all){
         this.totalAll = all;    
         }
    },
    components:{
        pressImageBody
    }
  }

</script>
<style lang="less">
  .send-pressure-image {

    .dialog-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 14px;
      color: #8B969C;

      span {
        color: #FF891E;
        font-size: 18px;
      }
    }
    .el-dialog__footer{
        box-shadow: 0 -1px 4px 0 rgba(53,53,53,0.08);
    }
  }

</style>

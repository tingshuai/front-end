<template>
  <el-dialog title="发起压图确认单"  :visible.sync="dialogVisible" :close-on-click-modal="false" :append-to-body="true" width="440px" class="pressure-image-edit">
    <div slot="title">
      发起压图确认单
      <span class="states">待签收</span>
    </div>
    <press-image-body @totalAll="setTotalAll" ref="pressImageBody"></press-image-body>
      <el-form ref="ruleForm" :model="formData" :rules="rules" label-width="100px" v-if="getGroupData">
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
      <button class="dialog-bule" :disabled="totalAll===0" :class="{'dialog-disabled':totalAll===0}" @click="save">确认修改</button>
    </div>
  </el-dialog>
</template>
<script>
  import {
    diagramEdit
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
          signer:[{required: true, message: '请选择签收人', trigger: 'blur'}]
        },
        currMsg:{}
      }
    },
    computed: {
      ...mapGetters(['getfromUser', 'getGroupData'])
    },
    methods: {
      close() {
        this.dialogVisible = false;
      },
      show(data) {
       this.dialogVisible = true;
       let diagramText = JSON.parse(data.content.diagramText);
       this.currMsg = data;
       this.formData.signer = data.content.toUserName +','+ data.content.toUser;
       this.totalAll = diagramText.totalAll;
        setTimeout(()=>{
          debugger
           console.log(this.$refs.dialog);
             this.$refs.pressImageBody.reset(diagramText.dataList);
        },0)
      },
      save() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            let signer = this.formData.signer.split(',');
            let pressImage = this.$refs.pressImageBody;
                diagramEdit({Vue:this,params:{
                  diagramId:this.currMsg.content.diagramId,
                  msgId:this.currMsg.msgId,
                  diagramText:JSON.stringify({dataList:pressImage.dataList,totalAll:this.totalAll}),
                  groupId:this.getGroupData.groupId,//群组ID
                  groupName:this.getGroupData.groupName,//群名称
                  fromUser:this.getfromUser.fromUserId,//发起人OpenID
                  fromUserName:this.getfromUser.fromUserName,//发起人名称
                  signerOpenId:signer[1],//签收人ID
                  signerName:signer[0],//签收人名称
                  headImgUrl:this.getfromUser.fromUserImg,//发起人头像
                  position:this.getfromUser.fromUserPosition//发起人职位
              }}).then(data=>{
                  this.$message({
                    message: data.message,
                    type: 'success'
                  });
                  this.$emit('pressEditClose');
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
  .pressure-image-edit {

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
    .states{
        color: #267AFC;
        font-size: 14px;
    }
  }

</style>

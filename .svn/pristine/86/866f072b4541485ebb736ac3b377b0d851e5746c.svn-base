<template>
  <div class="gm-toast-body">
    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
      <el-row>
        <el-col :span="24" v-if="types==='edit'">
          <el-form-item label="群组名称：">
            {{ruleForm.groupName}}
          </el-form-item>
        </el-col>
        <el-col :span="24" v-if="types==='add'">
          <el-form-item label="群组名称：" prop="groupName">
            <el-input type="text" v-model.trim="ruleForm.groupName" maxlength="20"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24" v-else>
          <el-form-item label="修改名称：" prop="eGroupName">
            <el-input type="text" v-model.trim="ruleForm.eGroupName" maxlength="20"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="父群组指定：" prop="parentId">
            <el-select v-model="ruleForm.parentId" filterable clearable placeholder="请选择" @change="parentChange" :disabled="types==='edit'">
              <el-option v-for="item in parentIdData" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="群组成员：" prop="openIds">
            <el-button type="primary" size="small" @click="eidtUser">编辑</el-button>
            <span class="user-number">{{ruleForm.openIds.length}}人</span>
            <!-- <el-select v-model="ruleForm.openIds" multiple filterable  collapse-tags  placeholder="请选择">
              <el-option v-for="item in openIdsData" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select> -->
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="群主指定：" prop="managerId">
            <el-select v-model="ruleForm.managerId" filterable placeholder="请选择" :disabled="true">
              <el-option v-for="item in managerIdData" :key="item.openId" :label="item.username" :value="item.openId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="24">
          <el-form-item label="解散时间：" prop="deadline">
            <el-date-picker v-model="ruleForm.deadline" :disabled="ruleForm.parentId!=''" type="datetime" placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss">
            </el-date-picker>
          </el-form-item>
        </el-col> -->
        <el-col :span="24">
          <el-form-item label="群组描述：" prop="groupDesc">
            <el-input type="textarea" :rows="3" :maxlength="300" placeholder="请输入群组描述" v-model.trim="ruleForm.groupDesc" resize="none">
            </el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <!-- 编辑群成员 -->
    <chat-toast :config="addUserToast" @save="pullUserSave" >
             <add-user 
                  ref="addUser" 
                  :ruleForm="ruleForm"
                  :openIdsData="openIdsData"
                  :type="types"></add-user>
    </chat-toast>
  </div>
</template>
<script>
  import {
    getGroupsSelector,
    checkGroupName,
    getUsersSelector
  } from '../../api/index.js'
  import addUser from './addUser.vue';
  import {mapGetters} from 'vuex';
  export default {
    computed: {
      ...mapGetters(['getfromUser'])
    },
    data() {
      // const deadline = (rule, value, callback) => {
      //   if (value === '') {
      //     return callback(new Error('群解散时间必须大于一天'));
      //   }
      //   let today = new Date().getTime();
      //   let currDay = new Date(value).getTime();
      //   let time = currDay - today;

      //   if (time < 24 * 60 * 60 * 1000) {
      //     callback(new Error('群解散时间必须大于一天'));
      //   } else {
      //     callback();
      //   }
      // };
      const groupName = (rule, value, callback) => {
        if (!value || value.trim().length === 0) {
          return callback(new Error('请输入群名'));
        }
        checkGroupName({
          params: {
            groupName: value
          }
        }).then(data => {
          callback();
        }, err => {
          callback(new Error('该群名已被使用'));
        })
      };
      const eGroupName = (rule, value, callback) => {
        if (!value || value.trim().length === 0) {
          return callback();
        }
        checkGroupName({
          params: {
            groupName: value
          }
        }).then(data => {
          callback();
        }, err => {
          callback(new Error('该群名已被使用'));
        })
      };
      const openIds = (rule, value, callback) => {
          if(value.length>=3){
            callback();
          }else{
            callback(new Error('群成员必须大于等于三个'));
          }
      };
      return {
        addUserToast: {
          title:'编辑群成员',//弹窗标题
          dialogVisible:false,//弹窗显示
          width:'900px',//弹窗宽
          btnData:[{
            name:'保存',
            method:'save',
            bgColor:'dialog-bule'
          }]
      },
        types: '', //处理类型
        ruleForm: { //表单值
          openIds: [],
          addMemberOpenIds:[],
          groupName: '',
          groupId: '',
          // deadline: null,
          parentId: '',
          groupDesc: '',
          managerId: '',
          eGroupName: ''
        },
        rules: { //校验
          groupName: [{
            required: true,
            validator: groupName,
            trigger: ['blur']
          }],
          eGroupName: [{
            validator: eGroupName,
            trigger: ['blur']
          }],
          openIds:[{
            required: true,
            validator: openIds,
            trigger: ['blur','change']
          }],
          // deadline: [{
          //   required: true,
          //   validator: deadline,
          //   trigger: ['blur', 'change']
          // }],
          managerId: [{
            required: true,
            message: '请指定群主',
            trigger: ['blur', 'change']
          }]
        },
        openIdsData: [],
        parentIdData: [],
        managerIdData: []
      }
    },
    mounted() {
      this.getData();
    },
    methods: {
      eidtUser(){
            this.addUserToast.dialogVisible = true;
            setTimeout(()=>{
              this.$refs.addUser.resetData();
            },0)
      },
      pullUserSave() {//拉人保存
        this.$refs.addUser.save();
        this.addUserToast.dialogVisible = false;
      },
      parentChange() {
        let params = {}
        if (this.ruleForm.parentId){
          params.groupId=this.ruleForm.parentId
        }
        getUsersSelector({
          Vue: this,
          params: params
        }).then(data => {
          this.openIdsData = data.data;
          this.managerIdData = data.data;
        })
      },
      getData() {
        getGroupsSelector({
          Vue: this,
          params:{openId:this.getfromUser.fromUserId}
        }).then(data => {
          this.parentIdData = data.data;
          this.parentChange();
        })
        getUsersSelector({
          Vue: this,
        }).then(data => {
          this.openIdsData = data.data;
          this.managerIdData = data.data;
        })
      },
      submitForm(fun) {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            if (fun) {
              fun();
            }
          } else {
            return false;
          }
        });
      },
      resetForm() {
        this.$refs['ruleForm'].resetFields();
      }
    },
    components: {
      addUser
    }
  }

</script>
<style lang="less">
  .gm-toast-body {
    padding: 0 40px;
    .el-form-item__content {
      color: #333;
      font-size: 14px;
    }
    .el-form-item__label {
      color: #666666;
      font-size: 14px;
    }
    .user-number{
      margin-left: 10px;
      color: #999;
    }
  }

</style>

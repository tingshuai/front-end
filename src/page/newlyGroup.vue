<template>
  <div class="newly-group">
    <div class="newly-group-title">
      新建群组
    </div>
    <div class="newly-group-content">
      <eidt-group ref="toastBody"></eidt-group>
      <div class="add-btns" @click="save"> 新建</div>
    </div>
  </div>
</template>
<script>
  import {
    chatGroups
  } from '../api/index'
  import eidtGroup from '../components/funToast/eidtGroup'
  import {
    mapGetters,
    mapMutations
  } from 'vuex'
  export default {
    data () {
      return {
         isSave:true
      }
    },
    computed: {
      ...mapGetters(['getfromUser'])
    },
    activated() {
      this.addGrop();
      this.$refs.toastBody.getData();
    },
    mounted() {
      this.addGrop();
    },
    methods: {
      ...mapMutations(['setLoading']),
      addGrop() { //添加群
        this.$refs['toastBody'].types = 'add';
        this.$set(this.$refs['toastBody'], 'ruleForm', {
          openIds: [],
          addMemberOpenIds: [],
          groupName: '',
          groupId: '',
          parentId: '',
          groupDesc: '',
          managerId: this.getfromUser.fromUserId,
          eGroupName: ''
        })
        this.$refs['toastBody'].resetForm();
      },
      save() { //保存
        if(!this.isSave){
          return;
        }
        this.$refs['toastBody'].submitForm(() => {
          let groupId = '';
          delete this.$refs['toastBody'].ruleForm['groupId'];
          delete this.$refs['toastBody'].ruleForm['eGroupName'];
          this.isSave = false;
          this.setLoading(true);
          chatGroups({
            params: this.$refs['toastBody'].ruleForm,
            Vue: this
          }, groupId).then(data => {
            this.$message({
              message: data.message,
              type: 'success'
            });
            this.$refs['toastBody'].getData();
            this.addGrop();
            this.isSave = true;
            this.setLoading(false);
          }).catch(()=>{
            this.isSave = true;
            this.setLoading(false);
          })

        })
      }
    },
    components: {
      eidtGroup
    }
  }

</script>
<style lang="less">
  .newly-group {
    height: 100%;
    box-sizing: border-box;
    padding-left: 60px;
    position: relative;
    overflow: hidden;
    background-color: #FAFAFA;

    .newly-group-title {
      font-size: 20px;
      color: #2D3132;
      padding: 13px 30px;
      background-color: #FBFBFB;
      border-bottom: 1px solid#EFEFEF;
    }

    .newly-group-content {
      width: 440px;
      margin: 80px auto 0;
    }

    .add-btns {
      box-sizing: border-box;
      width: 240px;
      height: 36px;
      text-align: center;
      line-height: 36px;
      background-color: #267AFC;
      color: white;
      margin: 0 auto;
      cursor: pointer;
      border-radius: 2px;

      &:active {
        background-color: #409eff;
      }
    }
  }

</style>

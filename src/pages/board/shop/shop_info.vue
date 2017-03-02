<style lang="scss" scoped>

div#container {
    width: 500px;
}

.card_body {
    display: flex;
    justify-content: center;
}

.avatar-uploader{
   border: 1px dashed #bfcbd9;
   border-radius: 6px;
   cursor: pointer;
   position: relative;
   overflow: hidden;
   width: 200px;
   height: 200px;
 }
 .avatar-uploader-icon {
   font-size: 28px;
   color: #8c939d;
   width: 200px;
   height: 200px;
   line-height: 178px;
   text-align: center;
 }
 .avatar {
   width: 200px;
   height: 200px;
   display: block;
 }
 .tip {
   padding: 15px 0;
   text-align: center;
   font-size: 14px;
   height: 20px;
   line-height: 20px;
   color: #bfcbd9;
 }

</style>

<template lang="html">

<div id="container">
    <el-form ref="form" :form="form" label-width="100px">
        <el-form-item label="店铺头像">
            <el-card class="card_body">
                <div v-if="form.logo">
                  <el-upload class="avatar-uploader" action="http://upload.qiniu.com/" :data="requestData" :show-file-list="false" :on-success="handleAvatarScucess">
                    <img v-if="form.logo" :src="form.logo" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                  </el-upload>
                </div>
                <div v-else><i class="avatar-uploader el-icon-plus avatar-uploader-icon"></i></div>
                <div class="tip">点击更改</div>
            </el-card>
        </el-form-item>


        <el-form-item label="商家名称">
            <el-input :disabled="disabled" v-model="form.shop_name"></el-input>
        </el-form-item>
        <el-form-item label="商家电话">
            <el-input :disabled="disabled" v-model="form.tel"></el-input>
        </el-form-item>
        <el-form-item label="店铺简介">
            <el-input :disabled="disabled" type="textarea" :maxlength="300" :rows="3" :resize="none" v-model="form.introduction"></el-input>
        </el-form-item>
        <el-form-item label="商家地址">
            <el-input :disabled="disabled" type="textarea" :maxlength="100" v-model="form.address"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button @click="submit" type="primary">{{disabled?'修改信息':'确认提交'}}</el-button>
        </el-form-item>
    </el-form>
</div>

</template>

<script>
import axios from "../../../scripts/http"
import uploadImage from "../../../scripts/uploadImage"
export default {
    mixins: [uploadImage],
    methods: {
        handleAvatarScucess(res, file) {
            this.form.logo = URL.createObjectURL(file.raw);
        },
        submit(){
            if (this.disabled){
                this.disabled = false
            }else{
                console.log(this.form)
                //上传修改后的商家信息
                this.form.logo = 'http://ojrfwndal.bkt.clouddn.com/shop/' + this.shop_id
                this.form.id = this.shop_id
                let self = this
                axios.post('/v1/admin/updateShopInfo', this.form).then(resp=>{
                    if(resp.data.code == '00000'){
                        self.disabled = true
                    }
                })
            }
        }
    },
    mounted(){
        //set shop_id val
        let adminInfo = JSON.parse(localStorage.getItem('adminInfo'))
        console.log(adminInfo.shop_id)
        this.shop_id = adminInfo.shop_id

        this.form.tel = adminInfo.shop.tel
        this.form.shop_name = adminInfo.shop.shop_name
        this.form.address = adminInfo.shop.address
        this.form.introduction = adminInfo.shop.introduction
        this.form.logo = adminInfo.shop.logo
        //获取token
        axios.post('/v1/mediastore/getUpToken', {
            zone: 1,
            key: 'shop/' + this.shop_id
        }).then(resp => {
            this.requestData.key = 'shop/' + this.shop_id
            this.requestData.token = resp.data.data.token

            console.log(this.token)
        })
    },

    data() {
        return {
            requestData: {
              key:'',
              token: ''
            },
            shop_id: '',
            disabled: true,
            form: {
                tel: '',
                shop_name: "",
                address: "",
                introduction: "",
                logo: ""
            }
        }
    }

}

</script>

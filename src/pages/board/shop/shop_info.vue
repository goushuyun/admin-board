<style lang="scss" scoped>

div#container {
    width: 500px;
}

.card_body {
    text-align: center;
}

.logo_image {
    width: 200px;
    height: 200px;
    border: 1px solid #dbdbdb;
    border-radius: 6px;
    margin-top: 8px;
}

</style>

<template lang="html">

<div id="container">
    <el-form ref="form" :form="form" label-width="100px">
        <el-form-item label="店铺头像">
            <el-card class="card_body" :body-style="{ padding: '0px'}">
                <form id="upload_form" action="http://upload.qiniu.com/" method="post" enctype="multipart/form-data">
                    <input id="imageFile" v-show="false" name="file" type="file" accept="image/*" @change="fileChange">
                    <input type="hidden" name="key" :value="'shop/'+shop_id">
                    <input type="hidden" name="token" :value="token">
                    <img :src="form.logo" class="logo_image">
                    <div style="padding: 14px;">
                        <div class="bottom clearfix">
                            <el-button type="text" class="button" @click="changeShopLogo">上传头像</el-button>
                        </div>
                    </div>
                </form>
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
        submit(){
            if (this.disabled){
                this.disabled = false
            }else{
                console.log(this.form)
                //上传修改后的商家信息
                this.form.logo = 'http://ojrjlwt2h.bkt.clouddn.com//shop/' + this.shop_id
                this.form.id = this.shop_id
                let self = this
                axios.post('/v1/admin/updateShopInfo', this.form).then(resp=>{
                    if(resp.data.code == '00000'){
                        self.disabled = true
                    }
                })
            }
        },
        fileChange(){
            this.uploadShopLogo()
        },
        changeShopLogo(){
            $('#imageFile').click()

            //获取token
            axios.post('/v1/mediastore/getUpToken', {
                zone: 1,
                key: 'shop/' + this.shop_id
            }).then(resp => {
                this.token = resp.data.data.token

                console.log(this.token)
            })

            console.log('kai')
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
    },

    data() {
        return {
            token: '',
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

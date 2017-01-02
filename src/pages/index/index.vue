<style lang="scss" scoped>
@import "../../common/_color";

.container{
    background-color: $bg_grey;
    display: flex;
    align-items: center;
    justify-content: center;
}


div#loginBox{
    margin-top: -56px;
    padding: 24px;
    border-radius: 6px;
    background-color: white;
    width: 300px;

    .el-input{
        padding-bottom: 12px;
    }

    .login_btn{
        width: 100%;
    }
}
</style>

<template lang="html">
    <div class="container">
        <div id="loginBox">
            <el-input v-model="tel" placeholder="手机号码" autofocus></el-input>
            <el-input v-model="password" placeholder="密码"></el-input>
            <el-button class="login_btn" type="primary" @click="login">登录</el-button>
        </div>
    </div>
</template>

<script>

export default {
    data(){
        return {
            tel: '',
            password: ''
        }
    },
    methods: {
        login(){
            console.log(this.tel + '----' + this.password)
            this.$router.push({name: 'admin'})
        }
    }
}
</script>

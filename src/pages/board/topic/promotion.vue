<style lang="scss" scoped>

.el-form-item {
    margin-bottom: 6px;
}

</style>

<template lang="html">

<div class="container">
    <el-form label-width="80px" :inline="true">
        <el-form-item label="专题名称">
            <el-input v-model="title" size="small"></el-input>
        </el-form-item>
    </el-form>

    <el-form label-width="80px" :inline="true">
        <el-form-item label="添加书籍">
            <el-input v-model="isbn" @keyup.enter.native="search" size="small" placeholder="请输入isbn编码" :autofocus="true" :maxlength="13">

            </el-input>
        </el-form-item>
        <el-form-item class="btn_bottom">
            <el-button type="primary" :plain="true" icon="search" size="small" @click="search">搜索</el-button>
        </el-form-item>
        <el-form-item class="btn_bottom">
            <el-button type="primary" size="small" @click="submit">提交发布</el-button>
        </el-form-item>
    </el-form>

    <el-table style="width: 100%" :data="goods" v-loading.body="loading">
        <el-table-column label="ISBN" min-width="140" prop="isbn">
        </el-table-column>
        <el-table-column label="书名" width="180" prop="book.title">
        </el-table-column>
        <el-table-column label="出版社" min-width="100" prop="book.publisher">
        </el-table-column>
        <el-table-column label="售价" width="120" prop="book.price">
        </el-table-column>
        <el-table-column label="库存量" width="80" prop="amount">
        </el-table-column>
        <el-table-column label="操作">
            <template scope="scope">
                <el-button-group>
                      <el-button size="small" type="text" icon="delete" @click="delGoods(scope.$index)"></el-button>
                </el-button-group>
            </template>
        </el-table-column>
    </el-table>

</div>

</template>

<script>
import axios from "../../../scripts/http"
import {isISBNFormat} from "../../../scripts/utils"
export default {
    created(){
        //拿到话题的ID，推荐状态
        let topic_id = this.$route.params.topic_id, title = this.$route.params.title
        let recommend = this.$route.params.recommend

        console.log(topic_id + '-----' + recommend)



        if (topic_id == undefined){
            //新加topic
            console.log('the topic_id is null')


        }else{
            this.topic_id = topic_id
            this.title = title
            this.recommend = recommend
            //编辑话题，获取该话题的说有商品数据
            console.log('the topic_id is ' + topic_id)
            let data = {
                page: 1,
                size:  15,
                topic_id
            }

            axios.post('/v1/books/checkStore', data).then(resp => {
                if(resp.data.code = '00000'){
                    this.goods = resp.data.data.map(el=>{
                        el.book.price = (el.book.price_int/100).toFixed(2)
                        return el
                    })
                }
            })

        }

        console.log(topic_id)
    },

    methods: {
        //检查该商品是否符合设置为未推荐状态的标准(所有书籍均为未推荐)
        TopicIsRecommend(){
            return this.goods.some(el => {
                return el.amount > 0
            })
        },
        submit(){
            //检查话题名称、书本数量
            if(this.title == ''){
                this.$message('请填写专题名称')
                return
            }

            if(this.goods.length == 0){
                this.$message('请添加专题所要包含的书籍')
                return
            }

            /*
                提交发布分两种，
                1 => 没有topic_id, 新发布话题
                2 => 有topic_id, 更新话题
            */

            if(this.topic_id != ''){
                //更新话题，删除&添加已作处理，其实就是跟新一个话题名称
                let data = {title: this.title, id: this.topic_id}
                axios.post('/v1/activity/update_topic_title', data).then(res=>{
                    if(res.data.code == '00000'){
                        //修改title 成功
                        this.$router.push('topic')
                    }
                })
            }else{
                //没有topic_id , 组织数据开始提交
                let data = {title: this.title}
                data.topic_items = this.goods.map(el => {
                    console.log(el)

                    return {goods_id: el.id}
                })

                data.recommend = this.TopicIsRecommend()

                console.log(data)

                axios.post('/v1/activity/add_topic', data).then(resp=>{
                    //发布成功后，跳转到专题列表页面
                    if(resp.data.code == '00000'){
                        this.$router.push('topic')
                    }
                })

            }
        },

        updateTopicGoods(goods){
            console.log(goods)
            axios.post('/v1//activity/update_topic_goods', goods).then(resp=>{
                if(resp.data.code == '00000'){
                    this.$message('操作成功！')
                }
            })
        },
        delGoods(index){
            this.goods.splice(index, 1)

            if(this.topic_id != ''){
                //删除已有话题的部分商品
                let topic_goods = {
                    recommend: false,
                    goods_id: this.goods[index].id,
                    topic_id: this.topic_id,
                    operate_type: 'reduce'
                }

                this.updateTopicGoods(topic_goods)
            }

        },

        search(){
            //一个话题内商品数量限制在15本内
            if(this.goods.length > 15) {
                this.$message({
                    message: '一个话题内的书本数量不能超过 15 本',
                    type: 'warning'
                })

                return
            }


            //isbn为空
            if(!isISBNFormat(this.isbn)){
                this.$message({
                    message: '请填写正确的 ISBN 码',
                    type: 'warning'
                })

                return
            }

            this.loading = true
            let data = {
                page: 1,
                size: 10,
                isbn: this.isbn
            }

            axios.post("/v1/books/checkStore", data).then(resp=>{
                if(resp.data.code == '00000'){
                    if(resp.data.total == 0){
                        //没有找到
                        this.$message({
                            message: '没有在仓库找到这本书',
                            type: 'warning'
                        })
                        this.loading = false
                        return
                    }

                    let goods = resp.data.data[0]

                    //检查商品库存数量，小于0 则提示不能推荐
                    if(goods.amount < 1){
                        this.$message({
                            message: '该商品库存不足，请及时上架商品！',
                            type: 'warning'
                        })
                        this.loading = false
                        return
                    }

                    goods.book.price = (goods.book.price_int/100).toFixed(2)

                    this.goods.unshift(goods)

                    if(this.topic_id != ''){
                        //已有话题，添加话题项
                        let topic_goods = {
                            topic_id: this.topic_id,
                            goods_id: resp.data.data[0].id,
                            operate_type: 'add'
                        }

                        this.updateTopicGoods(topic_goods)
                    }


                    this.loading = false

                    this.isbn = ''
                    console.log(resp.data)
                }
            })
        }
    },

    data(){
        return {
            title: '',
            isbn: '',
            goods: [],
            loading: false,

            topic_id: ''
        }
    }
}

</script>

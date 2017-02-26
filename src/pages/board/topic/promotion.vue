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
            <el-input v-model="isbn" size="small" placeholder="请输入isbn编码" :autofocus="true" :maxlength="13"></el-input>
        </el-form-item>
        <el-form-item class="btn_bottom">
            <el-button size="small" type="primary" @click="search">查找</el-button>
        </el-form-item>
        <el-form-item class="btn_bottom">
            <el-button size="small" @click="submit">提交发布</el-button>
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
            <el-table-column label="状态" width="100">

                <template scope="scope">
                    <p style="color: #13CE66;" v-if="scope.row.recommend == true" class="promotion">推荐中</p>
                    <p style="color: #FF4949;" v-if="scope.row.recommend == false" class="promotion">未推荐</p>
                </template>

            </el-table-column>
            <el-table-column label="操作">
                <template scope="scope">
                    <el-button-group>
                          <el-button :disabled="scope.row.amount<=0" size="small" type="primary" icon="edit" @click="changeStatus(scope.$index)"></el-button>
                          <el-button size="small" type="danger" icon="delete" @click="delGoods(scope.$index)"></el-button>
                    </el-button-group>
                </template>

            </el-table-column>
        </el-table>

</div>

</template>

<script>
import axios from "../../../scripts/http"

export default {
    created(){
        //拿到话题的ID，推荐状态
        let topic_id = this.$route.params.topic_id
        let recommend = this.$route.params.recommend

        console.log(topic_id + '-----' + recommend)



        if (topic_id == undefined){
            //新加topic
            console.log('the topic_id is null')


        }else{
            this.topic_id = topic_id
            this.recommend = recommend
            //编辑话题，获取该话题的说有商品数据
            console.log('the topic_id is ' + topic_id)
            let data = {
                page: 1,
                size:  10,
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
                return el.recommend == true
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

            //组织数据开始提交
            let data = {title: this.title}
            data.topic_items = this.goods.map(el => {
                console.log(el)

                return {goods_id: el.id, recommend: el.recommend}
            })

            data.recommend = this.TopicIsRecommend()

            console.log(data)

            axios.post('/v1/activity/add_topic', data).then(resp=>{
                //发布成功后，跳转到专题列表页面
                if(resp.data.code == '00000'){
                    this.$router.push('topic')
                }
            })

        },

        updateTopicGoods(goods){
            console.log(goods)
            axios.post('/v1//activity/update_topic_goods', goods).then(resp=>{
                if(resp.data.code == '00000'){
                    this.$message('操作成功！')
                }
            })

            //检查是否需要更新话题状态
            if(!this.TopicIsRecommend() && this.recommend == true){
                //更新话题状态
                axios.post('/v1/activity/update_topic_status', {id: this.topic_id}).then(resp=>{

                    if(resp.data.code == '00000'){
                        //do nothing
                    }

                })
            }

        },

        changeStatus(index){
            this.goods[index].recommend = !this.goods[index].recommend

            if(this.topic_id != ''){
                //修改已有话题的部分话题的推荐属性
                let topic_goods = {
                    recommend: this.goods[index].recommend,
                    goods_id: this.goods[index].id,
                    topic_id: this.topic_id,
                    operate_type: 'update'
                }
                this.updateTopicGoods(topic_goods)
            }

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
            //isbn为空
            if(this.isbn == ''){
                this.$message({
                    message: '请填写ISBN',
                    type: 'warning'
                })

                return
            }

            //isbn不符合规定
            if(!/^\d{10,13}$/.test(this.isbn)){
                this.$message({
                    message: '没有在仓库找到这本书',
                    type: 'warning'
                })

                this.isbn = ''
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

                    goods.book.price = (goods.book.price_int/100).toFixed(2)

                    //如果库存为0，加入推荐组，但标记为未推荐
                    if(goods.amount > 0){
                        goods.recommend = true
                    }else{
                        goods.recommend = false
                    }

                    this.goods.unshift(resp.data.data[0])

                    if(this.topic_id != ''){
                        //已有话题，添加话题项
                        let topic_goods = {
                            topic_id: this.topic_id,
                            recommend: true,
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

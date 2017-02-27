<style lang="scss" scoped>
.add_btn_row {
    margin-bottom: 16px;
}
</style>

<template lang="html">
<div class="container">

    <el-row class="add_btn_row" type="flex" justify="end">
        <el-col :span="4">
            <el-button type="primary" icon="plus" size="small" @click="addTopic">添加专题</el-button>
        </el-col>
    </el-row>

    <el-table style="width: 100%" :data="topics">
        <el-table-column prop="title" label="专题名" width="180">
        </el-table-column>
        <el-table-column prop="total" label="书籍数量">
        </el-table-column>
        <el-table-column prop="status" label="推荐状态">
            <template scope="scope">
                <p style="color: #13CE66;" v-if="scope.row.recommend == true">推荐中<p>
                <p v-if="scope.row.recommend == false">取消推荐<p>
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template scope="scope">
                <el-button-group size="small">
                      <el-button size="small" type="success" icon="edit" @click="editTopic(scope.$index)"></el-button>
                      <el-button size="small" type="primary" @click="updateTopicStatus(scope.row.id)">更改推荐状态</el-button>
                      <el-button size="small" type="danger" icon="delete" @click="deleteTopic(scope.row.id)"></el-button>
                </el-button-group>
            </template>
        </el-table-column>
    </el-table>

</div>

</template>

<script>
import axios from "../../../scripts/http"
export default {
    mounted(){
        //首页加载完成之后，立马罗列所有图书话题
        this.getShopTopic()
    },


    methods: {
        updateTopicStatus(id){
            axios.post('/v1/activity/update_topic_status', {id}).then(resp=>{

                if(resp.data.code == '00000'){
                    this.$message('状态更改成功！')
                    this.getShopTopic()
                }

            })
        },

        getShopTopic(){
            axios.post('/v1/activity/list_topics', {}).then(resp=> {
                this.topics = resp.data.data
                console.log(resp.data)
            })
        },

        editTopic(index){
            let topic = this.topics[index]

            this.$router.push({name: 'promotion', params: {topic_id: topic.id, recommend: topic.recommend, title: topic.title}})
        },


        deleteTopic(id){
            axios.post('/v1/activity/delete_topic', {id}).then(resp=>{
                if(resp.data.code == '00000'){
                    this.$message('删除成功！')
                    this.getShopTopic()
                }
            })
        },

        addTopic(){
            this.$router.push('promotion')
            console.log('asdfds')
        }
    },

    data() {
        return {
            topics: []
        }
    }
}
</script>

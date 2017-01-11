<style lang="scss" scoped>

div.content {
    .box-card {
        width: 280px;
        display: inline-block;
        padding: 0 10px;
        vertical-align: top;
        .el-button-group{
            line-height: 36px;
        }
        .text {
            font-size: 14px;
        }
        .item {
            padding: 16px 0;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .shelve_input{
                width: 180px;
            }
            .operation{
                &>i{
                    padding: 0 4px;
                    height: 100%;
                    line-height: 100%;
                }
                .el-icon-delete:hover{
                    cursor: pointer;
                    color: #FC5557;
                }
                .el-icon-edit:hover{
                    cursor: pointer;
                    color: #30ABFC;
                }
            }
        }
        .clearfix:before,
        .clearfix:after {
            display: table;
            content: "";
        }
        .clearfix:after {
            clear: both
        }
    }
    div.statistics{
        font-size: 12px;
        position: fixed;
        right: 32px;
        bottom: 32px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 4px 6px;
        border-radius: 4px;
        background-color: #1581D9;
        color: white;
        box-shadow: 0 0 2px 1px rgba(0, 0, 0, 0.2);
        div.result{
            padding-right: 16px;
        }
        span.number{
            font-size: 14px;
            padding: 0 12px;
        }
    }
}

</style>

<template lang="html">

<div class="content">
    <el-card class="box-card" v-for="(store, index) in stores">
        <div slot="header" class="clearfix top">
            <el-row>
                <el-col :span="14" style="text-align: left;">
                    <span style="line-height: 36px;" v-show="!(store.id==show_ele_id)">{{store.name}}</span>
                    <el-input @blur="input_blur(store.id, store.name, index)" v-model="store.name" size="small" class="edit-input" v-show="store.id==show_ele_id" :autofocus="true"></el-input>
                </el-col>
                <el-col :span="10" class="btns" style="text-align: right;">
                    <el-button-group style="float: right;">
                        <el-button type="primary" icon="plus" size="small" @click="addShelf(store.shelves)"></el-button>
                        <el-button type="success" icon="edit" size="small" @click="editTitle(store.id)" v-show="!(store.id == show_ele_id)"></el-button>
                        <el-button type="success" icon="circle-check" size="small" @click="input_blur(store.id, index)" v-show="store.id == show_ele_id"></el-button>
                        <el-button type="danger" icon="delete" size="small" @click="deleteStore(index, store.id)"></el-button>
                    </el-button-group>
                </el-col>
            </el-row>
        </div>
        <div v-for="(shelf, index) in store.shelves" class="text item">
            <span class="text" v-show="!(shelf.id==show_ele_id)">{{shelf.name}}</span>
            <el-input size="small" v-model.trim="shelf.name" class="shelve_input" v-show="shelf.id==show_ele_id" @blur="input_blur" :autofocus="true"></el-input>
            <span class="operation">
                <i class="el-icon-edit" @click="editTitle(shelf.id)"></i>
                <i class="el-icon-delete" @click="delShelves(index, store)"></i>
            </span>
        </div>
    </el-card>

    <div class="statistics">
        <div class="result">
            共<span class="number">2</span>个仓库
            共<span class="number">28989</span>本书
        </div>
        <el-button @click="addStore" type="success" size="small" icon="plus">添加仓库</el-button>
    </div>
</div>

</template>

<script>

export default {
    mounted(){
        console.log('mounted')
    },
    data(){
        return{
            stores: [{
                name: '小仓库',
                id: '234223',
                shelves: [{
                    name: '一号货架',
                    id: '467'
                }, {
                    name: '一号货架',
                    id: '4567'
                }]
            }, {
                name: '小仓库',
                id: '23423423',
                shelves: [{
                    name: '一号货架',
                    id: '45sdf67'
                }, {
                    name: '一号货架',
                    id: '4562317'
                }]
            }],
            show_ele_id: ''
        }
    },
    methods:{
        delShelves(index, store){
            store.shelves.splice(index, 1)
        },
        addShelf(shelves){
            let temp = {
                name: '王凯。。。',
                id: ''
            }
            shelves.push(temp)
        },
        deleteStore(index, id){
            // remove this store from stores array
            this.$confirm('您确定要删除该仓库？之后该仓库所有图书将失去库位信息。', "删除仓库", {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(()=>{
                this.stores.splice(index, 1)
                this.$message({
                    type: 'success',
                    message: '删除成功！'
                })
            }).catch(()=>{
                console.log('cancel')
            })
        },
        addStore(){
            //push a new obj to stores array
            var temp = {
                name: '',
                id: '',
                shelves: []
            }
            this.stores.unshift(temp)
        },
        input_blur(id, name, index){
            //bind blur event, and update store name by id

            if(id == ''){
                //add new store
                if(name == ''){
                    this.$message({
                        message:'仓库名称未填写！',
                        type: 'warning'
                    })
                    return
                }
                this.$http.post('/v1/store/addStore', {name: name}).then((resp)=>{
                    this.stores[index].id = resp.data.data.id
                })
            }else{
                //update store name
                this.$http.post('/v1/store/updateStore', {name: name, id: id}).then(resp=>{
                    console.log(resp)
                })
            }

            console.log(id, index)
            this.show_ele_id = ''
        },
        editTitle(id){
            console.log(this.show_ele_id.length)
            if(this.show_ele_id.length > 0){
                this.show_ele_id = ''
            }
            this.show_ele_id = id
            // return this.edit = !this.edit
        }
    }

}

</script>

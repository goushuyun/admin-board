import axios from "../../../scripts/http"

export default {
    methods: {

        handleSizeChange(size) {
            this.size = size
            this.getTopicData()
        },

        handleCurrentChange(page) {
            this.page = page
            this.getTopicData()
        },

        // 请求话题数据
        getTopicData(){

            let data = {
                page: this.page,
                size: this.size,
                topic_id: this.topic_id
            }

            axios.post('/v1/books/checkStore', data).then(resp=>{
                this.total = resp.data.total

                this.goods = resp.data.data.map(el => {
                    el.book.price = (el.book.price_int / 100).toFixed(2)
                    return el
                })
            })
        }

    }
}

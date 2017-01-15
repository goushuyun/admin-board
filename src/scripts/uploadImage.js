import {getTimeVal} from './utils'

export default {
    methods: {
        submitUploadForm(e) {
            //this.loadingShow = true
            // var target = $(e.target),
            //     box = target.parents('.box')
            // var index = $('.box').index(box) + 1

            var iframe = document.createElement("iframe");
            iframe.name = "ActionFrame";
            iframe.id = "ActionFrame";
            document.body.appendChild(iframe); //构造一个对象。插入页面中。
            //开始提交
            var MyForm = document.getElementById('upload_form');
            MyForm.target = "ActionFrame"; //让表单在iframe中提交
            MyForm.submit(); //执行提交。

            iframe.onload = (e) => {
                //加载完成之后，前端切换显示上传的图片
                this.book.pic = "http://ojrjlwt2h.bkt.clouddn.com/" + this.book.isbn + "?" + getTimeVal()
                iframe.parentNode.removeChild(iframe);
                iframe = null;
            }
        }
    }
}

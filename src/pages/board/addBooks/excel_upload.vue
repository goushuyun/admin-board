<style lang="scss" scoped>
.box-card {
    width: 600px;
    margin-left: 15px;
    .excel_upload {
        margin: 20px;
    }
    .error {
        margin: 40px 0;
    }
    .prompt {
        margin-top: 20px;
        color: #8391A5;
        p {
            font-size: 12px;
        }
    }
}

div p {
    // height: 40px;
    line-height: 40px;
    margin-left: 10px;
    font-size: 14px;
    span {
        font-weight: bold;
    }
    a {
        margin: 0 10px;
    }
}

.dialog-title {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: red;
    img {
        width: 40px;
        height: 40px;
        margin-right: 5px;
    }
}
.warning_pic{
    width: auto;
    margin: 10px;
    img {
      width: 100%;
      border: 1px solid;
    }
}
.footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    .el-button {
        margin: 10px;
    }
}
</style>

<template lang="html">
  <div>
    <div class="box-card">
      <div class="example">
          <p>如果您还没有下载样例文件，请点击<a href="https://www.baidu.com">下载样例文件</a>，并编辑好商品信息后上传。</p>
      </div>
      <div class="excel_upload">
          <el-button size="small" type="primary" @click="showDialog">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传xlsx文件，且不超过500kb</div>
      </div>
      <div class="error">
        <p><span>文件有误：</span><a href="https://www.baidu.com">xxxxxxx.xls</a>请点击下载此文件，按照要求修改后重新上传。</p>
      </div>

      <div class="prompt">
         <p>上传须知：</p>
         <p>出版社：请使用完整的出版社名称</p>
         <p>类别：1.教材 2.教辅 3.外语 4.阅读 5.考证</p>
         <p>类型：1.新书 2.旧书</p>
         <p>仓库名、货架名：请使用完整的仓库名、货架名</p>
      </div>
    </div>

    <el-dialog :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false" v-model="dialogVisible">
      <div class="dialog-title">
          <img src="src/images/warning.png"/><span>警告</span>
      </div>
      <div>
          <p>· 请务必确保上传内容正确，否则会造成无法挽回的损失！</p>
          <p>· 折扣示例：0.7表示7折 ，请保持折扣值在0~1之间！</p>
          <p>· 请确保书名、出版社、作者等信息下方的信息是对应的。避免出现将书名填写在出版社下方的情况！</p>
          <p>· 请使用完整的出版社名称以及仓库、货架名！</p>
          <p>· 数据一旦上传将无法撤回，造成的一切后果请自行承担！</p>
      </div>
      <div class="warning_pic">
          <img src="src/images/upload_warning.jpg">
      </div>
      <div class="dialog-footer footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-upload class="upload-demo" action="/v1/file/upload_books_excel" :on-preview="handlePreview" :on-success="handleSuccess" :on-error="handleError">
          <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </el-upload>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
    data() {
        return {
            dialogVisible: false
        }
    },
    methods: {
      handleSuccess(response, file, fileList) {
        console.log('success!');
      },
      handleError(err, file, fileList) {
        console.log('error!');
      },
      handlePreview(file) {
        console.log(file);
      },
      showDialog(){
        this.dialogVisible = true
      }
    }
}
</script>

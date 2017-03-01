<style lang="scss" scoped>

.excel_upload {}

</style>

<template lang="html">

<div>
    <el-row type="flex" justify="center">
        <el-col :span="12">
            <el-upload name="excel" class="excel_upload" drag action="/v1/file/upload_books_excel">
                <el-button icon="upload" size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传xlsx文件，且不超过500kb</div>
            </el-upload>
        </el-col>
    </el-row>
</div>

</template>

<script>

export default {}

</script>

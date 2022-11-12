<script lang="ts" setup>
function showMessage () {
  ElMessage({
    message: 'Hello!'
  })
}
</script>

<template>
  <div>
    <el-container>
      <el-header>Header</el-header>
      <el-main>
        <el-button>
          This is a test button.
        </el-button>
        <el-button @click="showMessage">
          Click to see messages.
        </el-button>
      </el-main>
      <el-footer>Footer</el-footer>
    </el-container>
  </div>
</template>

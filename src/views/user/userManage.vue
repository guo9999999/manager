<template>
  <div class="user-manage">
    <!-- 搜索 -->
    <el-card class="search-user">
      <el-form :inline="true" :model="user" ref="searchRef">
        <!-- 用户id -->
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="user.userId" placeholder="请输入用户id"></el-input>
        </el-form-item>
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="userName">
          <el-input
            v-model="user.userName"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <!-- 用户状态 -->
        <el-form-item label="用户状态" prop="state">
          <el-select v-model="user.state">
            <el-option :value="0" label="所有"></el-option>
            <el-option :value="1" label="在职"></el-option>
            <el-option :value="2" label="离职"></el-option>
            <el-option :value="3" label="试用期"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 表格内容 -->
    <el-card class="user-list">
      <!-- 操作 -->
      <div class="action">
        <el-button type="primary">新增</el-button>
        <el-button type="danger">批量删除</el-button>
      </div>
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%">
        <!-- 多选 -->
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          v-for="item in columnData"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
        ></el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" width="150">
          <template #default>
            <el-button size="small">编辑</el-button>
            <el-button size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :total="pager.total"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { usersList } from '@/api/sys.js'
const user = ref({
  userId: '',
  userName: '',
  state: 0
})

// 定义一个表格头
const columnData = ref([
  {
    label: '用户ID',
    prop: 'userId'
  },
  {
    label: '用户名',
    prop: 'userName'
  },
  {
    label: '用户邮箱',
    prop: 'userEmail'
  },
  {
    label: '用户角色',
    prop: 'role'
  },
  {
    label: '用户状态',
    prop: 'state'
  },
  {
    label: '注册时间',
    prop: 'createTime'
  },
  {
    label: '最后登录时间',
    prop: 'lastLoginTime'
  }
])

// 表格数据
const tableData = ref([])
const pager = ref({
  pageNum: 1, //当前页数
  pageSize: 10 //每页条数
})
// 获取表格数据
const getUsersList = async () => {
  let params = { ...pager.value, ...user.value }
  const res = await usersList(params)
  tableData.value = res.list
  pager.value.total = res.page.total
}
onMounted(() => {
  getUsersList()
})
// 查询操作
const handleQuery = () => {
  getUsersList()
}

// 重置
const searchRef = ref(null)
const handleReset = () => {
  searchRef.resetFields()
}
// 切换当前页码
const handleCurrentChange = (number) => {
  pager.value.pageNum = number
  getUsersList()
}
</script>
<style lang="scss" scoped>
.user-manage {
  .search-user {
    margin-bottom: 20px;
  }
  .user-list {
    .action {
      border-bottom: 1px solid #eee;
      padding-bottom: 10px;
    }
    .pagination {
      padding: 20px;
      text-align: right;
    }
  }
}
</style>

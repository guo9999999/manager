<template>
  <div class="dept-con">
    <el-card class="search-card">
      <el-form ref="searchRef" :model="searchData" inline>
        <el-form-item label="部门名称" prop="deptName">
          <el-input
            placeholder="请输入部门名称"
            v-model="searchData.deptName"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 内容展示 -->
    <el-card class="warp">
      <!-- 操作按钮 -->
      <div class="active">
        <el-button type="primary" @click="handleCreate">创建</el-button>
      </div>
      <!-- 表格 -->
      <el-table :data="tableData" row-key="_id" default-expand-all>
        <el-table-column
          v-for="item in columns"
          :label="item.label"
          :prop="item.prop"
          :formatter="item.formatter"
          :key="item.prop"
        ></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              @click="handleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="handleDel(scope.row._id)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 弹窗添加编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="action == 'edit' ? '编辑部门' : '创建部门'"
      @close="handleClose"
    >
      <el-form
        :model="deptData"
        label-width="100px"
        :rules="deptRules"
        ref="deptRef"
      >
        <el-form-item label="上级部门" prop="parentId">
          <el-cascader
            v-model="deptData.parentId"
            :options="tableData"
            :props="{
              checkStrictly: true,
              value: '_id',
              label: 'deptName'
            }"
            style="width: 40%"
            placeholder="请选择上级部门"
            clearable
          />
        </el-form-item>
        <el-form-item label="部门名称" prop="deptName">
          <el-input
            v-model="deptData.deptName"
            placeholder="请输入部门名称"
          ></el-input>
        </el-form-item>

        <!-- 负责人 -->
        <el-form-item label="负责人" prop="user">
          <el-select
            v-model="deptData.user"
            placeholder="请选择部门负责人"
            @change="handleChange"
          >
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.userName"
              :value="`${item.userName}/${item.userId}/${item.userEmail}`"
            />
          </el-select>
        </el-form-item>
        <!-- 负责人邮箱 -->
        <el-form-item label="负责人邮箱" prop="userEmail">
          <el-input
            v-model="deptData.userEmail"
            disabled
            placeholder="请输入负责人邮箱"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">{{
            action == 'edit' ? '修改' : '添加'
          }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { deptList, deptOperate, allUserList } from '@/api/sys.js'
import { ElMessage } from 'element-plus'
import util from '../../utils/util.js'

// 查询表单
const searchRef = ref(null) //查询表单的ref
const searchData = ref({
  deptName: ''
})

// 查询操作
const handleQuery = () => {
  getDeptList()
}
const handleReset = () => {
  searchRef.value.resetFields()
}

// 表格表头信息
const columns = ref([
  {
    label: '部门名称',
    prop: 'deptName'
  },
  {
    label: '负责人',
    prop: 'userName'
  },
  {
    label: '更新时间',
    prop: 'updateTime',
    formatter: (row, column, value) => {
      return util.format(new Date(value))
    }
  },
  {
    label: '创建时间',
    prop: 'createTime',
    formatter: (row, column, value) => {
      return util.format(new Date(value))
    }
  }
])
// 表格数据
const tableData = ref([])
const action = ref('create')
// 获取部门列表数据
const getDeptList = async () => {
  tableData.value = await deptList(searchData.value)
}
// 调用部门列表数据
onMounted(() => {
  getDeptList()
  getAllUserList()
})
//弹出框
const dialogVisible = ref(false)
// 弹出框表格信息
const deptData = ref({
  parentId: [null],
  deptName: '',
  user: '',
  userName: '',
  userId: '',
  userEmail: ''
})
const deptRules = ref({
  parentId: [
    {
      required: true,
      message: '请选择上级部门',
      trigger: 'blur'
    }
  ],
  deptName: [
    {
      required: true,
      message: '请输入部门名称',
      trigger: 'blur'
    }
  ],
  user: [
    {
      required: true,
      message: '请选择负责人',
      trigger: 'blur'
    }
  ]
})
// 创建
const handleCreate = () => {
  action.value = 'create'
  dialogVisible.value = true
}
// 编辑
const handleEdit = (row) => {
  action.value = 'edit'
  dialogVisible.value = true
  nextTick(() => {
    const { parentId, deptName, userName, userId, userEmail, _id } = row
    Object.assign(deptData.value, {
      parentId,
      deptName,
      userName,
      userId,
      userEmail,
      _id
    })
    deptData.value.user = `${userName}`
  })
}
// 删除
const handleDel = async (_id) => {
  action.value = 'delete'
  let params = { _id }
  params.action = action.value
  const res = await deptOperate(params)
  ElMessage.success(res.msg)
  getDeptList()
}
// 获取所有用户列表
const userList = ref([])
const deptRef = ref(null)
const getAllUserList = async () => {
  userList.value = await allUserList()
}
// 选择负责人
const handleChange = (val) => {
  const [userName, userId, userEmail] = val.split('/')
  Object.assign(deptData.value, { userName, userId, userEmail })
  console.log(deptData.value)
}
// 重置
const handleClose = () => {
  dialogVisible.value = false
  deptRef.value.resetFields()
}
// 提交操作
const handleSubmit = () => {
  deptRef.value.validate(async (valid) => {
    if (valid) {
      let params = { ...deptData.value }
      params.updateTime = new Date()
      params.action = action.value
      delete params.user
      const res = await deptOperate(params)
      // 提交成功，重新获取部门数据，关闭弹出框
      ElMessage.success(res.msg)
      getDeptList()
      handleClose()
    }
  })
}
</script>
<style lang="scss" scoped>
.dept-con {
  .search-card {
    margin-bottom: 20px;
  }
  .warp {
    .active {
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
    }
  }
  :deep(.el-overlay) {
    z-index: 2003 !important;
  }
}
</style>

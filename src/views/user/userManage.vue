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
          <el-button @click="handleReset(searchRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 表格内容 -->
    <el-card class="user-list">
      <!-- 操作 -->
      <div class="action">
        <el-button type="primary" @click="handleCreate">新增</el-button>
        <el-button type="danger" @click="handleAllDel">批量删除</el-button>
      </div>
      <!-- 表格 -->
      <el-table
        :data="tableData"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <!-- 多选 -->
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column
          v-for="item in columnData"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        ></el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="hangleEdit(scope.row)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="handleUserDel(scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        class="pagination"
        background
        layout="prev, pager, next"
        :page-size="pager.pageSize"
        :total="pager.total"
        @current-change="handleCurrentChange"
      ></el-pagination>
    </el-card>

    <!-- 弹出添加表单 -->
    <el-dialog
      v-model="isShowDialog"
      :title="action === 'edit' ? '用户修改' : '用户新增'"
    >
      <el-form
        :model="userFormData"
        ref="userFormRef"
        :rules="userRules"
        label-width="80px"
      >
        <!-- 用户名称 -->
        <el-form-item label="用户名称" prop="userName">
          <el-input
            v-model="userFormData.userName"
            placeholder="请输入用户名称"
            :disabled="action === 'edit'"
          ></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item label="用户邮箱" prop="userEmail">
          <el-input
            v-model="userFormData.userEmail"
            placeholder="请输入用户邮箱"
            :disabled="action === 'edit'"
          ></el-input>
        </el-form-item>
        <!-- 手机号 -->
        <el-form-item label="手机号" prop="mobile">
          <el-input
            v-model="userFormData.mobile"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <!-- 岗位 -->
        <el-form-item label="岗位" prop="job">
          <el-input
            v-model="userFormData.job"
            placeholder="请输入岗位"
          ></el-input>
        </el-form-item>
        <!-- 状态 -->
        <el-form-item label="状态" prop="state">
          <el-select v-model="userFormData.state">
            <el-option label="在职" :value="1"></el-option>
            <el-option label="离职" :value="2"></el-option>
            <el-option label="试用期" :value="3"></el-option>
          </el-select>
        </el-form-item>
        <!-- 系统角色 -->
        <el-form-item label="系统角色" prop="roleList">
          <el-select
            v-model="userFormData.roleList"
            multiple
            style="width: 100%"
            placeholder="请选择系统角色"
          >
            <el-option
              v-for="role in roleListData"
              :key="role._id"
              :label="role.roleName"
              :value="role._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 部门 -->
        <el-form-item label="部门" prop="deptId">
          <el-cascader
            v-model="userFormData.deptId"
            :options="deptListData"
            :props="{
              checkStrictly: true,
              value: '_id',
              label: 'deptName'
            }"
            style="width: 100%"
            placeholder="请选择部门"
            clearable
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleAdd">{{
            action === 'edit' ? '修改' : '新增'
          }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, toRaw, nextTick } from 'vue'
import {
  usersList,
  usersDel,
  deptList,
  rolesOperate,
  userCreate
} from '@/api/sys.js'
import { ElMessage } from 'element-plus'
import util from '../../utils/util.js'
const user = ref({
  userId: '',
  userName: '',
  state: 1
})

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
  getDeptList()
  getRolesOperate()
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
    prop: 'userEmail',
    width: 150
  },
  {
    label: '用户角色',
    prop: 'role',
    formatter: (row, column, value) => {
      return {
        0: '系统管理员',
        1: '普通用户'
      }[value]
    }
  },
  {
    label: '用户状态',
    prop: 'state',
    formatter: (row, column, value) => {
      return {
        0: '所有',
        1: '在职',
        2: '离职',
        3: '试用期'
      }[value]
    }
  },
  {
    label: '注册时间',
    prop: 'createTime',
    width: 180,
    formatter: (row, column, value) => {
      return util.format(new Date(value))
    }
  },
  {
    label: '最后登录时间',
    prop: 'lastLoginTime',
    width: 180,
    formatter: (row, column, value) => {
      return util.format(new Date(value))
    }
  }
])

// 查询操作
const handleQuery = () => {
  getUsersList()
}

// 重置
const searchRef = ref(null)
const handleReset = (searchRef) => {
  searchRef.resetFields()
}
// 切换当前页码
const handleCurrentChange = (number) => {
  pager.value.pageNum = number
  getUsersList()
}
//删除单条用户信息
const handleUserDel = async (row) => {
  const res = await usersDel({
    userIds: [row.userId]
  })
  if (res.nModified) {
    ElMessage.success('删除成功')
    // 重新获取数据
    getUsersList()
  } else {
    ElMessage.error('删除失败')
  }
}
// 批量删除
const isCheckedIsds = ref([]) //选中的用户id
const handleAllDel = async () => {
  if (isCheckedIsds.value.length === 0) {
    ElMessage.error('请选择要删除的用户信息')
    return
  }
  const res = await usersDel({
    userIds: isCheckedIsds.value
  })
  if (res.nModified) {
    ElMessage.success('删除成功')
    // 重新获取数据
    getUsersList()
  } else {
    ElMessage.error('删除失败')
  }
}
//多选获取选中数据
const handleSelectionChange = (val) => {
  let arr = []
  val.map((item) => {
    arr.push(item.userId)
  })
  isCheckedIsds.value = arr
}
// 表单信息
const userFormData = ref({
  userName: '',
  userEmail: '',
  mobile: '',
  job: '',
  state: 1,
  roleList: [],
  deptId: []
})
// 用户表单验证规则
const userRules = ref({
  userName: [
    {
      required: true,
      message: '请输入用户名',
      trigger: 'blur'
    }
  ],
  userEmail: [
    {
      required: true,
      message: '请输入邮箱',
      trigger: 'blur'
    },
    {
      pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
      message: '邮箱格式不对',
      trigger: 'blur'
    }
  ],
  mobile: [
    {
      required: true,
      message: '请输入手机号码',
      trigger: 'blur'
    },
    {
      pattern: /^1(3[0-9]|5[0-3,5-9]|7[1-3,5-8]|8[0-9])\d{8}$/,
      message: '手机号码格式不对',
      trigger: 'blur'
    }
  ],
  deptId: [
    {
      required: true,
      message: '请选择部门',
      trigger: 'blur'
    }
  ]
})
// 新增用户操作
const action = ref('add') //默认添加操作
const isShowDialog = ref(false) //显示弹出框
const handleCreate = () => {
  action.value = 'add'
  isShowDialog.value = true
}
// 获取部门列表数据
const deptListData = ref([])
const getDeptList = async () => {
  const list = await deptList()
  deptListData.value = list
}
// 获取角色名称列表
const roleListData = ref([])
const getRolesOperate = async () => {
  const roleList = await rolesOperate()
  roleListData.value = roleList
}

// 用户弹窗取消操作
const userFormRef = ref(null)
const handleClose = () => {
  // 关闭弹窗，
  isShowDialog.value = false
  // 清除表单数据
  userFormRef.value.resetFields()
}
// 添加和修改用户操作
const handleAdd = () => {
  userFormRef.value.validate(async (valid) => {
    if (valid) {
      // 添加用户操作
      let params = toRaw(userFormData.value)
      params.action = action.value
      const res = await userCreate(params)
      console.log(res)
      if (res) {
        ElMessage.success(res.msg)
      }
      // 重新获取用户列表
      getUsersList()
      // 调用关闭弹窗操作
      handleClose()
    } else {
      return false
    }
  })
}
// 定义当前操作类型

// 用户编辑操作
const hangleEdit = (row) => {
  action.value = 'edit'
  isShowDialog.value = true
  // 等弹窗框出来后，在进行渲染
  nextTick(() => {
    Object.assign(userFormData.value, row)
  })
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
      justify-content: flex-end;
    }
  }
}
:deep(.el-overlay) {
  z-index: 2003 !important;
}
</style>

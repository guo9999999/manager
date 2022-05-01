<template>
  <div class="role-con">
    <!-- 搜索 -->
    <el-card class="search-menu">
      <el-form :inline="true" :model="roleData" ref="searchRef">
        <!-- 角色名称 -->
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="roleData.roleName"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 表格内容 -->
    <el-card class="role-list">
      <!-- 操作 -->
      <div class="action">
        <el-button type="primary" @click="handleAdd" v-has="'role-create'"
          >创建</el-button
        >
      </div>
      <!-- 表格 -->
      <el-table :data="tableData" style="width: 100%">
        <el-table-column
          v-for="item in columnData"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        ></el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" width="220">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleEdit(scope.row)"
              v-has="'role-edit'"
              >编辑</el-button
            >
            <el-button
              type="primary"
              size="small"
              @click="handlePermission(scope.row)"
              >设置权限</el-button
            >
            <el-button
              type="danger"
              size="small"
              @click="handleDel(scope.row._id)"
              v-has="'role-delete'"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 弹出添加表单 -->
    <el-dialog
      v-model="isShowDialog"
      :title="action === 'edit' ? '角色修改' : '角色新增'"
      @close="handleClose"
    >
      <el-form
        :model="roleFormData"
        ref="roleFormRef"
        :rules="roleRules"
        label-width="80px"
      >
        <!-- 角色名称 -->
        <el-form-item label="角色名称" prop="roleName">
          <el-input
            v-model="roleFormData.roleName"
            placeholder="请输入角色名称"
          ></el-input>
        </el-form-item>

        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="roleFormData.remark"
            placeholder="请输入备注信息"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSumbit">{{
            action === 'edit' ? '修改' : '新增'
          }}</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 设置权限 -->
    <el-dialog v-model="isShowPermission" title="设置权限">
      <el-form>
        <el-form-item label="角色名称"> {{ rolePermissionName }} </el-form-item>
        <el-form-item label="选择权限">
          <el-tree
            ref="permissionTree"
            :data="menuData"
            show-checkbox
            default-expand-all
            node-key="_id"
            :props="{
              children: 'children',
              label: 'menuName'
            }"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handlePermissionClose">取消</el-button>
          <el-button type="primary" @click="handlePermissionSumbit"
            >确定</el-button
          >
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { roleList, roleOperate, menuList, rolesPermission } from '@/api/sys.js'
import { ElMessage } from 'element-plus'
import util from '../../utils/util.js'

// 角色搜索框数据
const roleData = ref({
  roleName: ''
})
const tableData = ref([])
// 获取角色列表信息
const getRoleList = async () => {
  let params = roleData.value
  const res = await roleList(params)
  tableData.value = res
}
onMounted(() => {
  getRoleList()
  getMenuList()
})

// 查询
const handleQuery = () => {
  getRoleList()
}
// 重置
const searchRef = ref(null)
const handleReset = () => {
  searchRef.value.resetFields()
}

// 表格头部信息
const columnData = ref([
  {
    prop: 'roleName',
    label: '角色名称'
  },
  {
    prop: 'remark',
    label: '备注'
  },
  {
    prop: 'permissionList',
    label: '权限列表',
    formatter: (row, column, value) => {
      let roleArr = []
      let list = value.halfCheckedKeys || []
      list.forEach((item) => {
        let name = MenuMap.value[item]
        if (item && name) roleArr.push(name)
      })
      return roleArr.join(' , ')
    }
  },
  {
    prop: 'createTime',
    label: '创建时间',
    formatter: (row, colmnu, value) => {
      return util.format(new Date(value))
    }
  }
])

// 弹出框信息
// form表单信息
const isShowDialog = ref(false) // 弹出框
const action = ref('create')
const roleFormRef = ref(null)
// 点击创建弹出添加角色框
const handleAdd = () => {
  action.value = 'create'
  isShowDialog.value = true
}
const roleFormData = ref({
  _id: '',
  roleName: '',
  remark: ''
})
const roleRules = {
  roleName: [{ required: true, message: '请输入角色名称', trigger: 'blur' }]
}
// 编辑操作
const handleEdit = (row) => {
  action.value = 'edit'
  isShowDialog.value = true
  nextTick(() => {
    let params = {
      _id: row._id,
      roleName: row.roleName,
      remark: row.remark
    }
    roleFormData.value = params
  })
}
// 删除操作
const handleDel = async (_id) => {
  let params = { _id }
  params.action = 'delete'
  const res = await roleOperate(params)
  ElMessage.success(res.msg)
  getRoleList()
}
// 提交操作
const handleSumbit = () => {
  roleFormRef.value.validate(async (valid) => {
    if (valid) {
      let params = Object.assign(roleFormData.value)
      params.action = action.value
      const res = await roleOperate(params)
      ElMessage.success(res.msg)
      getRoleList()
      handleClose()
    } else {
      return false
    }
  })
}
// 取消重置
const handleClose = () => {
  roleFormRef.value.resetFields()
  isShowDialog.value = false
}

// 设置权限
const isShowPermission = ref(false)

// 获取菜单列表
const menuData = ref([])
const MenuMap = ref({}) //菜单映射表
const getMenuList = async () => {
  menuData.value = await menuList()
  // 进行深拷贝
  let list = JSON.parse(JSON.stringify(menuData.value))
  MenuMap.value = getMenuMap(list)
}

/**
 * 创建菜单映射表
 */
const getMenuMap = (list) => {
  let listMap = {}
  const deepFun = (arr) => {
    while (arr.length) {
      let item = arr.pop() // 从最后拿出一个对象
      if (item.children && item.action) {
        //如果有children 并且有action 表示里面有按钮菜单
        listMap[item._id] = item.menuName
      } else if (item.children && !item.action) {
        // 则说明当前为一级菜单
        deepFun(item.children)
      }
    }
  }
  deepFun(list)
  return listMap
}

// 选择权限
const rolePermissionName = ref('')
const roleId = ref('')
const permissionTree = ref()
// 弹出设置权限弹窗
const handlePermission = (row) => {
  roleId.value = row._id
  rolePermissionName.value = row.roleName
  let { checkedKeys } = row.permissionList

  isShowPermission.value = true
  nextTick(() => {
    permissionTree.value.setCheckedKeys(checkedKeys)
  })
}

const handlePermissionClose = () => {
  isShowPermission.value = false
}
const handlePermissionSumbit = async () => {
  const nodeKey = permissionTree.value.getCheckedNodes()
  const halfKey = permissionTree.value.getHalfCheckedKeys()
  let checkedKeys = [] //最后一层
  let parentKeys = []
  nodeKey.map((item) => {
    if (!item.children.length) {
      checkedKeys.push(item._id)
    } else {
      parentKeys.push(item._id)
    }
  })
  let parans = {
    _id: roleId.value,
    permissionList: {
      checkedKeys,
      halfCheckedKeys: parentKeys.concat(halfKey)
    }
  }
  const res = await rolesPermission(parans)
  getRoleList()
  ElMessage.success('权限成功')
  handlePermissionClose()
}
</script>
<style lang="scss" scoped>
.role-con {
  .search-menu {
    margin-bottom: 20px;
  }
  .role-list {
    .action {
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
    }
  }
}
</style>

<template>
  <div class="menu-con">
    <!-- 搜索 -->
    <el-card class="search-menu">
      <el-form :inline="true" :model="menuData" ref="searchRef">
        <!-- 菜单名称 -->
        <el-form-item label="菜单名称" prop="menuName">
          <el-input
            v-model="menuData.menuName"
            placeholder="请输入菜单名称"
          ></el-input>
        </el-form-item>
        <!-- 菜单状态 -->
        <el-form-item label="菜单状态" prop="menuState">
          <el-select v-model="menuData.menuState">
            <el-option :value="0" label="在用"></el-option>
            <el-option :value="1" label="停用"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 表格内容 -->
    <el-card class="menu-list">
      <!-- 操作 -->
      <div class="action">
        <el-button type="primary" @click="handleAdd">创建</el-button>
      </div>
      <!-- 表格 -->
      <el-table
        :data="tableData"
        style="width: 100%"
        row-key="_id"
        :tree-props="{ children: 'children' }"
      >
        <el-table-column
          v-for="item in columnData"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :width="item.width"
          :formatter="item.formatter"
        ></el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="handleCreate(scope.row)"
              >新增</el-button
            >
            <el-button
              type="primary"
              size="small"
              @click="hangleEdit(scope.row)"
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

    <!-- 弹出添加表单 -->
    <el-dialog
      v-model="isShowDialog"
      :title="action === 'edit' ? '用户修改' : '用户新增'"
      @close="handleClose"
    >
      <el-form
        :model="menuFormData"
        ref="menuFormRef"
        :rules="menuRules"
        label-width="80px"
      >
        <!-- 父级菜单 -->
        <el-form-item label="父级菜单" prop="parentId">
          <el-cascader
            v-model="menuFormData.parentId"
            :options="tableData"
            :props="{
              checkStrictly: true,
              value: '_id',
              label: 'menuName',
              expandTrigger: 'hover'
            }"
            clearable
          />
          <span class="title">不选，则直接创建一级菜单</span>
        </el-form-item>
        <!-- 菜单类型 -->
        <el-form-item label="菜单类型" prop="menuType">
          <el-radio-group v-model="menuFormData.menuType">
            <el-radio :label="1">菜单</el-radio>
            <el-radio :label="2">按钮</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 菜单名称 -->
        <el-form-item label="菜单名称" prop="menuName">
          <el-input
            v-model="menuFormData.menuName"
            placeholder="请输入菜单名称"
          ></el-input>
        </el-form-item>
        <!-- 菜单图标 -->
        <el-form-item
          label="菜单图标"
          prop="icon"
          v-show="menuFormData.menuType === 1"
        >
          <el-input
            v-model="menuFormData.icon"
            placeholder="请输入菜单图标"
          ></el-input>
        </el-form-item>
        <!-- 路由地址 -->
        <el-form-item
          label="路由地址"
          prop="path"
          v-show="menuFormData.menuType === 1"
        >
          <el-input
            v-model="menuFormData.path"
            placeholder="请输入路由地址"
          ></el-input>
        </el-form-item>
        <!-- 权限标识 -->
        <el-form-item
          label="权限标识"
          prop="menuCode"
          v-show="menuFormData.menuType === 2"
        >
          <el-input
            v-model="menuFormData.menuCode"
            placeholder="请输入权限标识"
          ></el-input>
        </el-form-item>
        <!-- 组件路径 -->
        <el-form-item
          label="组件路径"
          prop="component"
          v-show="menuFormData.menuType === 1"
        >
          <el-input
            v-model="menuFormData.component"
            placeholder="请输入组件路径"
          ></el-input>
        </el-form-item>
        <!-- 菜单状态 -->
        <el-form-item
          label="菜单状态"
          prop="menuState"
          v-show="menuFormData.menuType === 1"
        >
          <el-radio-group v-model="menuFormData.menuState">
            <el-radio :label="0">在用</el-radio>
            <el-radio :label="1">停用</el-radio>
          </el-radio-group>
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
  </div>
</template>

<script setup>
import { onMounted, ref, nextTick } from 'vue'
import { menuList, menuOperate } from '@/api/sys.js'
import { ElMessage } from 'element-plus'
import util from '@/utils/util.js'

// 菜单搜索表单数据
const menuData = ref({
  menuName: '',
  menuState: 0
})
// 表格头部信息
const columnData = ref([
  {
    prop: 'menuName',
    label: '菜单名称'
  },
  {
    prop: 'icon',
    label: '图标'
  },
  {
    prop: 'menuType',
    label: '菜单类型',
    formatter: (row, colmnu, value) => {
      return {
        1: '菜单',
        2: '按钮'
      }[value]
    }
  },
  {
    prop: 'menuCode',
    label: '权限标识'
  },
  {
    prop: 'path',
    label: '路由地址'
  },
  {
    prop: 'component',
    label: '组件路径'
  },
  {
    prop: 'menuState',
    label: '菜单状态',
    formatter: (row, colmnu, value) => {
      return {
        0: '在用',
        1: '停用'
      }[value]
    }
  },
  {
    prop: 'createTime',
    label: '创建时间',
    width: 100,
    formatter: (row, colmnu, value) => {
      return util.format(new Date(value))
    }
  }
])
onMounted(() => {
  getMenuList()
})

// 表格内容数据
const tableData = ref([])

// 获取表单数据
const getMenuList = async () => {
  let params = Object.assign(menuData.value)

  tableData.value = await menuList(params)
  console.log(tableData.value)
}

// 查询操作
const searchRef = ref([])

const handleQuery = () => {
  getMenuList()
}

// 重置表单
const handleReset = () => {
  searchRef.value.resetFields()
}

// 定义弹出框信息
const isShowDialog = ref(false)

//定义弹窗框的表单信息
const menuFormData = ref({
  parentId: [null],
  menuType: 1,
  menuName: '',
  icon: '',
  path: '',
  component: '',
  menuCode: '',
  menuState: 0
})
// 弹出表单规则
const menuRules = ref({
  menuName: [
    {
      required: true,
      message: '请输入菜单名称',
      trigger: 'blur'
    },
    {
      min: 2,
      max: 10,
      message: '菜单名称长度应在2到10位之间',
      trigger: 'blur'
    }
  ]
})
const action = ref('create')
// 点击创建，弹出对话框
const menuFormRef = ref(null) // 当前弹出框的名字ref
const handleAdd = () => {
  action.value = 'create'
  isShowDialog.value = true
}
// 添加
const handleCreate = (row) => {
  action.value = 'create'
  isShowDialog.value = true
  nextTick(() => {
    menuFormData.value.parentId = [...row.parentId, row._id].filter(
      (item) => item
    )
    console.log(menuFormData.value.parentId)
  })
}
// 修改
const hangleEdit = (row) => {
  action.value = 'edit'
  isShowDialog.value = true
  nextTick(() => {
    Object.assign(menuFormData.value, row)
  })
}
// 删除
const handleDel = async (_id) => {
  action.value = 'delete'
  const res = await menuOperate({
    _id,
    action: action.value
  })
  getMenuList()
  ElMessage.success(res.msg)
}
// 表单提交操作
const handleSumbit = () => {
  menuFormRef.value.validate(async (valid) => {
    if (valid) {
      let params = Object.assign(menuFormData.value)
      params.action = action.value //当前是什么操作
      console.log(params)
      const res = await menuOperate(params)
      getMenuList()
      ElMessage.success(res.msg)
      handleClose()
    } else {
      return false
    }
  })
}
// 表单重置
const handleClose = () => {
  menuFormRef.value.resetFields()
  isShowDialog.value = false
}
</script>
<style lang="scss" scoped>
.menu-con {
  .search-menu {
    margin-bottom: 20px;
  }
  .menu-list {
    .action {
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
    }
  }
  .title {
    padding: 0 10px;
  }
  :deep(.el-overlay) {
    z-index: 2003 !important;
  }
}
</style>

<template>
  <div class="leave-con">
    <!-- 查询表单 -->
    <el-card class="search-card">
      <el-form :inline="true" :model="searchForm" ref="searchRef">
        <el-form-item label="审批状态" prop="applyState">
          <el-select v-model="searchForm.applyState">
            <el-option :value="0" label="全部"></el-option>
            <el-option :value="1" label="待审批"></el-option>
            <el-option :value="2" label="审批中"></el-option>
            <el-option :value="3" label="审批通过"></el-option>
            <el-option :value="4" label="审批拒绝"></el-option>
            <el-option :value="5" label="作废"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleQuery">查询</el-button>
          <el-button @click="handleReset(searchRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 列表展示数据 -->
    <el-card class="list-con">
      <!-- 表格数据 -->
      <el-table :data="tableData">
        <el-table-column
          v-for="item in columns"
          :key="item.prop"
          :prop="item.prop"
          :label="item.label"
          :formatter="item.formatter"
          :width="item.width"
        >
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button
              size="small"
              @click="handleCheck(scope.row)"
              v-if="
                scope.row.curAuditUserName == userInfoName &&
                [1, 2].includes(scope.row.applyState)
              "
              >审核</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        class="pagination"
        background
        :current-page="pager.pageNum"
        :page-sizes="[5, 10, 20]"
        :page-size="pager.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
    <!-- 审核 -->
    <el-dialog title="审核" v-model="dialogShow">
      <el-form
        label-width="120px"
        label-suffix=":"
        :model="formData"
        ref="checkForm"
        :rules="checkRules"
      >
        <el-form-item label="申请人">
          <span>{{ formData.applyUser.userName }}</span>
        </el-form-item>
        <el-form-item label="休假类型">
          <span>{{ formData.applyTypeName }}</span>
        </el-form-item>
        <el-form-item label="休假时间">
          <span>{{ formData.time }}</span>
        </el-form-item>
        <el-form-item label="休假时长">
          <span>{{ formData.leaveTime }}</span>
        </el-form-item>
        <el-form-item label="休假原因">
          <span>{{ formData.reasons }}</span>
        </el-form-item>
        <el-form-item label="审批状态">
          <span>{{ formData.applyStateName }}</span>
        </el-form-item>
        <el-form-item label="审批人">
          <span>{{ formData.curAuditUserName }}</span>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输入备注"
            v-model="formData.remark"
          ></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="handleSumbit('pass')"
            >审批通过</el-button
          >
          <el-button @click="handleSumbit('reject')">驳回</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { leaveList, leaveApprove } from '../../api/sys.js'
import util from '../../utils/util.js'

// 查询表单数据

const searchForm = ref({
  applyState: 1
})
// 当前页和每页条数
const pager = ref({
  pageNum: 1,
  pageSize: 10
})
// 总页数
const total = ref(0)
const tableData = ref([])
// 当前登录的用户名

const state = useStore()
const userInfoName = computed(() => {
  return state.getters.userInfo.userName
})
// 获取审批列表数据
const getLeaveList = async () => {
  let params = { ...searchForm.value, ...pager.value, type: 'approve' }

  const { list, page } = await leaveList(params)
  total.value = page.total
  tableData.value = list
}

//当前页
const handleCurrentChange = (current) => {
  pager.value.pageNum = current
  getLeaveList()
}
//每页条数
const handleSizeChange = (size) => {
  pager.value.pageSize = size
  getLeaveList()
}
// 查询
const searchRef = ref(null)
const handleQuery = () => {
  getLeaveList()
}
// 重置
const handleReset = (form) => {
  form.resetFields()
}
onMounted(() => {
  getLeaveList()
})

// 列表展示数据
// 表格头部信息
const columns = [
  {
    prop: 'orderNo',
    label: '单号'
  },
  {
    prop: 'orderNo',
    label: '申请人',
    formatter: (row) => {
      return row.applyUser.userName
    }
  },
  {
    prop: 'time',
    label: '休假时间',
    formatter: (row) => {
      return `${util.format(
        new Date(row.startTime),
        'yyyy-MM-dd'
      )} 到 ${util.format(new Date(row.endTime), 'yyyy-MM-dd')}`
    }
  },
  {
    prop: 'leaveTime',
    label: '休假时长'
  },
  {
    prop: 'applyType',
    label: '休假类型',
    formatter: (row, column, value) => {
      return {
        1: '事假',
        2: '调休',
        3: '年假'
      }[value]
    }
  },
  {
    prop: 'createTime',
    label: '申请时间',
    formatter: (row, column, value) => {
      return util.format(new Date(value))
    },
    width: 100
  },
  {
    prop: 'auditUsers',
    label: '审批人'
  },
  {
    prop: 'curAuditUserName',
    label: '当前审批人'
  },
  {
    prop: 'applyState',
    label: '审批状态',
    formatter: (row, column, value) => {
      return {
        1: '待审批',
        2: '审批中',
        3: '审批通过',
        4: '审批拒绝',
        5: '作废'
      }[value]
    }
  }
]
// 审核弹出框
const dialogShow = ref(false)
const formData = ref({
  remark: ''
})
// 审核
const handleCheck = (row) => {
  dialogShow.value = true
  formData.value = { ...row }
  formData.value.applyTypeName = {
    1: '事假',
    2: '调休',
    3: '年假'
  }[formData.value.applyType]
  // 休假时间
  formData.value.time = `${util.format(
    new Date(row.startTime),
    'yyyy-MM-dd'
  )} 到 ${util.format(new Date(row.endTime), 'yyyy-MM-dd')}`
  formData.value.applyStateName = {
    1: '待审批',
    2: '审批中',
    3: '审批通过',
    4: '审批拒绝',
    5: '作废'
  }[formData.value.applyState]
}

const checkRules = {
  remark: [{ required: true, message: '请输入备注内容', trigger: 'blur' }]
}
// 提交审批
const checkForm = ref(null)
const handleSumbit = (action) => {
  checkForm.value.validate(async (valid) => {
    if (valid) {
      let params = {
        action,
        remark: formData.value.remark,
        _id: formData.value._id
      }
      const res = await leaveApprove(params)
      getLeaveList()
      state.commit('user/setBadgeCount', state.getters.badgeCount - 1)
      dialogShow.value = false
      ElMessage.success(res.msg)
    }
  })
}
</script>
<style lang="scss" scoped>
.leave-con {
  .search-card {
    margin-bottom: 20px;
  }
  .pagination {
    display: flex;
    justify-content: center;
    padding: 20px 0;
  }
  .text-center {
    text-align: center;
  }

  :deep(.el-date-editor) {
    .el-input__inner {
      padding-left: 35px !important;
    }
  }
  :deep(.el-overlay) {
    z-index: 2003 !important;
  }
}
</style>

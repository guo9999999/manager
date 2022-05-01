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
      <!-- 操作区域 -->
      <div class="action">
        <el-button type="primary" @click="handleCreate">申请休假</el-button>
      </div>
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
        <el-table-column label="操作" width="150">
          <template #default="scope">
            <el-button size="small" @click="handleEdit(scope.row)"
              >查看</el-button
            >
            <el-button
              size="small"
              type="danger"
              @click="handleDelete(scope.row._id)"
              v-if="[1, 2].includes(scope.row.applyState)"
              >作废</el-button
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

    <!-- 添加休假弹出框 -->
    <el-dialog title="申请休假" v-model="dialogVisible" @close="handleClose">
      <el-form
        :model="leaveForm"
        :rules="leaveRules"
        ref="leaveRef"
        label-width="120px"
      >
        <!-- 休假类型 -->
        <el-form-item label="休假类型" prop="applyType" required>
          <el-select v-model="leaveForm.applyType">
            <el-option :value="1" label="事假"></el-option>
            <el-option :value="2" label="调休"></el-option>
            <el-option :value="3" label="年假"></el-option>
          </el-select>
        </el-form-item>

        <!-- 休假时间 -->
        <el-form-item label="休假时间" required>
          <el-col :span="8">
            <el-form-item prop="startTime">
              <el-date-picker
                v-model="leaveForm.startTime"
                type="date"
                placeholder="选择开始时间"
                @change="(val) => handleChange('startTime', val)"
              />
            </el-form-item>
          </el-col>
          <el-col class="text-center" :span="1">
            <span class="text-gray-500">-</span>
          </el-col>
          <el-col :span="8">
            <el-form-item prop="endTime">
              <el-date-picker
                v-model="leaveForm.endTime"
                type="date"
                placeholder="选择结束时间"
                @change="(val) => handleChange('endTime', val)"
              />
            </el-form-item>
          </el-col>
        </el-form-item>
        <!-- 休假时长 -->
        <el-form-item label="休假时长">
          <span>{{ leaveForm.leaveTime }}</span>
        </el-form-item>
        <el-form-item label="休假原因" prop="reasons" required>
          <el-input v-model="leaveForm.reasons" type="textarea" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">申请</el-button>
        </span>
      </template>
    </el-dialog>

    <el-dialog title="休假详情" v-model="dialogShow">
      <el-steps
        :active="formData.applyState > 2 ? 3 : formData.applyState"
        align-center
      >
        <el-step title="待审批" />
        <el-step title="审批中" />
        <el-step title="审批通过/审批拒绝" />
      </el-steps>
      <el-form label-width="120px" label-suffix=":">
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
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogShow = false">取消</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { onMounted, ref } from 'vue'
import { leaveList, leaveOperate } from '../../api/sys.js'
import util from '../../utils/util.js'

// 查询表单数据

const searchForm = ref({
  applyState: 0
})
// 当前页和每页条数
const pager = ref({
  pageNum: 1,
  pageSize: 10
})
// 总页数
const total = ref(0)
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

// 列表展示数据
// 表格头部信息
const columns = [
  {
    prop: 'orderNo',
    label: '单号'
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
// 获取审批列表
const tableData = ref([]) //表格数据
const getLeaveList = async () => {
  let params = { ...searchForm.value, ...pager.value }
  const { list, page } = await leaveList(params)
  total.value = page.total
  tableData.value = list
}
// 调用获取审批方法
onMounted(() => {
  getLeaveList()
})

// 弹出对话框
const dialogVisible = ref(false)
const action = ref('create') //当前操作的类型
const dialogShow = ref(false) //休假详情弹出框

// 弹出框表单数据
const leaveForm = ref({
  applyType: 1, //休假类型
  startTime: '',
  endTime: '',
  leaveTime: '0天',
  reasons: ''
})

const leaveRules = ref({
  startTime: [
    { type: 'date', required: true, message: '请选择开始时间', trigger: 'blur' }
  ],
  endTime: [
    { type: 'date', required: true, message: '请选择结束时间', trigger: 'blur' }
  ],
  reasons: [{ required: true, message: '请填写原因', trigger: 'blur' }]
})
//选择时间
const handleChange = (keys, val) => {
  let { startTime, endTime } = leaveForm.value
  if (!startTime || !endTime) return
  if (startTime > endTime) {
    ElMessage.warning('开始时间不能晚于结束时间')
    leaveForm.value.leaveTime = '0天'
    leaveForm.value[keys] = ''
  } else {
    leaveForm.value.leaveTime =
      (endTime - startTime) / (24 * 3600 * 1000) + 1 + '天'
  }
}
const leaveRef = ref(null)
//添加
const handleCreate = () => {
  action.value = 'create'
  dialogVisible.value = true
}

const handleClose = () => {
  dialogVisible.value = false
  handleReset(leaveRef.value)
}

const formData = ref({}) //休假详情数据
// 查看
const handleEdit = (row) => {
  dialogShow.value = true
  formData.value = { ...row }
  formData.value.applyTypeName = {
    1: '事假',
    2: '调休',
    3: '年假'
  }[formData.value.applyType]
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
// 作废
const handleDelete = async (_id) => {
  let params = { _id, action: 'delete' }
  try {
    const res = await leaveOperate(params)
    ElMessage.success(res.msg)
    getLeaveList()
  } catch (error) {
    ElMessage.success(error.message)
  }
}

// 提交
const handleSubmit = () => {
  leaveRef.value.validate(async (valid) => {
    if (valid) {
      let params = { ...leaveForm.value, action: action.value }
      const res = await leaveOperate(params)
      ElMessage.success(res.msg)
      getLeaveList()
      handleClose()
    }
  })
}
</script>
<style lang="scss" scoped>
.leave-con {
  .search-card {
    margin-bottom: 20px;
  }
  .list-con {
    .action {
      padding-bottom: 20px;
      border-bottom: 1px solid #eee;
    }
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

declare interface BaseSysDepartmentEntity {
  /**
   * ID
   */
  id?: number;
  /**
   * 部门名称
   */
  name?: string;
  /**
   * 上级部门ID
   */
  parentId?: BigInt;
  /**
   * 排序
   */
  orderNum?: number;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 更新时间
   */
  updateTime?: Date;
  /**
   * 任意键值
   */
  [key: string]: any;
}

declare interface BaseSysLogEntity {
  /**
   * ID
   */
  id?: number;
  /**
   * 用户ID
   */
  userId?: BigInt;
  /**
   * 行为
   */
  action?: string;
  /**
   * ip
   */
  ip?: string;
  /**
   * ip地址
   */
  ipAddr?: string;
  /**
   * 参数
   */
  params?: string;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 更新时间
   */
  updateTime?: Date;
  /**
   * 任意键值
   */
  [key: string]: any;
}

declare interface BaseSysMenuEntity {
  /**
   * ID
   */
  id?: number;
  /**
   * 父菜单ID
   */
  parentId?: BigInt;
  /**
   * 菜单名称
   */
  name?: string;
  /**
   * 菜单地址
   */
  router?: string;
  /**
   * 权限标识
   */
  perms?: string;
  /**
   * 类型 0：目录 1：菜单 2：按钮
   */
  type?: number;
  /**
   * 图标
   */
  icon?: string;
  /**
   * 排序
   */
  orderNum?: number;
  /**
   * 视图地址
   */
  viewPath?: string;
  /**
   * 路由缓存
   */
  keepAlive?: boolean;
  /**
   * 是否显示
   */
  isShow?: boolean;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 更新时间
   */
  updateTime?: Date;
  /**
   * 任意键值
   */
  [key: string]: any;
}

declare interface BaseSysParamEntity {
  /**
   * ID
   */
  id?: number;
  /**
   * 键位
   */
  keyName?: string;
  /**
   * 名称
   */
  name?: string;
  /**
   * 数据
   */
  data?: string;
  /**
   * 数据类型 0:字符串 1：数组 2：键值对
   */
  dataType?: number;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 更新时间
   */
  updateTime?: Date;
  /**
   * 任意键值
   */
  [key: string]: any;
}

declare interface BaseSysRoleEntity {
  /**
   * ID
   */
  id?: number;
  /**
   * 用户ID
   */
  userId?: string;
  /**
   * 名称
   */
  name?: string;
  /**
   * 角色标签
   */
  label?: string;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 数据权限是否关联上下级
   */
  relevance?: number;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 更新时间
   */
  updateTime?: Date;
  /**
   * 任意键值
   */
  [key: string]: any;
}

declare interface BaseSysUserEntity {
  /**
   * ID
   */
  id?: number;
  /**
   * 部门ID
   */
  departmentId?: BigInt;
  /**
   * 姓名
   */
  name?: string;
  /**
   * 用户名
   */
  username?: string;
  /**
   * 密码
   */
  password?: string;
  /**
   * 密码版本, 作用是改完密码，让原来的token失效
   */
  passwordV?: number;
  /**
   * 昵称
   */
  nickName?: string;
  /**
   * 头像
   */
  headImg?: string;
  /**
   * 手机
   */
  phone?: string;
  /**
   * 邮箱
   */
  email?: string;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 状态 0:禁用 1：启用
   */
  status?: boolean;
  /**
   * socketId
   */
  socketId?: string;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 更新时间
   */
  updateTime?: Date;
  /**
   * 任意键值
   */
  [key: string]: any;
}

declare interface DemoGoodsEntity {
  /**
   * ID
   */
  id?: number;
  /**
   * 标题
   */
  title?: string;
  /**
   * 图片
   */
  pic?: string;
  /**
   * 价格
   */
  price?: number;
  /**
   * 分类
   */
  type?: number;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 更新时间
   */
  updateTime?: Date;
  /**
   * 任意键值
   */
  [key: string]: any;
}

declare interface SpaceInfoEntity {
  /**
   * ID
   */
  id?: number;
  /**
   * 地址
   */
  url?: string;
  /**
   * 类型
   */
  type?: string;
  /**
   * 分类ID
   */
  classifyId?: BigInt;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 更新时间
   */
  updateTime?: Date;
  /**
   * 任意键值
   */
  [key: string]: any;
}

declare interface SpaceTypeEntity {
  /**
   * ID
   */
  id?: number;
  /**
   * 类别名称
   */
  name?: string;
  /**
   * 父分类ID
   */
  parentId?: number;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 更新时间
   */
  updateTime?: Date;
  /**
   * 任意键值
   */
  [key: string]: any;
}

declare interface SysAdminModel {
  /**
   * ID
   */
  id?: number;
  /**
   * 租户ID
   */
  tenantId?: BigInt;
  /**
   * 账号
   */
  username?: string;
  /**
   * 密码
   */
  password?: string;
  /**
   * 密码版本, 作用是改完密码，让原来的token失效
   */
  passwordV?: number;
  /**
   * 昵称
   */
  nickName?: string;
  /**
   * 组织ID
   */
  orgId?: BigInt;
  /**
   * 岗位ID
   */
  stationId?: BigInt;
  /**
   * 是否内置
   */
  readonly?: number;
  /**
   * 邮箱
   */
  email?: string;
  /**
   * 手机
   */
  mobile?: string;
  /**
   * 身份证
   */
  idCard?: string;
  /**
 * 性别
#Sex{2:女;1:男;0:未知}
 */
  sex?: number;
  /**
 * 状态 
1启用 0禁用
 */
  status?: boolean;
  /**
   * 头像
   */
  avatar?: string;
  /**
   * 描述
   */
  description?: string;
  /**
   * 民族
   */
  nation?: string;
  /**
   * 学历
   */
  education?: string;
  /**
   * 职位状态
   */
  positionStatus?: string;
  /**
   * 生日
   */
  birthday?: Date;
  /**
   * 创建人id
   */
  createdBy?: BigInt;
  /**
   * socketId
   */
  socketId?: string;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 更新时间
   */
  updateTime?: Date;
  /**
   * 任意键值
   */
  [key: string]: any;
}

declare interface SysDictModel {
  /**
   * ID
   */
  id?: number;
  /**
 * 编码
一颗树仅仅有一个统一的编码
 */
  code?: string;
  /**
   * 名称
   */
  name?: string;
  /**
   * 描述
   */
  description?: string;
  /**
   * 状态
   */
  status?: boolean;
  /**
   * 内置角色
   */
  readonly?: number;
  /**
   * 排序
   */
  orderNum?: number;
  /**
   * 创建人id
   */
  userId?: BigInt;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 更新时间
   */
  updateTime?: Date;
  /**
   * 任意键值
   */
  [key: string]: any;
}

declare interface SysDictItemModel {
  /**
   * ID
   */
  id?: number;
  /**
   * 类型ID
   */
  dictionaryId?: BigInt;
  /**
   * 类型
   */
  dictionaryCode?: string;
  /**
   * 编码
   */
  value?: string;
  /**
   * 名称
   */
  label?: string;
  /**
   * 状态
   */
  status?: boolean;
  /**
   * 颜色
   */
  color?: string;
  /**
   * 描述
   */
  description?: string;
  /**
   * 排序
   */
  orderNum?: number;
  /**
   * 创建人id
   */
  userId?: BigInt;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 更新时间
   */
  updateTime?: Date;
  /**
   * 任意键值
   */
  [key: string]: any;
}

declare interface SysMenuModel {
  /**
   * ID
   */
  id?: number;
  /**
   * 名称
   */
  label?: string;
  /**
   * 该节点的所有父节点
   */
  treePath?: string;
  /**
   * 权限
   */
  permission?: string;
  /**
   * 父级菜单ID
   */
  parentId?: BigInt;
  /**
   * 路径
   */
  path?: string;
  /**
   * 绑定的数据库实体名称
   */
  entity?: string;
  /**
   * 组件
   */
  component?: string;
  /**
   * 排序
   */
  orderNum?: BigInt;
  /**
   * 菜单图标
   */
  icon?: string;
  /**
   * 样式
   */
  style?: string;
  /**
   * 菜单类型|1:菜单;2:按钮
   */
  type?: number;
  /**
   * 1=启用;0=禁用
   */
  status?: boolean;
  /**
   * 内置菜单
   */
  readonly?: number;
  /**
   * 公共授权|是指无需分配所有人就可以访问的
   */
  global?: number;
  /**
   * 0=隐藏;1=显示
   */
  display?: number;
  /**
   * 描述
   */
  description?: string;
  /**
   * 创建人id
   */
  userId?: BigInt;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 更新时间
   */
  updateTime?: Date;
  /**
   * 任意键值
   */
  [key: string]: any;
}

declare interface SysOrgModel {
  /**
   * ID
   */
  id?: number;
  /**
   * 名称
   */
  label?: string;
  /**
   * 租户ID
   */
  tenantId?: BigInt;
  /**
   * 简称
   */
  alias?: string;
  /**
   * 联系方式
   */
  tel?: string;
  /**
   * 所有父级ID
   */
  treePath?: string;
  /**
   * 父ID
   */
  parentId?: BigInt;
  /**
   * 排序
   */
  orderNum?: number;
  /**
   * 状态
   */
  status?: boolean;
  /**
   * 描述
   */
  description?: string;
  /**
   * 创建人id
   */
  userId?: BigInt;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 更新时间
   */
  updateTime?: Date;
  /**
   * 任意键值
   */
  [key: string]: any;
}

declare interface SysRoleModel {
  /**
   * ID
   */
  id?: number;
  /**
   * 租户编码
   */
  tenantId?: number;
  /**
   * 角色编码
   */
  code?: string;
  /**
   * 名称
   */
  name?: string;
  /**
   * 描述信息
   */
  description?: string;
  /**
   * 数据权限范围，值越大，权限越大
   */
  scopeType?: number;
  /**
   * 1=正常0=禁用
   */
  status?: boolean;
  /**
   * 0=非 1=管理员
   */
  super?: number;
  /**
   * 是否内置角色
   */
  readonly?: number;
  /**
   * 创建人id
   */
  userId?: BigInt;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 更新时间
   */
  updateTime?: Date;
  /**
   * 任意键值
   */
  [key: string]: any;
}

declare interface SysStationModel {
  /**
   * ID
   */
  id?: number;
  /**
   * 租户ID
   */
  tenantId?: BigInt;
  /**
   * 名称
   */
  name?: string;
  /**
   * 编码
   */
  code?: string;
  /**
   * 类型
   */
  type?: number;
  /**
   * 排序
   */
  orderNum?: BigInt;
  /**
   * 组织ID
   */
  orgId?: BigInt;
  /**
   * 状态
   */
  status?: boolean;
  /**
   * 描述
   */
  description?: string;
  /**
   * 创建者ID
   */
  userId?: BigInt;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 更新时间
   */
  updateTime?: Date;
  /**
   * 任意键值
   */
  [key: string]: any;
}

declare interface TaskInfoEntity {
  /**
   * ID
   */
  id?: number;
  /**
   * 任务ID
   */
  jobId?: string;
  /**
   * 任务配置
   */
  repeatConf?: string;
  /**
   * 名称
   */
  name?: string;
  /**
   * cron
   */
  cron?: string;
  /**
   * 最大执行次数 不传为无限次
   */
  limit?: number;
  /**
   * 每间隔多少毫秒执行一次 如果cron设置了 这项设置就无效
   */
  every?: number;
  /**
   * 备注
   */
  remark?: string;
  /**
   * 状态 0:停止 1：运行
   */
  status?: boolean;
  /**
   * 开始时间
   */
  startDate?: Date;
  /**
   * 结束时间
   */
  endDate?: Date;
  /**
   * 数据
   */
  data?: string;
  /**
   * 执行的service实例ID
   */
  service?: string;
  /**
   * 状态 0:系统 1：用户
   */
  type?: number;
  /**
   * 下一次执行时间
   */
  nextRunTime?: Date;
  /**
   * 状态 0:cron 1：时间间隔
   */
  taskType?: number;
  /**
   * 创建时间
   */
  createTime?: Date;
  /**
   * 更新时间
   */
  updateTime?: Date;
  /**
   * 任意键值
   */
  [key: string]: any;
}

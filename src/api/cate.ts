import { request } from '@/utils/request.ts'
import type { CateItem, PageModelResult, PagesBrandResult, PhoneBrand } from '@/types/CateItem.ts'
import type { addResult, delResult, updateResult } from '@/types/Gobal'

/**
 * 分类获取
 * /cate/get
 */
export const cateGetApi = () => {
  return request<CateItem[]>({
    method: 'GET',
    url: '/cate/get'
  })
}

/**
 * 根据分类id更新分类
 * @param cateId - 分类id
 * @param cateName - 分类名称
 */
export const cateUpdateApi = (cateId: string, cateName: string) => {
  return request<updateResult>({
    method: 'POST',
    url: '/cate/update',
    data: { cateId, cateName }
  })
}

/**
 * 新增类型分类
 * @param name - 分类名称
 */
export const cateAddApi = (name: string) => {
  return request<addResult>({
    method: 'POST',
    url: '/cate/add',
    data: { name }
  })
}

/**
 * 根据分类id删除分类
 * /cate/del
 * @param cateId - 当前分类id
 */
export const cateDeleteApi = (cateId: string) => {
  return request<delResult>({
    method: 'POST',
    url: '/cate/del',
    data: { cateId }
  })
}

/**
 * 管理员获取手机品牌列表 - 带分页
 * /cate/phone/adminGet
 * @param pageNum - 页码
 * @param pageSize - 条数
 * @param pageType - 分页类型，如果不传就是按分页请求，如果传了 true 就是请求所有数据
 */
export function phoneBrandPageGetApi(pageNum?: number, pageSize?: number, pageType?: boolean) {
  return request<PagesBrandResult>({
    method: 'GET',
    url: '/cate/phone/adminGet',
    params: { pageNum, pageSize, pageType }
  })
}

/**
 * 管理员获取手机品牌列表 - 不带分页
 * /cate/phone/adminGet
 * @param pageType - 分页类型，如果不传就是按分页请求，如果传了 true 就是请求所有数据
 */
export function phoneBrandGetApi(pageType?: boolean) {
  return request<PhoneBrand[]>({
    method: 'GET',
    url: '/cate/phone/adminGet',
    params: { pageType }
  })
}

/**
 * 管理员添加手机品牌
 * /cate/phone/add
 * @param name
 * @param parent_id
 * @param parent_name
 */
export const phoneBrandAddApi = (name: string, parent_id: string, parent_name: string) => {
  return request<addResult>({
    method: 'POST',
    url: '/cate/phone/add',
    data: { name, parent_id, parent_name }
  })
}

/**
 * 管理员根据品牌id更新品牌信息
 * /cate/phone/adminUpdate
 * @param brandId
 * @param name
 * @param parent_id
 * @param parent_name
 */
export const phoneBrandUpdateApi = (
  brandId: string,
  name: string,
  parent_id: string,
  parent_name: string
) => {
  return request<updateResult>({
    method: 'POST',
    url: '/cate/phone/adminUpdate',
    data: { brandId, name, parent_id, parent_name }
  })
}

/**
 * 管理员根据品牌ID删除品牌信息
 * /cate/phone/adminDel
 * @param brandId
 */
export const phoneBrandDeleteApi = (brandId: string) => {
  return request<delResult>({
    method: 'POST',
    url: '/cate/phone/adminDel',
    data: { brandId }
  })
}

/**
 * 管理员根据手机品牌id，获取对应的手机型号
 * /cate/brandmodel/adminGet
 * @param parent_id
 * @param pageNum
 * @param pageSize
 */
export const phoneModelGetApi = (
  parent_id?: string,
  pageNum?: number,
  pageSize?: number,
  pageType?: boolean
) => {
  return request<PageModelResult>({
    method: 'GET',
    url: '/cate/brandmodel/adminGet',
    params: { parent_id, pageNum, pageSize, pageType }
  })
}

/**
 * 管理员新增手机类型
 * /cate/brandmodel/add
 * @param name
 * @param parent_id
 * @param parent_name
 */
export const phoneModelAddApi = (name: string, parent_id: string, parent_name: string) => {
  return request<addResult>({
    method: 'POST',
    url: '/cate/brandmodel/add',
    data: { name, parent_id, parent_name }
  })
}

/**
 * 管理员根据手机类型id更新手机类型信息
 * /cate/brandmodel/adminUpdate
 * @param phoneTypeId - 类型id
 * @param name - 类型名称
 * @param parent_id - 所属品牌id
 * @param parent_name - 所属品牌名称
 */
export const phoneModelUpdateApi = (
  phoneTypeId: string,
  name: string,
  parent_id: string,
  parent_name: string
) => {
  return request<updateResult>({
    method: 'POST',
    url: '/cate/brandmodel/adminUpdate',
    data: { phoneTypeId, name, parent_id, parent_name }
  })
}

/**
 * 管理员删除手机型号
 * /cate/brandmodel/adminDel
 * @param phoneTypeId - 当前型号id
 */
export const phoneModelDeleteApi = (phoneTypeId: string) => {
  return request<delResult>({
    method: 'POST',
    url: '/cate/brandmodel/adminDel',
    data: { phoneTypeId }
  })
}

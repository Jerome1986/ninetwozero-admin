import { request } from '@/utils/request.ts'
import type { pagesStoreResult } from '@/types/StoreItem'
import type { addResult, delResult, updateResult } from '@/types/Gobal'

/**
 * 管理员获取所有的门店列表
 * /store/get
 * @param token - 管理员凭证
 * @param pageNum - 当前页
 * @param pageSize - 每页条数
 */
export const storeGetApi = (token: string, pageNum: number, pageSize: number) => {
  return request<pagesStoreResult>({
    method: 'GET',
    url: '/store/get',
    headers: {
      Authorization: 'Bearer ' + token
    },
    params: { pageNum, pageSize }
  })
}

/**
 * 管理员添加门店
 * /store/add
 * @param name - 门店名称
 * @param address - 门店地址
 * @param managerName - 店长名字
 * @param phone - 门店电话
 * @param status - 门店状态
 */
export const storeAddApi = (
  name: string,
  address: string,
  managerName: string,
  phone: string,
  status: 'active' | 'inactive'
) => {
  return request<addResult>({
    method: 'POST',
    url: '/store/add',
    data: { name, address, managerName, phone, status }
  })
}

/**
 * 删除当前门店
 * /store/del
 * @param token - 管理员凭证
 * @param storeId - 门店ID
 * @param managerId - 店长ID
 */
export const storeDeleteApi = (token: string, storeId: string, managerId: string) => {
  return request<delResult>({
    method: 'POST',
    url: '/store/del',
    headers: {
      Authorization: 'Bearer ' + token
    },
    data: { storeId, managerId }
  })
}

/**
 * 根据门店id和店长id 更新门店信息
 * /store/updateInfo
 * @param storeId - 门店id
 * @param managerId - 店长id
 * @param name - 门店名称
 * @param address - 门店地址
 * @param managerName - 店长姓名
 * @param phone - 门店电话
 * @param status - 门店状态
 */
export const storeUpdateApi = (
  storeId: string,
  managerId: string,
  name: string,
  address: string,
  managerName: string,
  phone: string,
  status: 'active' | 'inactive'
) => {
  return request<updateResult>({
    method: 'POST',
    url: '/store/updateInfo',
    headers: {},
    data: { storeId, managerId, name, address, managerName, phone, status }
  })
}

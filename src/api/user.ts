import { request } from '@/utils/request.ts'
import type { pagesUserResult, SearchResult } from '@/types/UserItem'
import type { delResult, updateResult } from '@/types/Gobal'

/**
 * 获取角色来获取用户
 * /user/ordinary
 * @param token - 管理员凭证
 * @param pageNum - 页码
 * @param pageSize - 条数
 * @param role - 用户角色
 */
export const userGetApi = (token: string, pageNum: number, pageSize: number, role: string) => {
  return request<pagesUserResult>({
    method: 'GET',
    url: '/user/ordinary',
    headers: {
      Authorization: 'Bearer ' + token
    },
    params: {
      pageNum,
      pageSize,
      role
    }
  })
}

/**
 * 根据用户id删除用户
 * @param token - 管理员凭证
 * @param userId - 当前要删除的用户id
 */
export const delUserApi = (token: string, userId: string) => {
  return request<delResult>({
    method: 'POST',
    url: '/user/del',
    headers: {
      Authorization: 'Bearer ' + token
    },
    data: { userId }
  })
}

/**
 * 根据用户id更新用户信息
 * /user/adminUpdate
 * @param token - 管理员凭证
 * @param userId - 当前操作用户id
 * @param gender - 性别
 * @param role - 角色
 * @param inviterCode - 上级邀请码
 * @param status - 账号状态
 */
export const updateUserApi = (
  token: string,
  userId: string,
  gender: number,
  role: string,
  inviterCode: string,
  status: 'active' | 'inactive'
) => {
  return request<updateResult>({
    method: 'POST',
    url: '/user/adminUpdate',
    headers: {
      Authorization: 'Bearer ' + token
    },
    data: { userId, gender, role, inviterCode, status }
  })
}

/**
 * 根据用户手机号码搜索用户信息
 * @param token
 * @param searchVal - 搜索值
 * @param role - 用户角色
 */
export const searchUserApi = (token: string, searchVal: string, role: string) => {
  return request<SearchResult>({
    method: 'POST',
    url: '/user/search',
    headers: {
      Authorization: 'Bearer ' + token
    },
    data: { searchVal, role }
  })
}

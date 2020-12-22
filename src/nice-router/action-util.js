/**
 * Action 属性
 *  id, //一般用来做来循环的唯一key
 *  title, 用于button的展示
 *  code, 语义化id
 *  imageToUrl, // icon和imageUrl, imageUrl优先
 *  icon, // icon和imageUrl, imageUrl优先
 *  linkToUrl,  //支持h5，page://, request请求
 *  confirm, //如果不为空，则在点击后弹出confirm的popup
 *  statInPage , //true为Ajax
 *  params = {}, //用来构造请求参数的列表
 *  asForm,//用form的形式来提交数据, 说白了就是，提交以form的形式提交一个字段，供后台使用: formData=JSON.stringify(params)
 *  arrayMerge = 'replace', // dva model merge的时候，数组如何处理
 *  onSuccess = noop, // onSuccess的回调
 *  loading,  // 怎么处理loading，需要设置为LoadingType
 *  navigationOptions,  // Taro 在做页面跳转时候的option参数，例如  navigationOptions: { method: 'redirectTo' },
 *  effectAction // action还能指定获得结果后，触发哪个effect
 *  stateAction  // action还能指定获得结果后，触发哪个state
 */
import { isEmpty, isNotEmpty } from '@/nice-router/nice-router-util'
import _ from 'lodash'

const SUBMIT_CODE_LIST = ['nextStep', 'commit', 'next', 'nextRecord']

const getActionUri = (action) => {
  let result = action
  if (_.isObject(action)) {
    const { linkToUrl, uri } = action
    result = linkToUrl || uri
  }
  return result || ''
}
const isActionLike = (action) => {
  if (_.isFunction(_.get(action, 'onClick'))) {
    return true
  }

  if (_.isFunction(_.get(action, 'onChange'))) {
    return true
  }

  return isNotEmpty(getActionUri(action))
}

const trans2Action = (routerAction = {}) => {
  const { action, ...others } = routerAction
  const linkToUrl = getActionUri(action)
  const tmp = _.isObject(action) ? action : {}
  return {
    ...others,
    ...tmp,
    linkToUrl,
  }
}

const getConfirmContent = (action = {}) => {
  return action.confirm
}

const isSubmitAction = (action = '') => {
  const theCode = (action?.code || action || '').toLowerCase()
  if (isEmpty(theCode)) {
    return false
  }
  if (theCode.startsWith('submit')) {
    return true
  }

  const result = _.find(SUBMIT_CODE_LIST, (it) => it.toLowerCase() === theCode)

  return isNotEmpty(result)
}

const ActionUtil = {
  getActionUri,
  isActionLike,
  trans2Action,
  getConfirmContent,
  isSubmitAction,
}

export default ActionUtil

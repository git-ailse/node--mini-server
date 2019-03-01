/**
 * 登录接口
 */

const ensure = require('../utils/ensure')

module.exports = async (req) => {

  ensure(req.query.hos_id, '医院ID不能为空')
  // ensure(req.query.dept_id, '科室不能为空')
  // ensure(req.query.pat_id, '患者ID不能为空')

  function someAweSomeFunction (foo, bar) {
    ensure(typeof foo === 'number', 'foo必须为数字', 500)
    ensure(foo > bar, 'foo必须大于bar', 500)
    // .... some logic
  }

  someAweSomeFunction(1, 2)

  return { a: 1 }

}


/**
 * 在这里定义和用户相关的路由处理函数，供 /router/user.js 模块进行调用
 */

// 导入数据库操作模块
const db = require('../db/index')
// 导入对密码进行加密处理的包
const bcrypt = require('bcryptjs')
// 用这个包来生成 Token 字符串
const jwt = require('jsonwebtoken')
// 导入全局的配置文件
const config = require('../config')

// 注册用户的处理函数
exports.regUser = (req, res) => {
  // 获取客户端提交到服务器端的用户信息，即接收表单数据
  const userinfo = req.body
  // 对表单中的数据，进行合法性校验
  if (!userinfo.username || !userinfo.password) {
    // return res.send({ status: 1, message: '用户名或密码不能为空！' })
    return res.cc('用户名或密码不能为空！')
  }
  // 定义查询的SQL语句
  const sql = `select * from ev_users where username=?`
  // 执行SQL语句，并根据结果判断用户名是否被占用
  db.query(sql, userinfo.username, function (err, results) {
    // 执行 SQL 语句失败
    if (err) {
      // return res.send({ status: 1, message: err.message })
      return res.cc(err)
    }
    // 用户名被占用
    if (results.length > 0) {
      // return res.send({ status: 1, message: '用户名被占用，请更换其他用户名！' })
      return res.cc('用户名被占用，请更换其他用户名！')
    }
    // 调用bcrypt.hashSync(明文密码, 随机盐的长度) 方法，对用户的密码进行加密处理
    userinfo.password = bcrypt.hashSync(userinfo.password, 10)
    // 定义插入用户的SQL语句
    const sql = 'insert into ev_users set ?'
    // 调用db.query()执行SQL语句，插入新用户
    db.query(sql, { username: userinfo.username, password: userinfo.password }, function (err, results) {
    // 执行 SQL语句失败
    // if (err) return res.send({ status: 1, message: err.message })
    if (err) return res.cc(err)
    // SQL语句执行成功，但影响行数不为1
    if (results.affectedRows !== 1) {
      // return res.send({ status: 1, message: '注册用户失败，请稍后再试！' })
      return res.cc('注册用户失败，请稍后再试！')
    }
    // 注册成功
    // res.send({ status: 0, message: '注册成功！' })
    res.cc('注册成功！', 0)
  })  
})
}

// 登录的处理函数
exports.login = (req, res) => {
  // 接收表单数据
  const userinfo = req.body
  // 定义SQL语句
  const sql = `select * from ev_users where username=?`
  // 执行SQL语句，查询用户的数据
  db.query(sql, userinfo.username, function (err, results) {
    // 执行SQL语句失败
    if (err) return res.cc(err)
    // 执行SQL语句成功，但是查询到数据条数不等于1
    if (results.length !== 1) return res.cc('登录失败！')
    // 判断用户输入的登录密码是否和数据库中的密码一致
    // 调用bcrypt.compareSync(用户提交的密码, 数据库中的密码)方法比较密码是否一致
    const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
    // 如果对比的结果等于false，则证明用户输入的密码错误
    if (!compareResult) {
      return res.cc('登录失败！')
    }
    // 登录成功，生成Token字符串
    // 在生成Token字符串的时候，一定要剔除密码和头像的值
    // 剔除完毕之后，user 中只保留了用户的 id, username, nickname, email 这四个属性的值
    const user = { ...results[0], password: '', user_pic: '' }
    // 对用户信息对象加密生成Token字符串
    const tokenStr = jwt.sign(user, config.jwtSecretKey, { expiresIn: config.expiresIn })
    // 将生成的Token字符串响应给客户端
    res.send({
      status: 0,
      message: '登录成功！',
      // 为了方便客户端使用Token，在服务器端直接拼接上Bearer的前缀
      token: 'Bearer ' + tokenStr,
    })    
  })  
}

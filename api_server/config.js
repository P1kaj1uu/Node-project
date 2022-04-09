// 这是一个全局的配置文件

// 向外共享加密和还原Token的jwtSecretKey字符串
module.exports = {
  // 加密和解密Token的秘钥
  jwtSecretKey: 'itheima No1. ^_^',
  // Token有效期为10个小时
  expiresIn: '10h'
}

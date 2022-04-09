// 导入处理路径的 path 核心模块
const path = require('path')

// 导入数据库操作模块
const db = require('../db/index')

// 发布新文章的处理函数
exports.addArticle = (req, res) => {
  console.log(req.body) // 文本类型的数据
  console.log('--------分割线----------')
  console.log(req.file) // 文件类型的数据
  // 手动判断是否上传了文章封面
  if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数！')
  // 表单数据合法，继续后面的处理流程
  const articleInfo = {
    // 标题、内容、状态、所属的分类Id
    ...req.body,
    // 文章封面在服务器端的存放路径
    cover_img: path.join('/uploads', req.file.filename),
    // 文章发布时间
    pub_date: new Date(),
    // 文章作者的Id
    author_id: req.user.id,
  }
  // 定义发布文章的SQL语句
  const sql = `insert into ev_articles set ?`
  // 调用db.query()执行发布文章的SQL语句
  // 执行 SQL 语句
  db.query(sql, articleInfo, (err, results) => {
    // 执行SQL语句失败
    if (err) return res.cc(err)
    // 执行SQL语句成功，但是影响行数不等于1
    if (results.affectedRows !== 1) return res.cc('发布文章失败！')
    // 发布文章成功
    res.cc('发布文章成功！', 0)
  })
}

// 获取文章的列表数据的处理函数
exports.listArticle = (req, res) => {
  // 定义SQL语句
  const sql = `select * from ev_articles limit ?,?`
  // 调用db.query执行SQL语句
  db.query(sql, [req.params.pagenum, req.params.pagesize], (err, results) => {
    // 执行SQL失败
    if (err) return res.cc(err)
    // 执行SQL语句成功，但影响行数不等于1
    if (results.affectedRows !== 1) return res.cc('获取文章列表失败！')
    // 获取文章列表数据成功
    res.cc('获取文章列表成功！', 0)
  })
}

// 根据id删除文章数据的处理函数
exports.deleteArticleById = (req, res) => {
  // 定义删除文章分类的SQL语句
  const sql = `update ev_articles set is_delete=1 where id=?`
  // 调用db.query()执行删除文章分类的SQL语句
  db.query(sql, req.params.id, (err, results) => {
    // 执行SQL语句失败
    if (err) return res.cc(err)
    // SQL语句执行成功，但是影响行数不等于1
    if (results.affectedRows !== 1) return res.cc('删除文章分类失败！')
    // 删除文章分类成功
    res.cc('删除文章分类成功！', 0)
  })
}

// 根据id获取文章列表数据的处理函数
exports.getArticleById = (req, res) => {
  // 定义SQL语句
  const sql = `select * from ev_articles where id=?`
  // 调用db.query()执行删除文章分类的SQL语句
  db.query(sql, req.params.id, (err, results) => {
    // 执行SQL语句失败
    if (err) return res.cc(err) 
    // 执行SQL语句成功，但是没有查询到任何数据
    if (results.length !== 1) return res.cc('获取文章失败！')  
    // 把数据响应给客户端
    res.send({
      status: 0,
      message: '获取文章成功！',
      data: results[0],
    })
  }) 
}

// 根据id更新文章数据的处理函数
exports.updateArticleById = (req, res) => {
  // 手动判断是否上传了文章封面
  if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数！')
  // 表单数据合法，继续后面的处理流程
  const articleInfos = {
    // 标题、内容、状态、所属的分类Id
    ...req.body,
    // 文章封面在服务器端的存放路径
    cover_img: path.join('/uploads', req.file.filename),
    // 文章发布时间
    pub_date: new Date(),
    // 文章作者的Id
    author_id: req.user.id,
  }
  // 更新文章
  // 定义更新文章的SQL语句
  const sql = `update ev_articles set ? where Id=?`
  // 调用db.query()执行SQL语句
  db.query(sql, [articleInfos, req.body, req.body.Id], (err, results) => {
    // 执行SQL语句失败
    if (err) return res.cc(err)   
    // 执行SQL语句成功，但是影响行数不等于1
    if (results.affectedRows !== 1) return res.cc('修改文章失败！')   
    // 更新文章成功
    res.cc('修改文章成功！', 0)
  })   
}

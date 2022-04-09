// 导入定义验证规则的模块
const joi = require('joi')

// 定义 标题、分类Id、内容、发布状态 的验证规则
const title = joi.string().required()
const cate_id = joi.number().integer().min(1).required()
const content = joi.string().required().allow('')
const state = joi.string().valid('已发布', '草稿').required()

// 定义获取文章的列表数据的验证规则
const pagenum = joi.number().integer().min(0).required()
const pagesize = joi.number().integer().min(1).required()
const cate_id1 = joi.string()
const state1 = joi.string().valid('已发布', '草稿')

// 定义 分类Id 的校验规则
const id = joi.number().integer().min(1).required()

// 验证规则对象：发布文章
exports.add_article_schema = {
  body: {
    title,
    cate_id,
    content,
    state,
  }
}

// 验证规则对象：获取文章的列表数据
exports.list_article_schema = {
  params: {
    pagenum,
    pagesize,
    cate_id: cate_id1,
    state: state1,
  }
}

// 验证规则对象：根据id删除文章数据
exports.delete_article_schema = {
  params: {
    id,
  }
}

// 验证规则对象：根据id获取文章数据
exports.get_article_schema = {
  params: {
    id,
  }
}

// 验证规则对象：根据id更新文章信息
exports.update_article_schema = {
  body: {
    Id: id,
    title,
    cate_id,
    content,
    state,
  }
}
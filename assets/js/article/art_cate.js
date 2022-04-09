$(function () {
  // 从Layui中解构
  var layer = layui.layer
  var form = layui.form

  initArtCateList()

  // 初始化文章分类列表
  function initArtCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章分类列表失败！')
        }
        // 渲染表格数据的模板引擎
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
      }
    })
  }

  // 为添加类别按钮绑定点击事件
  var indexAdd = null
  $('#btnAddCate').on('click', function () {
    indexAdd = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#dialog-add').html()
    })
  })

  // 通过代理的形式，为form-add表单绑定submit事件
  $('body').on('submit', '#form-add', function (e) {
    // 阻止表单默认事件
    e.preventDefault()
    // 发起ajax请求新增文章分类
    $.ajax({
      method: 'POST',
      url: '/my/article/addcates',
      data: {
        name: $('.layui-input-block [name=name]').val(),
        alias: $('.layui-input-block [name=alias]').val()
      },
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('新增文章分类失败！')
        }
        // 调用上述方法，重新渲染文章分类列表
        initArtCateList()
        layer.msg('新增文章分类成功！')
        // 根据索引，关闭对应的弹出框
        layer.close(indexAdd)
      }
    })
  })

  // 通过代理的形式，根据id删除文章分类
  $('tbody').on('click', '.btn-delete', function () {
    // 获取id
    var id = $(this).attr('data-id')
    // 提示用户是否要删除
    layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
      // 发起ajax请求
      $.ajax({
        method: 'GET',
        url: '/my/article/deletecate/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除文章分类失败！')
          }
          layer.msg('删除文章分类成功！')
          // 关闭弹出框
          layer.close(index)
          // 调用上述方法，重新渲染文章分类列表
          initArtCateList()
        }
      })
    })
  })

  // 通过代理的形式，为form-edit表单绑定submit事件
  $('body').on('submit', '#form-edit', function (e) {
    // 阻止表单默认事件
    e.preventDefault()
    // 发起ajax请求，根据id更新文章分类数据
    $.ajax({
      method: 'POST',
      url: '/my/article/updatecate',
      // 快速获取表单数据
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新分类信息失败！')
        }
        layer.msg('更新分类信息成功！')
        // 关闭弹出框
        layer.close(indexEdit)
        // 调用上述方法，重新渲染文章分类列表
        initArtCateList()
      }
    })
  })

  // 通过代理的形式，为编辑按钮绑定点击事件
  var indexEdit = null
  $('tbody').on('click', '.btn-edit', function () {
    // 弹出一个修改文章分类信息的层
    indexEdit = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#dialog-edit').html()
    })
    var id = $(this).attr('data-id')
    // 发起ajax请求获取对应分类的数据
    $.ajax({
      method: 'GET',
      url: '/my/article/cates/' + id,
      success: function (res) {
        form.val('form-edit', res.data)
      }
    })
  })

})
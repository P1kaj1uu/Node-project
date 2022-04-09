$(function () {
  // 从Layui中解构
  var layer = layui.layer
  var form = layui.form
  var laypage = layui.laypage

  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)
    // 年
    var y = dt.getFullYear()
    // 月
    var m = AddZero(dt.getMonth() + 1)
    // 日
    var d = AddZero(dt.getDate())
    // 时
    var hh = AddZero(dt.getHours())
    // 分
    var mm = AddZero(dt.getMinutes())
    // 秒
    var ss = AddZero(dt.getSeconds())
    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }

  // 补零的函数
  function AddZero(n) {
    return n > 9 ? n : '0' + n
  }

  function removeTag(data) {
    var reg= /<[^<>]+>/g
    $('.layui-input-block [name=content]').val() = res.data.content.replace(reg, '')
  }

  // 定义一个查询的参数对象，将来请求数据的时候，需要将请求参数对象提交到服务器
  var params = {
    pagenum: 1, // 页码值，默认请求第一页的数据
    pagesize: 2, // 每页显示几条数据，默认每页显示2条
    cate_id: '', // 文章分类的 Id
    state: '' // 文章的发布状态
  }

  initArtTabList()
  initArtCateList()

  // 初始化获取文章的列表数据的函数
  function initArtTabList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/list',
      data: params,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章列表成功！')
        }
        // 使用模板引擎，渲染列表区域数据
        var htmlStr = template('tpl-table', res)
        $('tbody').html(htmlStr)
        // 调用渲染分页的方法
        renderPage(res.total)
      }
    })
  }

  // 获取文章分类
  function initArtCateList() {
    $.ajax({
      method: 'GET',
      url: '/my/article/cates',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取文章分类列表失败！')
        }
        // 使用模板引擎，渲染所有分类下拉框的数据
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        // 通过layui重新渲染表单区域的UI结构
        form.render()
      }
    })
  }

  function renderPage(total) {
    // 调用 laypage.render() 方法来渲染分页的结构
    laypage.render({
      elem: 'pageBox',
      //数据总数，从服务端得到
      count: total,
      // 起始页
      curr: params.pagenum,
      // 每页显示的条数
      limit: params.pagesize,
      // 每页条数的选择项
      limits: [2, 3, 5, 10],
      // 自定义排版
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      // 分页发生切换的时候，触发 jump 回调
      // obj包含了当前分页的所有参数
      // 触发 jump 回调的方式有两种：
      // 1. 点击页码的时候，会触发 jump 回调
      // 2. 只要调用了 laypage.render() 方法，就会触发 jump 回调
      jump: function (obj, first) {
        // 更新最新的页码数
        params.pagenum = obj.curr
        // 更新最新的每页显示的条数
        params.pagesize = obj.limit
        // 可以通过 first 的值，来判断是通过哪种方式，触发的 jump 回调
        // 如果 first 的值为 true，证明是方式2触发的
        // 否则就是方式1触发的
        if (!first) {
          // 渲染文章的列表数据
          initArtTabList()
        }
      }
    })
  }

  // 为筛选按钮绑定事件
  $('#form-search').on('submit', function (e) {
    // 阻止表单默认事件
    e.preventDefault()
    // 获取表单中选择的值
    var cate_id = $('[name=cate_id]').val()
    var state = $('[name=state]').val()
    // 为查询参数对象中对应的属性赋值
    params.cate_id = cate_id
    params.state = state
    // 渲染文章的列表数据
    initArtTabList()
  })

  // 通过代理的形式，根据id删除文章数据，为删除按钮绑定事件
  $('tbody').on('click', '.btn-delete', function () {
    // 获取删除按钮的个数
    var len = $('.btn-delete').length
    // 获取到文章的 id
    var id = $(this).attr('data-id')
    // 询问用户是否要删除数据
    layer.confirm('确认删除?', {
      icon: 3,
      title: '提示'
    }, function (index) {
      $.ajax({
        method: 'GET',
        url: '/my/article/delete/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除文章失败！')
          }
          layer.msg('删除文章成功！')
          // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
          // 如果没有剩余的数据了,则让页码值 -1 之后,
          // 再重新调用渲染文章列表数据的方法
          if (len === 1) {
            // 如果 len 的值等于1，证明删除完毕之后，页面上就没有任何数据了
            // 页码值最小必须是 1
            params.pagenum = params.pagenum === 1 ? 1 : params.pagenum - 1
          }
          initArtTabList()
        }
      })
      layer.close(index)
    })
  })
  
  // 通过代理的形式，为编辑按钮绑定事件
  var iEdit = null
  $('tbody').on('click', '.btn-edit', function () {
    // 弹出一个修改层
    iEdit = layer.open({
      type: 1,
      area: ['500px', '320px'],
      title: '编辑文章信息',
      content: $('#dialog-edit').html()
    })
    var id = $(this).attr('data-id')
    // 发起ajax请求获取对应文章信息的数据
    $.ajax({
      method: 'GET',
      url: '/my/article/' + id,
      success: function (res) {
        // 去掉content里面的html标签
        // [...res.data.content].toString().replace(/<[^<>]+>/g,"").replace(/,/g, "")
        form.val('form-edit', {
          'Id': res.data.Id,
          'cate_id': res.data.cate_id,
          'content': [...res.data.content].toString().replace(/<[^<>]+>/g,"").replace(/,/g, ""),
          'cover_img': res.data.cover_img,
          'state': res.data.state,
          'title': res.data.title
        })
      }
    })
  })

  // 通过代理的，为编辑表单绑定submit事件
  $('body').on('submit', '#form-edit', function (e) {
    // 阻止表单默认事件
    e.preventDefault()
    // 发起ajax请求，根据id更新文章信息
    $.ajax({
      method: 'POST',
      url: '/my/article/edit',
      // 快速获取表单数据
      data: $(this).serialize(),
      // 注意：如果向服务器提交的是FormData格式的数据，必须添加以下两个配置项
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('修改文章失败！')
        }
        layer.msg('修改文章成功！')
        // 关闭弹出框
        layer.close(iEdit)
        // 调用上述方法，重新渲染文章列表数据
        initArtTabList()
      }
    })
  })
  
})
$(function () {
  // 从Layui中解构
  var layer = layui.layer
  var form = layui.form

  // 用户名称设置校验规则
  form.verify({
    nickname: function (value, item) { //value：表单的值、item：表单的DOM对象
      if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
        return '用户名不能有特殊字符';
      }
      if (/(^\_)|(\__)|(\_+$)/.test(value)) {
        return '用户名首尾不能出现下划线\'_\'';
      }
      if (/^\d+\d+\d$/.test(value)) {
        return '用户名不能全为数字';
      }
    }
  })

  initUserInfo()

  // 初始化用户的基本信息
  function initUserInfo() {
    $.ajax({
      method: 'GET',
      url: '/my/userinfo',
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取用户信息失败！')
        }
        // 调用form.val(快速为表单赋值)
        form.val('formUserInfo', res.data)
      }
    })
  }

  // 监听表单重置事件
  $('#btnReset').on('click', function (e) {
    // 阻止表单默认事件
    e.preventDefault()
    // 重置表单
    $('.layui-input-block [name=nickname]').val('')
    $('.layui-input-block [name=email]').val('')
  })

  // 监听表单提交事件
  $('.layui-form').on('submit', function (e) {
    // 阻止表单默认提交事件
    e.preventDefault()
    // 发起ajax请求
    $.ajax({
      method: 'POST',
      url: '/my/userinfo',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新用户信息失败！')
        }
        // 清空表单中的数据
        $('.layui-input-block [name=nickname]').val('')
        $('.layui-input-block [name=email]').val('')
        layer.msg('更新用户信息成功！')
        // 调用父级的index.js中的方法，重新渲染用户的头像和用户的信息
        window.parent.getUserInfo()
      }
    })
  })
  
})
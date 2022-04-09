$(function () {
  // 从Layui中解构
  var layer = layui.layer
  var form = layui.form

  // 设置表单校验规则
  form.verify({
    pwd: [
      /^[\S]{6,12}$/
      ,'密码必须6到12位，且不能出现空格'
    ],
    repwd1: function (value, item) {
      //value：表单的值;item：表单的DOM对象
      var pass = $('.layui-input-block [name=oldPwd]').val()
      if (value === pass) {
        return '新旧密码不能相同'
      }
    },
    repwd2: function (value, item) {
      //value：表单的值;item：表单的DOM对象
      var pass = $('.layui-input-block [name=newPwd]').val()
      if (value !== pass) {
        return '两次输入的密码不一致'
      }
    }
  })

  // 监听表单重置事件
  $('#btnReset').on('click', function (e) {
    // 阻止表单默认事件
    e.preventDefault()
    // 重置表单数据
    $('.layui-form')[0].reset()
  })

  // 监听表单提交事件
  $('.layui-form').on('submit', function (e) {
    // 阻止表单默认事件
    e.preventDefault()
    // 发送ajax请求
    $.ajax({
      method: 'POST',
      url: '/my/updatepwd',
      data: {
        oldPwd: $('.layui-input-block [name=oldPwd]').val(),
        newPwd: $('.layui-input-block [name=newPwd]').val()
      },
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('更新密码失败！')
        }
        layer.msg('更新密码成功！')
        // 清空表单中的数据
        $('.layui-form')[0].reset()
      }
    })
  })
  
})
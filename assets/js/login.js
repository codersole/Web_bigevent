$(function() {
  // 点击实现登录注册页面的切换
  $('#link_reg').on('click', function() {
    $('.login_box').hide();
    $('.reg_box').show();
   
  })

  $('#link_login').on('click', function() {
    $('.login_box').show();
    $('.reg_box').hide();
    
  })

  // 从layui中获取form对象
  var form = layui.form
  var layer = layui.layer
  // 通过form.verfity()函数自定义校验规则
  form.verify({
    // 自定义一个pwd的校验规则
    pwd: [
      /^[\S]{6,12}$/,
     '密码必须6到12位，且不能出现空格'
    ],
    // 校验两次密码是否一致
    repwd: function(value) {
      // 通过形参拿到的是确认密码框的值
      // 还需要拿到密码框的值
      // 然后进行两次对比
      var pwd = $('.pwd').val()
     
      if(pwd !== value) {
        return '两次密码不一致！'
      }
    }
  })

  // 监听注册表单的提交事件
  $('#form_reg').on('submit', function(e) {
    // 阻止默认提交行为
    e.preventDefault();
    let data = { username: $('.reg_box [name=username]').val(), password: $('.reg_box [name=password]').val()}
    $.post('/api/reguser', data, function(res) {
      if(res.status != 0) {
        return layer.msg(res.message)
      }
      layer.msg('注册成功，请登录！')
      // 模拟点击行为
      $('#link_login').click();
    })
  })

  $('#form_login').on('submit', function(e) {
    // 阻止默认提交行为
    e.preventDefault();
    let data ={username: $('.login_box [name=username]'), password: '.login_box [name=password]'}
    $.ajax({
      url: '/api/login',
      method: 'POST',
      // 快速获取表单中的数据
      data: $(this).serialize(),
      success: function(res) {
        if(res.status !== 0) {
          return layer.msg('登录失败！')
        }
        layer.msg('登陆成功！');
        // 将登陆成功得到的token字符串，保存到localStorage中
        localStorage.setItem('token', res.token)
        // console.log(res.token);
        // 跳转到后台主页
        location.href = '/index.html';
      }
    })
  })
})
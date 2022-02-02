$(function() {
    var form = layui.form;
    var layer = layui.layer;
    form.verify({
        nickname: function(value) {
            if(value.length > 6) {
                return '用户名称必须在1~6个字符之间！'
            }
        }
    })
    updataUserInfo();
    
    // 获取用户的信息
    function updataUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res)  {
                if(res.status !== 0) {
                    return layer.msg(res.message)
                }
                console.log(res);
                // 填充内容,调用form.val()快速为表单赋值
                // console.log(res.data.username);
                form.val('formUserInfo', res.data)
                // $('.layui-input-block [name=login_name]').val(res.username)
                // console.log(test);
                // console.log($('.layui-input-block [name=login_name]').val());

                // console.log(res);
            }
        })
    }

    // 重置按钮事件
    $('#btnReset').on('click', function(e) {
        // 阻止默认行为
        e.preventDefault();
        updataUserInfo();
    })

    // 提交事件
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();

        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('更新用户信息失败！')
                }
                layer.msg('更新用户信息成功！');
                // 调用父页面中的方法，重新渲染用户的头像和用户的信息
                window.parent.getUserInfo();
            }
        })
    })
})


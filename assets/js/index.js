$(function() {
    // 获取用户基本信息
    getUserInfo()

    // 退出点击事件
    $('#loginout').on('click', function() {
        // 提示用户是否确认退出
        layer.confirm('确定退出登录?', {icon: 3, title: '提示'},
        function(index) {
            // 清空本地存储的token
            localStorage.removeItem('token')
            // 重新跳转到登录页面
            location.href = '/login.html'

            layer.close(index)
        })
    })
})

var layer = layui.layer;
// 获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers就是请求头配置对象
        headers: {
            Authorization: localStorage.getItem('token') || ''
        },
        success: function(res) {
            if(res.status !== 0) {
                return layer.msg(res.message);
            }
            // 获取用户信息成功
            getUserRender(res.data);
        },
        // complete: function(res) {
        //     // console.log('执行complete');
        //     // console.log(res);
        //     // if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //     //     // 强制清空token
        //     //     localStorage.removeItem('token')
        //     //     // 强制跳转到登录页
        //     //     location.href = '/login.html'

        //     // }
        // }
    })
}

// 成功获取用户信息，进行页面渲染
function getUserRender(user) {
    // 1.获取用户的头像
    var name = user.nickname || user.username;
    // 2.设置欢迎的文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    // 3.按需渲染用户的头像
    if(user.user_pic !== null) {
        // 渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avater').hide()
    }else {
        // 渲染文本头像
        $('.layui-nav-img').hide();
        var first = name[0].toUpperCase()
        $('.text-avater').html(first).show()
    }
}
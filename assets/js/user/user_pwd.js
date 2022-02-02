$(function() {
    var layer = layui.layer;
    var form = layui.form;

    form.verify({
        pwd: [
            /^[\S]{6,12}$/, 
            '密码必须为6到12位，且不能出现空格！'
        ],
        samepwd: function(value) {
            if(value === $('[name=oldPwd]').val()) {
                return '不能和初始密码一致！'
            }
        },
        repwd: function(value) {
            if(value !== $('[name=newPwd]').val()) {
                return '两次密码不一致！'
            }
        }
    })

    // 重置密码操作
    $('.layui-form').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/updatepwd',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) {
                    layer.msg('密码更新失败！')
                }
                layer.msg('密码更新成功！');
                // 重置密码框
                $('.layui-form')[0].reset();
            }
        })
    })
})
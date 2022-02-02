$(function() {
    // 导入模块
    var layer = layui.layer;
    // 获取裁剪区域DOM
    var $image = $('#image')
    // 配置选项
    const options = {
        // 纵横比
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
    // 创建裁剪区域
    $image.cropper(options)


    // 上传功能
    $('#btnChoose').on('click', function() {
        $('#avater').click();
    })

    // 重置头像图片
    $('#avater').on('change', function(e) {
        let fileList = e.target.files;
        if(fileList.length === 0) {
            layer.msg('没有选择图片！')
        }
        else{
            var file = e.target.files[0];
            var newImgUrl = URL.createObjectURL(file);
            $image.cropper('destroy').attr('src', newImgUrl).cropper(options)
        }
    })

    // 确定更换头像按钮
    $('#btnUpdata').on('click', function() {
        // 1.要拿到用户裁剪之后的头像
        var dataUrl = $image.cropper('getCroppedCanvas', {
            // 创建Canvas
            width: 100,
            height: 100
        }).toDataURL('image/png')

        $.ajax({
            method: 'POST',
            url: '/my/update/avatar',
            data: {
                avatar: dataUrl
            },
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('更换头像失败！')
                }
                else {
                    layer.msg('更换头像成功！');
                    window.parent.getUserInfo();
                }
            }
        })
    })
})
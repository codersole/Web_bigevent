$(function() {
    var layer = layui.layer
    var form = layui.form
    initCate()
    initEditor()
    // 定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎，选=渲染分类下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 调用form.render()方法
                form.render()
            }
        })
    }

    // 裁剪效果
    var $image = $('#image')
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    $image.cropper(options)

    // 选择图片
    $('#btnChoose').on('click', function() {
        $('#coverFile').click()
        // console.log('ok');
    })

    // 监听coverFile的change事件，获取用户选择的文件列表
    $('#coverFile').on('change', function(e) {
        // 获取到文件的列表数组
        var files = e.target.files
        // 判断用户是否选择了文件
        if(files.length === 0) {
            return 
        }
        // 根据文件，创建对应的URL地址
        var newImgURL = URL.createObjectURL(files[0])
        //为裁剪区域重新设置图片
        $image.cropper('destroy').attr('src', newImgURL).cropper(options) 
    })

    // 定义发布文章的状态
    var art_state = '已发布'
    $('#btnSave').on('click', function() {
        art_state = '草稿'
    })
    // 为表达绑定submit提交事件
    $('#form-pub').on('submit', function(e){
        e.preventDefault();
        // 基于form表单，快速创建一个FormData对象
        var fd = new FormData($(this)[0])
        fd.append('state', art_state)
        // 将封面裁剪之后输出一个文件对象
        $image.cropper('getCroppedCanvas', {
            // 创建一个Canvas
            width: 400,
            height: 280
        })
        .toBlob(function(blob) {
            // 将Canvas画布上的内容，转换为文件对象
            // 得到文件对象，进行后续的操作
            // 将文件对象存储到fd中
            fd.append('cover_img', blob)

            // 发表文章
            publishArticle(fd)
        })
    })

    // 定义发表文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            // 向服务器提交FormData格式的数据，必须添加一下两个配置项
            data: fd,
            contentType: false,
            processData: false,
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }

                layer.msg('发布文章成功！')
                location.href = '/aricle/art_list.html'
            }
        })
    }
})
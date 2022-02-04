$(function() {
    var layer = layui.layer;
    var form = layui.form;
    getInitart()
    // 初始化表格数据
    function getInitart() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
               var htmlStr = template('tpl-table', res);
               $('tbody').html(htmlStr)
            }
        })
    }
    // 设置弹出层
    var addIndex = null
    $('#btnAdd').on('click', function() {
        addIndex = layer.open({
            type: 1,
            area: ["500px", "300px"],
            title: '添加文章分类',
            content: $('#diolog-add').html()
          });     
    })

    // 通过代理的形式，为form-add表单绑定submit事件
    $('body').on('submit','#table-add', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('新增信息失败！')
                }
                getInitart()
                layer.msg('新增信息成功！')
                // 根据索引关闭相应的弹出层
                layer.close(addIndex)
            }
        })
    })


    // 设置编辑弹出层
    var editIndex = null
    $('tbody').on('click','#btnEdit', function(e) {
        editIndex = layer.open({
            type: 1,
            area: ["500px", "300px"],
            title: '编辑文章分类',
            content: $('#diolog-edit').html()
        })

        var id = $(this).attr('data-Id')
        // 发起请求获取对应分类的数据
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function(res) {
                console.log(res);
                form.val('table-edit', res.data)
            }
        })
    })

    // 通过代理的形式，为form-edit添加submit绑定事件
    $('body').on('submit', '#table-edit', function(e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function(res) {
                if(res.status !== 0) {
                    // console.log(res);
                    return layer.msg('更新消息失败！')
                }
                layer.msg(res.message)
                getInitart()
                layer.close(editIndex)
            } 
        })
    })

    // 通过代理方式添加删除弹出层
    var delIndex = null
    $('tbody').on('click', '#btnDel', function(e) {
        var id = $(this).attr('data-id')
        delIndex = layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(res) {
                    if(res.status !== 0){
                        console.log(res);
                        return layer.msg('删除消息失败！')
                    }
                    layer.msg('删除信息成功！')
                    getInitart()
                    layer.close(index)
                }
            })
          });
              
    })
})
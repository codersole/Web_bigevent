$(function() {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage

    // 定义美化时间的过滤器
   template.defaults.imports.dataFormat = function(date) {
    const dt = new Date(date)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }

    // 定义补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }
    // 定义一个查询的参数对象，将来请求数据的时候
    // 需要将请求参数对象提交到服务器
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示几条数据
        cate_id: '', //文章分类Id
        state: '', //文章的发布状态
    }
    getList()
    initCate()
    // 获取列表数据
    function getList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg(res.message)
                }
                // 使用模板引擎渲染数据
                // return layer.msg(res.message)
                var htmlStr = template('tpl-arttable',res)
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function(res) {
                if(res.status !== 0) {
                    return layer.msg('获取分类失败！！')
                }
                // 调用模板引擎渲染分类可选项
                var htmlStr = template('tpl-cate', res)
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)
                form.render()
            } 
        })
    }

    // 为筛选表单绑定submit事件
    $('#form-search').on('submit', function(e) {
        e.preventDefault();
        // 获取表单选中项的值
        var card_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象中对应的属性赋值
        q.card_id = card_id
        q.state = state
        // 根据最新的筛选条件，重新渲染表格数据
        initCate()
    })

    // 定义渲染分页的方法
    function renderPage(total) {
        // 调用laypage.render()方法渲染分页
        laypage.render({
            elem: 'pageBox', //分页容器的id
            count: total, //总数据条数
            limit: q.pagesize,//每页显示几条数据
            curr: q.pagenum, //设置默认被选中的分页
            // 分页发生切换的时候，触发jump回调（触发jump回调方式有两种）
            // 1. 点击页码的时候会触发jump回调函数
            // 2. 只要调用了laypage.render()方法触发的jump回调
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2,4,6,8],
            jump: function(obj, first) {
                // 通过first的值，来判断是通过哪种方法，触发的jump回调
                // first是true，则是第二种方法触发，first为undefined则是第一种方式触发
                // console.log(obj.curr);
                q.pagenum = obj.curr
                q.pagesize = obj.limit
                if(!first) {
                    getList()
                }
            }
        })
    } 

    // 通过代理的方式，为删除按钮绑定点击事件处理函数
    $('tbody').on('click', '.tbnDel', function() {
        // 获取删除按钮的个数
        var len = $('.btnDel').length
        // console.log(len);
        // 获取文章的id
        var id = $(this).attr('data-id')
        // 询问用户是否要删除数据
        layer.confirm('确认删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function(res) {
                    if(res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // 当数据删除完成后，需要判断当前这一页，是否还有剩余的数据
                    // 如果没有剩余的数据，则让页码值-1之后
                    // 再重新调用initTable()方法
                    if(len === 1) {
                        // 如果len的值等于1，证明删除完毕之后，页面上就没有任何数据
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initCate()
                }
            })
            layer.close(index);
        });
    })
})
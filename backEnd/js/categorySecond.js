$(function () {
  // 获取数据列表
  var getSecondData = function (pageNum) {
    $.ajax({
      type: 'get',
      url: '/category/querySecondCategoryPaging',
      data: {
        page: pageNum||1,
        pageSize: 5
      },
      dataType: 'json',
      success: function (data) {
        // console.log(data);
        var secondResult = template('second-template',data);
        $('tbody').html(secondResult);

        $('.pagination').bootstrapPaginator({
          /*当前使用的是3版本的bootstrap*/
          bootstrapMajorVersion: 3,
          /*配置的字体大小是小号*/
          size: 'small',
          /*当前页*/
          currentPage: data.page,
          /*一共多少页*/
          // 总页数=数据的总数/每页显示多少条数据
          totalPages: Math.ceil(data.total / data.size),
          /*点击页面事件*/
          onPageClicked: function (event, originalEvent, type, page) {
            /*改变当前页再渲染 page当前点击的按钮的页面*/
            getSecondData(page);
          }
        });

      }
    })
  }

  getSecondData();
  initDropDown();
  initUpload();

  // 校验==
  $('#secondform').bootstrapValidator({
    feedbackIcons:{
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields:{
      // 字段名是name属性的值
      brandName:{
        validators:{
          notEmpty:{
            message:'二级分类不能为空'
          }
        }
      }
    }
  }).on('success.form.bv',function(e){
    e.preventDefault();
    var $form = $(e.target);
    var bv = $form.data('bootstrapValidator');
    // 使用ajax提交表单数据
    // 1.验证 这个表单校验插件是否运行
    // 2.提交ajax
    //  2.1 看接口

    // serialize(); 序列化
    var data = $form.serialize();
    console.log(data)
    $.ajax({
      type:'post',
      url:'/category/addSecondCategory',
      data:data,
      success:function(data){
        // console.log(data);
        // 关闭遮罩层
        $('#second-modal').modal('hide');
        getSecondData();
      }
    })

  });

})

// 1. 声明一个函数========================
var initDropDown = function(){
  var dropdown = $('.dropdown');
  // console.log(1);
  // 2.发起ajax请求
  dropdown.click(function (){
    // console.log(1);
    $.ajax({
      type:'get',
      url:'/category/queryTopCategoryPaging',
      data:{
        page:1,
        pageSize:100
      },
      dataType:'json',
      success:function(data){
        console.log(data);
       // 把数据给添加到dropmenu
        // 1.遍历data中的数据
        // $.each(将要被遍历的数组,function(i(索引),item(遍历出的每一项)){}})
        var html = '';
        $.each(data.rows, function(i,item){
          console.log(i,item);
          html += '<li><a href="javascript:;" data-id="'+ item.id +'">'+ item.categoryName +'</a></li>';
          $('.dropdown-menu').html(html);
          $('.dropdown-menu').on('click','a',function(){
            $('.dropdown-text').html($(this).html());
            $('#categoryId').val($(this).attr('data-id'));
          })
        })
      }
    })
  })
}

// 上传
var initUpload = function(){
  // 下面的id是type=file类型的input的id

  $('#secondupload').fileupload({
     // 找到上传图片的接口
     url:"/category/addSecondCategoryPic",
     done: function(e,data){
      // console.log(data);
      $('#picture').attr('src',data.result.picAddr);
      // console.log(1);
      $('#brandLogo').val(data.result.picAddr);
    }
  })
}

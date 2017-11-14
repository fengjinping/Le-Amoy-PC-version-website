$(function () {
  var getProductData = function (pageNum) {
    $.ajax({
      type: 'get',
      url: ' /product/queryProductDetailList',
      data: {
        page: pageNum || 1,
        pageSize: 5
      },
      success: function (data) {
        // console.log(data);
        var productResult = template('product-template', data);
        $('tbody').html(productResult);
      }
    })
  }
  getProductData();
  initUpload();




  $('#productform').bootstrapValidator({
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },
    fields: {
      // 字段名是name属性的值
      proName: {
        validators: {
          notEmpty: {
            message: '商品名称不能为空'
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: '商品描述不能为空'
          }
        }
      },
      num: {
        validators: {
          notEmpty: {
            message: '商品库存不能为空'
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: '商品价格不能为空'
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: '商品原价不能为空'
          }
        }
      }, 
      size: {
        validators: {
          notEmpty: {
            message: '商品尺码不能为空'
          }
        }
      }
    }
  }).on('success.form.bv', function (e) {
    // Prevent form submission
    e.preventDefault();
    // Get the form instance
    var $form = $(e.target);

    // 获取参数
   
    var data = $form.serialize();
    // console.log(data);
    // http协议要的是什么格式的东西key=value
    // 遍历数组
    $.each(picList,function(i,item){
      // console.log(i,item);
      data+='&picName'+(i+1)+'='+item.picName+'&picAddr'+(i+1)+'='+item.picAddr;
    })

    // console.log(data);

    data = data+'&brandId=4';
    // console.log(data);

    $.ajax({
      type:'post',
      url:'/product/addProduct',
      data: data,
      success:function(data){
        console.log(data);

        $('#product-modal').modal('hide');
        getProductData();
      }
    })
  });

})



// 2.上传 
var picList =[];
var initUpload = function () {
  // 下面的id是type=file类型的input的id
  $("#pic").fileupload({
    // 找到上传图片的接口
    url: "/product/addProductPic",
    done: function (e, data) {
      // console.log(data);
      $('.fileupload').append('<img width="50" height="auto" src="'+data.result.picAddr+'" alt="">');
      // console.log(data.result);
      picList.push(data.result);
    }
  })
}
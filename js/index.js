//轮播图
$(function () {
    var $outer = $('#outer');
    var outer = $outer[0];
    var $wrap = $('#wrap');
    var $focus = $('#focusList');
    var $focusList;
    var $oImgs;
//请求数据，用jq里的ajax方法
    function getData(callBack) {
        $.ajax({
            url: './data.json',
            type: 'GET',
            success: function (result) {
                // console.log(result);
                typeof callBack === 'function' ? callBack(result) : null;
            }
        });
    }

    // 执行ajax请求数据
    getData(bindData);
    function bindData(data) {
        var imgStr = '';
        var foucsStr = '';
        $.each(data, function () {
            imgStr += '<img data-src= ' + this.img + '>';
            foucsStr += '<li></li>';
        });
        // 输出到页面
        $wrap.html(imgStr);
        $focus.html(foucsStr);
        // 获取所有焦点
        $focusList = $('#focusList li');
        // 让第一个焦点 为选中样式
        $focusList.eq(0).addClass('selected');
        // 获取所有图片
        $oImgs = $('#wrap img');
        // 保存图片个数
        outer.imgSize = $oImgs.length;

        delayImg(); // 图片延迟加载
    }
    //图片延时加载
    function delayImg() {
        var tempImg;
        $oImgs.each(function () {
            // 获取当前img 保存的图片数据
            var imgSrc = $(this).data('src');
            var $that = $(this); // 当前要加载的每一个img
            // 检测图片资源有效性
            tempImg = new Image;
            $(tempImg).prop('src', imgSrc);
            $(tempImg).load(function () {
                $that.index() === 0 ? $that.fadeIn(300) : null;
                $that.prop('src', imgSrc);
                tempImg = null;
            });
        });
        // 记录当前图片索引
        outer.step = 0;
        // 焦点点击事件绑定
        bindSelectEvent();
        // 控制自动轮播的定时器
        outer.timer = setInterval(autoMove, 2000);
        // 保存最后一张索引
        outer.lastInd = $oImgs.last().index();
    }
    // 轮播方法
    function autoMove(n) {
        // 如果n传递值 就 让 outer.step = n 否则 照常 outer.step++
        !isNaN(n) ? outer.step = n : outer.step++;

        outer.step > outer.lastInd ? outer.step = 0 : null;
        // 图片渐变控制
        $oImgs.stop().eq(outer.step).fadeIn(300).siblings().fadeOut();
        // 焦点同步控制
        $focusList.eq(outer.step).addClass('selected').siblings().removeClass('selected');
    }

    $outer.hover(function () { // 滑入 清除动画
        $('#outer a').show();//控制左右切换隐藏
        clearInterval(outer.timer);
    }, function () {  // 滑出 开始动画
        $('#outer a').hide();//控制左右切换隐藏
        outer.timer = setInterval(autoMove, 2000);
    });

    function bindSelectEvent() {
        //焦点滑过事件
        $focusList.each(function () { // 给每个焦点绑定点击事件
            $(this).mouseover(function () {
                autoMove($(this).index()); // 执行autoMove时将 当前焦点索引传递进去
            });
        });
        //左右切换用
        $('.oLeft').click(function () {
            outer.step--;
            outer.step === -1? outer.step= outer.lastInd : null;
            autoMove(outer.step);
        });

        $('.oRight').click(function () {
            autoMove();
        })
    }
});

//返回顶部
$(function () {
    var $back = $('.back');
    $back.on('click',function (e) {
        e.stopPropagation();
        $('body,html').animate({
            scrollTop: 0
            }, 1000);
    })
});

//楼层导航
$(function(){
    $(window).scroll(function(){
        var winHeight = $(window).height();//浏览器可视窗口的高度
        var scrollHeight = $(window).scrollTop();//鼠标滚动的距离
        if (scrollHeight > 1000){
            $('.fixed').css('display','block');
            $('.back').css('display','block')
        }else {
            $('.fixed').css('display','none');
            $('.back').css('display','none')
        }
        $(".oo>div").each(function(){
            if(winHeight+scrollHeight-$(this).offset().top>winHeight/2 +87){
                $(".fixed ul li").removeClass("active");
                $(".fixed ul li").eq($(this).index()).addClass("active");
            }
        })
    })
    $(".fixed ul li").click(function(){
        var current = $(".oo>div").eq($(this).index()).offset().top;
        $("html,body").animate({
            "scrollTop":current -300
        },300);
    })
});

//点击登录
$(function () {
    $('#sign-bt').click(function () {
        $('.mask').css('display','block');
        $('.sign_in_input').css('display','block');
    });
    $('#return').click(function () {
        $('.mask').css('display','none');
    });
    var $sign_in_bt = $('.sign_in_bt');
    $sign_in_bt.click(function () {
        var params = {
            'name':$('#sign_name').val(),
            'password':$('#sign_password').val()
        };
        if ($('#sign_name').val() == ''){
            alert("用户名不能为空！");
            return false;
        }
        if ($('#sign_password').val() == ''){
            alert("密码不能为空！");
            return false;
        }
        $.ajax({
            type: "POST",
            url: "",
            data: params,
            dataType : "json",
            success: function(respMsg){

            },
            error:function () {
                alert('填写信息不正确');
                $('#sign_password').attr('value','').focus();
            }
        });
    })
});


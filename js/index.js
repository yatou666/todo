
var mySwiper = new Swiper('.swiper-container', {
    pagination: {
        el: '.swiper-pagination',
    }
})
 let state="project";

$(".add").click(function () {
    $(".mask").show();
    $(".inputarea").transition({y:0},500)
});

$(".cancel").click(function () {

    $(".inputarea").transition({y:("-62vh")},500,function () {
        $(".mask").hide();
    })
});

$(".project").click(function(){
    $(this).addClass("active").siblings().removeClass("active")
    state="project";
    render();
})

$(".done").click(function(){
    $(this).addClass("active").siblings().removeClass("active")
    state="done";
    render();

})
$(".itemlist")
    .on("click",".changestate",function(){
        var index=$(this).parent().attr("id");
        var data=getData();
        data[index].done=true;
        saveData(data);
        render();
    })
    .on("click",".del",function(){
        var index=$(this).parent().attr("id");
        var data=getData();
        data.splice(index,1)
        saveData(data);
        render();
    })
    .on("click","span",function(){
        var index=$(this).parent().attr("id");
        var data=getData();
        data[index].star=!data[index].star;
        saveData(data);
        render();

    })
    .on("click","p",function(){
        var index=$(this).parent().attr("id");
        var data=getData();
        $(".mask").show();
        $(".inputarea").transition({y:0},500);
        $("#text").val(data[index].content);
        $(".submit").hide();
        $(".update").show().data("index",index);


    })

$(".update").click(function(){
    let val=$("#text").val();
    if(val===""){
        return;
    }
    $("#text").val("");
    let data=getData();
    var index=$(this).data("index");
    data[index].content=val;
    saveData(data);
    render();
    $(".inputarea").transition({y:"-62vh"},1000,function(){
        $(".mask").hide();
    })
})

function getData(){
    return localStorage.todo?
        JSON.parse(localStorage.todo):
        [];
    console.log(localStorage.todo);
}
getData();

function saveData(data){
    localStorage.todo=JSON.stringify(data);//
}
let content=document.querySelector(".content");
var myScroll = new IScroll(content
//     ,{
//     click:true,
//     mouseWheel:true

// }
);

function render() {
    var data=getData();
    var str=""; 
    data.forEach(function (value,index) {
        if(state==="project"&& value.done===false){
            str+="<li id="+index+"><p>"+value.content+"</p>" +
                "<time>"+parseTime(value.time)+"</time>" +
                "<span class="+(value.star?"staractive":"")+">&#xe6df;</span>"+
                "<div class='changestate'>完成</div>"+"</li>"
         }
         else if(state==="done"&& value.done===true){
            str+="<li id="+index+">" +
                "<p>"+value.content+"</p>" +
                "<time>"+parseTime(value.time)+"</time>" +
                "<span class="+(value.star?"staractive":"")+">&#xe6df;</span>"+
                "<div class='del'>删除</div>"+"</li>"
        }
    })
    $(".itemlist").html(str);
    myScroll.refresh();
    addTouchEvent();
 }
render();

function parseTime(time) {
    var date=new Date();
    date.setTime(time);
    var year=date.getFullYear();
    var month=setZero(date.getMonth()+1);//月份是0-11
   // var day=setZero(date.getDay());//星期
    var day=setZero(date.getDate());
    var hour=setZero(date.getHours());
    var min=setZero(date.getMinutes());
    var sec=setZero(date.getSeconds());
    return year+"/"+month+"/"+day+"/"+"</br>"+hour+":"+min+":"+sec;
}

function setZero(n) {
    return n<10?"0"+n:n;
}
//修改更新
//提交
// let state="project";
$(".submit").click(function () {
    var val=$("#text").val();//无参数表示获取
    if(val===""){
        return;
    }
    $("#text").val("");//空字符串，设置，清空内容
   
    var data=getData();//获取最新数据
   
    var time=new Date().getTime();//毫秒
   data.push({content:val,time,star:false,done:false});

   saveData(data);//保存当前数据更新
   render();
    console.log(data);
    //time:time 属性名和属性值一洋，可以只写一个
    $(".inputarea").transition({y:("-62vh")},500,function () {
        $(".mask").hide();
    })
})


//手指滑动事件
function addTouchEvent(){
    $(".itemlist>li").each(function(index,ele){
        var hammerobj=new Hammer(ele);
        let state="start";
        let sx,movex;
        let flag=true;//手指离开需不需要动画
        let max=window.innerWidth/5;
        hammerobj.on("panstart",function(e){
            sx=e.center.x;
            ele.style.transition="none";
        })

        hammerobj.on("panmove",function(e){
            let cx=e.center.x;
            movex=cx-sx;
            // console.log(movex);
            // console.log(state);
            if(movex>0&&state==="start"){//开始不能右
                flag=false;
                return;
            }
            if(movex<0&&state==="end"){//结束不能左
                flag=false;
                return;
            }
            if(Math.abs(movex)>max){
                flag=false;
                state=state==="start"?"end":"start";
                if(state==="end"){
                    $(ele).css("x",-max)
                }else{
                    $(ele).css("x","0")
                }
                return;
            }
            if(state==="end"){
                movex=cx-sx-max;
            }
            flag=true;
            $(ele).css("x",movex)

        })
        hammerobj.on("panend",function(e){
            if(!flag){return;}
            ele.style.transition="all 0.5s";
            if(Math.abs(movex)<max/2){
             $(ele).transition({x:0});
             state="start"

            }else{
             $(ele).transition({x:-max});
             state="end"
            }

        })
        
    })

}
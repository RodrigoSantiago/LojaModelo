function headerScroll(scroll) {
    $("#header-bar").css({backgroundColor: 'rgba(63, 81, 181, '+(scroll / 200)+')'});
    $(".header-top").css({backgroundColor: 'rgba(57, 73, 171, '+(scroll / 200)+')'});
    $("#header-bar-home").css({backgroundColor: 'rgba(63, 81, 181, '+(scroll / 200)+')'});
    if ((scroll / 200) >= 1) {
        $("#header").addClass("shadow--medium");
    } else {
        $("#header").removeClass("shadow--medium");
    }
    if ((scroll / 400) >= 1) {
        $("#header-logo").show();
    } else {
        $("#header-logo").hide();
    }
}

function toogleDrawer(inverse) {
    var dr = $("#drawer");
    if ((inverse && parseFloat(dr.css("left")) < -128) || (!inverse && parseFloat(dr.css("left")) >= -128)) {
        dr.animate({left: "-256px"}, 200, function (e) {
            $("body").removeClass("drawer-stop-scroll");
        });
        $("#drawer-block").css("display", "");
        $("#drawer-block").animate({opacity: 0}, 200, function (e) {
            $("#drawer-block").css("display", "none");
        });
    } else {
        dr.animate({left: "0"}, 200, function (e) {
            $("body").removeClass("drawer-stop-scroll");
            $("body").addClass("drawer-stop-scroll");
        });
        $("#drawer-block").css("display", "");
        $("#drawer-block").animate({opacity: 1}, 200);
    }
}

$(document).ready(function() {
    $("#hamburger").click(function (e) {
        toogleDrawer(false);
    });

    $("#drawer-block").click(function (e) {
        toogleDrawer(false);
    });

    headerScroll($(window).scrollTop());
    $(window).scroll(function(){
        var scroll = $(this).scrollTop();
        headerScroll(scroll);
    });

    var sx = 0, px = 0, py = 0;
    var isDragging = false, move = false;
    $(window)
        .on('touchstart', function(e){
            sx = parseFloat($("#drawer").css("left"));
            px = e.originalEvent.touches[0].pageX;
            py = e.originalEvent.touches[0].pageY;
            if (py > 128 && ((sx <= -256 && px < 32) || (sx === 0))) {
                isDragging = true;
            }
        })
        .on('touchmove', function(e){
            if (isDragging) {
                let val = (e.originalEvent.touches[0].pageX - px + sx);
                if (val < -256) val = -256;
                if (val > 0) val = 0;

                let p_x = e.originalEvent.touches[0].pageX;
                let p_y = e.originalEvent.touches[0].pageY;
                let r = Math.sqrt((p_x - px) * (p_x - px) + (p_y - py) * (p_y - py));
                if(r > 32 && Math.abs(p_x - px) > 16 ) {
                    move = true;
                }

                if (move) {
                    $("#drawer").css("left", val + "px");
                    $("#drawer-block").css("display", "");
                    $("#drawer-block").css("opacity", (256 + val) / 256);
                }

            }
        })
        .on('touchend', function(e){
            if (isDragging) {
                isDragging = false;
                if (move) {
                    move = false;
                    toogleDrawer(true);
                }
            }
        });
});
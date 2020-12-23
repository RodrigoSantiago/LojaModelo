$(document).ready(function() {
    $('.items').slick({
        dots: true,
        infinite: true,
        speed: 300,
        slidesToShow: 1,
        centerMode: true,
        variableWidth: true
    });

    var mq = window.matchMedia('(min-width: 901px)');
    if (mq.matches) {
        $('#zoom_01').elevateZoom();
    }

    mq.addEventListener("change", function (b) {
        var zoomImg = $("#zoom_01");

        $('.zoomContainer').remove();
        zoomImg.removeData('elevateZoom');

        if (b.matches) {
            zoomImg.elevateZoom();
        }
    });
});

function imageShow(o) {
    var zoomImg = $("#zoom_01");

    $('.zoomContainer').remove();
    zoomImg.removeData('elevateZoom');

    zoomImg.attr("src", o);
    zoomImg.data("zoom-image", o);

    if (window.matchMedia('(min-width: 901px)').matches) {
        zoomImg.elevateZoom();
    }
}
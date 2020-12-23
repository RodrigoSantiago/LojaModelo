var player;
function onYouTubePlayerAPIReady() {
    player = new YT.Player('main-video', {
        videoId: 'nVUn7tX3-Mg',     // YouTube Video ID
        width: '100%',                // Player width (in px)
        height: '100%',                // Player height (in px)
        playerVars: {
            playlist: 'nVUn7tX3-Mg',
            autoplay: 1,            // Auto-play the video on load
            disablekb: 1,
            controls: 0,            // Hide pause/play buttons in player
            showinfo: 0,            // Hide the video title
            modestbranding: 1,      // Hide the Youtube Logo
            loop: 1,                // Run the video in a loop
            fs: 0,                  // Hide the full screen button
            autohide: 0,            // Hide video controls when playing
            rel: 0,
            enablejsapi: 1
        },
        events: {
            onReady: function (e) {
                e.target.mute();
                e.target.setPlaybackQuality('hd1080');
                setInterval(function(){
                    if (player.getCurrentTime() >= 29){
                        player.seekTo(0);
                    }
                }, 500);
            },
            onStateChange: function (e) {
                /*if(e && e.data === 1){
                    var videoHolder = document.getElementById('home-banner-box');
                    if(videoHolder && videoHolder.id){
                        videoHolder.classList.remove('loading');
                    }
                }else if(e && e.data === 0){
                    e.target.playVideo()
                }*/
            }
        }
    });
}

var p = 0;
function slideOff(num) {
    let preBanner = $(".banners-container .banner:nth-child(" + (p + 1) + ")");
    let banner = $(".banners-container .banner:nth-child(" + (num + 1) + ")");
    p = num;

    preBanner.css({zIndex: 1});
    banner
        .show()
        .addClass("in")
        .css({zIndex: 2, opacity: "0.0"})
        .animate({opacity: "1.0"}, 500, function (e) {
            preBanner.removeClass("in");
        });
}
function resetInterval() {
    if (loop) {
        clearInterval(loop);
    }

    loop = window.setInterval(function(){
        let num = p + 1;
        if (num >= $(".banners-container").children().length) num = 0;
        slideOff(num);
    }, 10000);
}

var loop;
$(document).ready(function() {
    var app = document.getElementById('solution-text');

    var typewriter = new Typewriter(app, {
        loop: true
    });

    typewriter.typeString('soluções inteligentes')
        .pauseFor(2500)
        .deleteAll()
        .typeString('automação comercial')
        .pauseFor(2500)
        .start();

    $(".banners .button").click(function (e) {
        $('html, body').animate({scrollTop: $(".category-grid").offset().top - 100}, 'slow');
    });

    var f = false;
    $(window).on('touchstart', function (e) {
        if (f === false) {
            player.setPlaybackQuality('hd1080');
            player.seekTo(0);
            f = true;
        }
    });

    $('.showup').each(function (i) {
        var bottom_of_object = $(this).position().top;
        var bottom_of_window = $(window).scrollTop() + $(window).height();
        if (bottom_of_window > bottom_of_object) {
            $(this).animate({'opacity': '1'}, 1000);
        }
    });
    $(window).scroll(function () {
        $('.showup').each(function (i) {
            var bottom_of_object = $(this).position().top;
            var bottom_of_window = $(window).scrollTop() + $(window).height();
            if (bottom_of_window > bottom_of_object) {
                $(this).animate({'opacity': '1'}, 1000);
            }
        });

    });
});
$(document).ready(function() {
    $("[data-hist-btn]").click(function(e) {
        var id = $(this).attr('data-hist-btn');
        var ico = $(this).children("i");
        $("#"+id).slideToggle();
        if (ico.text() === "keyboard_arrow_down") {
            ico.text("keyboard_arrow_up");
        } else {
            ico.text("keyboard_arrow_down");
        }
    })
});
var headerSize = 200;
var _GET = {};
if(document.location.toString().indexOf('?') !== -1) {
    var query = document.location
        .toString()
        .replace(/^.*?\?/, '')
        .replace(/#.*$/, '')
        .split('&');

    for(var i=0, l=query.length; i<l; i++) {
        var aux = decodeURIComponent(query[i]).split('=');
        _GET[aux[0]] = aux[1];
    }
}

function interpolate(v) {
    var a = v / 5000;
    return ("" + Math.max(0, Math.round((1 - Math.sqrt(1 - a * a)) * 5000))).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
function sortUsingNestedText(parent, childSelector) {
    var items = parent.children(childSelector).sort(function(a, b) {
        var vA = $(a).text();
        var vB = $(b).text();
        return (vA < vB) ? -1 : (vA > vB) ? 1 : 0;
    });
    parent.append(items);
}

$(function() {
    var sl = $( "#slider-3" );
    sl.slider({
        range:true,
        min: 0,
        max: 5000,
        values: [ 0, 5000 ],
        slide: function( event, ui ) {
            $( "#slider-min" ).text( "R$ " + interpolate(ui.values[ 0 ]));
            if (ui.values[1] === 5000) {
                $("#slider-max").text("+R$ 5.000");
            } else {
                $("#slider-max").text("R$ " + interpolate(ui.values[1]));
            }
        }
    });
    $( "#slider-min" ).text( "R$ " + interpolate(sl.slider( "values", 0 )));
    if (sl.slider( "values", 1 ) === 5000) {
        $("#slider-max").text("+R$ 5.000");
    } else {
        $("#slider-max").text("R$ " + interpolate(sl.slider( "values", 1 )));
    }
});
$(document).ready(function() {
    $(".btn-filter, .btn-filter-apply, #filter-block").click(function (e) {
        $("#filter-dialog").fadeToggle(200);
        $("#filter-block").fadeToggle(200);
        $("body").toggleClass("body-filter-block");
    });
    $(".filter-chip:not(.chip-primary)").click(function (e) {
        $(this).toggleClass("selected");
    });
    $(".chip-primary").click(function (e) {
        var sg = $(".selected-chip-group");
        var spg = $(".chip-primary.selected");
        sg.toggleClass("selected-chip-group");
        spg.toggleClass("selected");
        var nsg = $("#"+$(this).data("chip-group"));
        nsg.toggleClass("selected-chip-group");
        $(this).toggleClass("selected");
    });

    $(".chip-container").each(function (e) {
        sortUsingNestedText($(this), ".filter-chip");
    });

    $('#search_text').on('keypress', function (e) {
        if(e.which === 13){
            search();
        }
    });
    $(".tag-chip").click(function (e) {
        removeTag($(this).text());
    });
});

function removeTag(remove) {
    remove = remove.trim();
    $(".chip:not(.chip-primary).selected").each(function (e) {
        if ($(this).text().trim() + 'close' === remove) { // close icon name
            $(this).removeClass("selected");
        }
    }).promise().done(function () {
        search();
    });
}

function search() {
    var val = $('#search_text').val();
    var tags = "";
    var found = false;
    $(".chip:not(.chip-primary).selected").each(function (e) {
        if (found) tags += ", ";
        found = true;
        tags += $(this).text();
    });
    if (found) {
        _GET["tags"] = tags;
    } else {
        delete _GET["tags"];
    }
    if (val === "") {
        delete _GET["texto"];
    } else {
        _GET["texto"] = val;
    }
    delete _GET["page"];
    refresh();
}

function navigate(to) {
    if (to === "-1") {
        _GET["page"] = pg - 1;
    } else if (to === "+1") {
        _GET["page"] = pg + 1;
    } else {
        _GET["page"] = parseInt(to);
    }
    refresh();
}

function refresh() {
    var str = 'produtos?';
    var first = true;
    for (var key in _GET) {
        if (!_GET.hasOwnProperty(key)) continue;

        var value = _GET[key];
        if (value) {
            if (!first) str += '&';
            first = false;
            str += key + "=" + encodeURIComponent(value);
        }
    }
    window.location.href = first ? "produtos" : str;
}
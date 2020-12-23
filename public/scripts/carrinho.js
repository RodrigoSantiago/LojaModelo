(function($) {
    $.fn.inputFilter = function(inputFilter) {
        return this.on("input keydown keyup mousedown mouseup select contextmenu drop", function() {
            if (this.value === "0" || this.value === "") {
                this.value = "1";
            }
            if (inputFilter(this.value)) {
                this.oldValue = this.value;
                this.oldSelectionStart = this.selectionStart;
                this.oldSelectionEnd = this.selectionEnd;
            } else if (this.hasOwnProperty("oldValue")) {
                this.value = this.oldValue;
                this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
            }
        });
    };
}(jQuery));

$(document).ready(function() {
    $(":input[type=\"number\"]").inputFilter(function(value) {
        return /^\d*$/.test(value) && (parseInt(value) > 0 && parseInt(value) <= 500)
    });
});
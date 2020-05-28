function setCurrentPage() {
    // this will get the full URL at the address bar
    var url = window.location.href;
    var page = null;

    // passes on every "a" tag
    $("#menu a").each(function() {
        // checks if its the same on the address bar
        if (url == (this.href)) {
            page = this
            $(this).addClass("active")
        }
    });
}
if(!window.scraper || !window.ToGoogleDocs || !window.Handlebars) {
    alert("Modules did not load");
}

var messageQuickSend = new window.MessageQuickSend();
var toGoogleDocs = new window.ToGoogleDocs();

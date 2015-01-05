function ToGoogleDocs() {
    var self = this;
    var url = document.URL;
    if(document.URL.indexOf('linkedin.com/profile') >= 0) {
        this.injectForProfile();
    }

    // grab webhook from browser storage
    chrome.storage.sync.get('webhookgdoc', function(data) {
        if(!data.webhookgdoc) {
            alert("Please insert your zapier webhook url in the LinkedIn Google Spreadsheet extension config panel");
            self.webhookURL = 'http://localhost'; //lets make it fail!
        }
        else {
            self.webhookURL = data.webhookgdoc;
        }
    });
}

ToGoogleDocs.prototype.successMsg = function(msg) {
    var d = document.createElement('div');
    d.innerHTML = [
    '<div style="position: fixed; z-index: 10; margin: 0px auto; text-align: center; left: 30%; width: 40%; background: none repeat scroll 0% 0% rgb(20, 210, 20); top: 135px; padding: 100px; height: 200px; color: rgb(0, 0, 0); font-size: 35px;">',
    msg,
    '<button class="close">Close</button>',
    '</div>'
    ].join('\n');

    $(body).prepend(d);
    d.querySelector('button.close').addEventListener('click', function(e) {
        $(d).remove();
    });
};

ToGoogleDocs.prototype.sendToGoogle = function(data) {
    console.log(data);
    var self = this;
    alert("Hook: " + this.webhookURL);
    $.post(this.webhookURL, data)
    .then(function(data) {
        self.successMsg("Saved Successfully");
        window.close();
    })
    .fail(function() {
        alert("FAIL TO SAVE");
    });
};

ToGoogleDocs.prototype.renderButtonEl = function() {
    var d = document.createElement('div');
    d.className = 'profile-actions';
    d.innerHTML = [
    '<button class="button-primary">',
    '  Save to Google Docs',
    '</button>'
    ].join('\n');

    return d;
};

ToGoogleDocs.prototype.injectForProfile = function() {
    var self = this;

    var el = document.querySelector('#top-card > div > div.profile-card.vcard > div.profile-overview > div.profile-aux');

    // inject button
    var buttonEl = this.renderButtonEl();
    $(el).prepend(buttonEl);

    var saveProfile = function(e) {
        e.stopPropagation();
        e.preventDefault();

        var profile = window.scraper.profile();
        self.sendToGoogle(profile);
    };

    // listen for button clicks
    buttonEl.querySelector('button').addEventListener('click', saveProfile);
    window.document.addEventListener('keydown', function(e) {
        if(e.keyCode === 65) {
            saveProfile(e);
        }
        else if(e.keyCode === 70 || e.keyCode === 13) {
            window.close();
        }
    });

    // HACK - ensures 2nd connections are lazy loaded
    document.body.scrollTop = 999999;
    setTimeout(function() {
        document.body.scrollTop = 0;
    }, 450);
};

window.ToGoogleDocs = ToGoogleDocs;

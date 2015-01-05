function MessageQuickSend () {
    if(document.URL.indexOf('linkedin.com/profile') >= 0) {
        this.scrapeAndSaveProfile();
    }
    else if(document.URL.indexOf('utm_source=Profile_inmail') >= 0) {
        this.loadTemplates(function then() {
            this.injectRandTemplate();
        }.bind(this));
    }
}

MessageQuickSend.prototype.scrapeAndSaveProfile = function() {
    this.saveProfile(window.scraper.profile());
};


MessageQuickSend.prototype.saveProfile = function(profile) {
    var obj = {};
    if(profile || !isNaN(profile.id)) {
        obj['profile:' + profile.id] = profile;
        chrome.storage.local.set(obj);
    }
};

MessageQuickSend.prototype.injectRandTemplate = function() {
    this.injectTemplate(Math.floor(Math.random() * 3));
};

MessageQuickSend.prototype.injectTemplate = function(templateNumber) {
    var template = this.grabTemplate(templateNumber);

    var bodyTemplate = this.compileTemplate(template.body);
    var subjectTemplate = this.compileTemplate(template.subject);
    var phoneNumber = template.phoneNumber;

    var profileId = window.queryString('destID');
    var profileKey = 'profile:' + profileId;

    var setElValue = function (el, value) {
        if(el && el.hasOwnProperty('value')) {
            el.value = value;
        }
    };

    chrome.storage.local.get(profileKey, function(data) {
        console.log("STORAGE:", data);
        if(typeof data[profileKey] !== 'undefined') {
            setElValue(document.getElementById('proposalType-create_proposal'), "DISCUSS_NEW_PRODUCTS");
            setElValue(document.getElementById('rcptTelephone-contact-create_proposal'), phoneNumber);
            setElValue(document.getElementById('title-create_proposal'), subjectTemplate(data[profileKey]));
            setElValue(document.querySelector('textarea.input-msgbox'), bodyTemplate(data[profileKey]));
        } else {
            alert("Can't find the person's profile information");
        }
    });
};

MessageQuickSend.prototype.grabTemplate = function(templateNumber) {
    if(this.templates[templateNumber]) {
        return this.templates[templateNumber];
    }
};

MessageQuickSend.prototype.compileTemplate = function(template) {
    if(template && template.length) {
        return window.Handlebars.compile(template);
    }
    else {
        alert("No template stored");
        throw new Error("Invalid template number: ", templateNumber, "templates", this.templates);
    }
};

MessageQuickSend.prototype.loadTemplates = function(callback) {
    chrome.storage.sync.get('templates', function(data) {
        if(!data.templates) {
            alert("Please set the templates in the chrome extension settings :(");
            throw new Error("No templates found", data);
        }
        else {
            this.templates = data.templates;
        }
        callback();
    }.bind(this));
};

window.MessageQuickSend = MessageQuickSend;

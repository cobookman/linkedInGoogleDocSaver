document.getElementById('save').addEventListener('click', function() {

    chrome.storage.sync.set({
        webhookgdoc: document.querySelector('input#webhookgdoc').value,
        webhookmessage: document.querySelector('input#webhookmessage').value
    }, function() {
        alert("Changed zapier webhooks to: \nGoogle Spreadsheets:" + document.querySelector('input#webhook').value + "\nMessage Sent:" + document.querySelector('input#webhookmessage').value);
    });
});

document.getElementById('saveTemplates').addEventListener('click', function() {
    var templates = [];
    for(var i = 1; i <= 3; ++i) {
        var key = 'template' + i + '-';
        templates.push({
            body: document.getElementById(key + 'body').value || '',
            subject: document.getElementById(key + 'subject' ).value || '',
            phoneNumber: document.getElementById(key + 'phoneNumber').value || ''
        });
    }

    chrome.storage.sync.set({
        templates: templates
    }, function() {
        alert("Saved templates");
    });
});

// populate fields
chrome.storage.sync.get('webhook', function(data) {
    document.querySelector('input#webhook').value = data.webhook || '';
});

chrome.storage.sync.get('templates', function(data) {
    if(!data.templates || !data.templates.length) {
        return;
    }
    for(var i = 1; i <= 3; ++i) {
        var key = 'template' + i + '-';
        var template = data.templates[i-1];
        document.getElementById(key + 'body').value = template.body;
        document.getElementById(key + 'subject' ).value = template.subject;
        document.getElementById(key + 'phoneNumber').value = template.phoneNumber;
    }
});

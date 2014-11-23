document.getElementById('save').addEventListener('click', function() {

  chrome.storage.sync.set({
    webhook: document.querySelector('input#webhook').value
  }, function() {
    alert("Changed zapier webhook url to: " + document.querySelector('input#webhook').value);
  });
});


chrome.storage.sync.get('webhook', function(data) {
  document.querySelector('input#webhook').value = data.webhook || '';
});
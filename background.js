// background.js

// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse){
//         switch(request.message){
//             case 'import_clicked':
//                 console.log($("#shipTo"));
//                 //alert("import button clicked!");

//         }
//     });


// Regex-pattern to check URLs against. 
// https://postage.ebay.com/ws/*
// It matches URLs like: http[s]://[...]stackoverflow.com[...]
var urlRegex = /^https?:\/\/(?:[^./?#]+\.)?ebay\.com/;


// A function to use as callback
function doStuffWithDom(domContent) {
    console.log('I received the following DOM content:\n' + domContent);
}

// When the browser-action button is clicked...
chrome.browserAction.onClicked.addListener(function (tab) {
    chrome.tabs.sendMessage(tab.id, {text: 'report_back'}, doStuffWithDom);

    // ...check the URL of the active tab against our pattern and...
    // if (urlRegex.test(tab.url)) {
    //     // ...if it matches, send a message specifying a callback too
    //     chrome.tabs.sendMessage(tab.id, {text: 'report_back'}, doStuffWithDom);
    // }
});
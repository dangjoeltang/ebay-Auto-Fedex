// background.js

var background = {

    address: {
        name: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: "",
        reference: ""
    },

    init: function() {

        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){

            console.log("message received", request);

            if(request.fn in background){
                background[request.fn](request, sender, sendResponse);
            }

        });

        // chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
        //     // make sure the status is 'complete' and it's the right tab
        //     if (tab.url.indexOf('127.0.0.1:8000') != -1 && changeInfo.status == 'complete') {
        //         chrome.tabs.executeScript(null, { 
        //             code: "alert('hi');" 
        //         });
        //     }
        // }
    },

    setAddress: function(request, sender, sendResponse) {
        console.log("setting address", request.address);
        this.address = request.address;
    },

    getAddress: function(request, sender, sendResponse) {
        sendResponse(this.address);
    },

    changeTab: function(request, sender, sendResponse){
        chrome.tabs.query({currentWindow: true, url:"https://www.fedex.com/*"}, function(tabFedex){
            if (tabFedex[0] != null) {
                var tabFedexId = tabFedex[0].id;
                //chrome.tabs.update(tab[0].id, {active: true, url: "https://www.fedex.com/shipping/shipEntryAction.do"}, function(currentTab) {
                chrome.tabs.update(tabFedex[0].id, {selected: true}, function(tabFedexId) {
                    console.log("Tab changed");
                    chrome.tabs.sendMessage(tabFedexId.id, {action: "fill", data: background.address}, function(response){
                        console.log(response.farewell);
                    });
                });
            }

            else {
                // Open new tab, etc.
                chrome.tabs.create({url: 'https://www.fedex.com/shipping/shipEntryAction.do'}, function(tabNew){
                    console.log("New Fedex Tab Created!");
                });
            }
        });
    },

    fillForm: function(tab){
        console.log("called from changeTab")
        chrome.tabs.executeScript({
            code: 'var shipTo = ' + JSON.stringify(this.address)
        }, function(){
            chrome.tabs.executeScript(tab.id, {file: 'injector.js'}, function(){
                console.log("Form filled!");
            });
        });
    }
};

background.init();
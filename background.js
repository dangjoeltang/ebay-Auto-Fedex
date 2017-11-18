// background.js

var background = {

    address: {
        name: "",
        address1: "",
        city: "",
        state: "",
        zipcode: "",
        country: "",
        phone: ""
    },

    init: function() {

        chrome.runtime.onMessage.addListener(function(request, sender, sendResponse){

            console.log("message received", request);

            if(request.fn in background){
                background[request.fn](request, sender, sendResponse);
            }

        });

    },

    setAddress: function(request, sender, sendResponse) {
        console.log("setting address", request.address);
        this.address = request.address;
    },

    getAddress: function(request, sender, sendResponse) {
        sendResponse(this.address);
    }
};

background.init();
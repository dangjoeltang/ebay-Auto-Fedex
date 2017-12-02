// This script will be injected on the fedex page, and when the background tab
// switches the active tab to the fedex tab, it will send a message to autofill.


chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");
    console.log(request);
    if (request.action === "fill"){
        var shipTo = request.data;
        console.log(shipTo);

        document.getElementById("toData.contactName").value = shipTo['name'];
        document.getElementById("toData.companyName").value = shipTo['address2'];
        document.getElementById("toData.addressLine1").value = shipTo['address1'];
        document.getElementById("toData.city").value = shipTo['city'];
        document.getElementById("toData.stateProvinceCode").value = shipTo['state'];
        document.getElementById("toData.zipPostalCode").value = shipTo['zipcode'];
        document.getElementById("toData.phoneNumber").value = shipTo['phone'];

        document.getElementById("psdData.serviceType").selectedIndex = 9;

        // Trigger on-change event
        var serviceType = document.getElementById("psdData.serviceType");
        var event1 = new Event('change');
        serviceType.dispatchEvent(event1);


        document.getElementById("psdData.packageType").selectedIndex = 5;

        console.log("form filled from content.js");
    } 

      sendResponse({farewell: "return from content.js"});
  });
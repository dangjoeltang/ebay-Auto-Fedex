

var console = chrome.extension.getBackgroundPage().console;

var app = {
    init: function(){
        var name = document.getElementById("name"),
            address1 = document.getElementById("address1"),
            city = document.getElementById("city"),
            state = document.getElementById("state"),
            zipcode = document.getElementById("zipcode"),
            country = document.getElementById("country"),
            phone = document.getElementById("phone");

        var importButton = document.getElementById("import");
        var exportButton = document.getElementById("export");

        chrome.runtime.sendMessage({fn: "getAddress"}, function(response) {
            console.log("popup got response", response);
            name.value = response.name;
            address1.value = response.address1;
            city.value = response.city;
            state.value = response.state;
            zipcode.value = response.zipcode;
            country.value = response.country;
            phone.value = response.phone;
        });


        exportButton.addEventListener("click", function() {
            console.log("button click", name.value);

            chrome.runtime.sendMessage({fn: "setAddress", 
                                        address: {
                                            name: name.value,
                                            address1: address1.value,
                                            city: city.value,
                                            state: state.value,
                                            zipcode: zipcode.value,
                                            country: country.value,
                                            phone: phone.value
                                        } 
                                    });
            

            chrome.tabs.create({url: 'https://www.fedex.com/shipping/shipEntryAction.do'});

        });

        importButton.addEventListener("click", function(){
            chrome.tabs.executeScript({
                code: '(' + app["importDOM"] + ')();' //argument here is a string but function.toString() returns function's code
            }, function(results){
                //Here we have just the innerHTML and not DOM structure
                console.log('Popup script:')
                console.log(results);

                document.getElementById("name").value = results[0][0];
                document.getElementById("address1").value = results[0][1];
                //document.getElementById("address2").value = results[0][2];
                document.getElementById("city").value = results[0][2];
                document.getElementById("state").value = results[0][3];
                document.getElementById("zipcode").value = results[0][4];
                document.getElementById("country").value = results[0][5];
                document.getElementById("phone").value = results[0][6];


            });



        });
    },

    importDOM: function(){
        var item = document.getElementById('shipTo');
        var name = item.childNodes[1].childNodes[0].textContent,
            address1 = item.childNodes[1].childNodes[3].textContent,
            address2 = item.childNodes[1].childNodes[5].textContent,

            country = item.childNodes[1].childNodes[7].textContent,
            phone = item.childNodes[1].childNodes[9].textContent;

        var addSplit = address2.split(", ");
        var addSplit2 = addSplit[1].split(" ");

        var city = addSplit[0],
            state = addSplit2[0],
            zipcode = addSplit2[1];

        var shipToInfo = [name, address1, city, state, zipcode, country, phone];
        //console.log(shipToInfo);
        return shipToInfo;
    }


};

// app start
document.addEventListener("DOMContentLoaded", function(){
    app.init();
});

var console = chrome.extension.getBackgroundPage().console;

var app = {
    init: function(){
        var name = document.getElementById("name"),
            address1 = document.getElementById("address1"),
            address2 = document.getElementById("address2"),
            city = document.getElementById("city"),
            state = document.getElementById("state"),
            zipcode = document.getElementById("zipcode"),
            country = document.getElementById("country"),
            phone = document.getElementById("phone");

        var importButton = document.getElementById("import");
        var exportButton = document.getElementById("export");
        var fillButton = document.getElementById("fill");
        var clearButton = document.getElementById("clear");

        var inputFields = document.getElementsByTagName("input");

        chrome.runtime.sendMessage({fn: "getAddress"}, function(response) {
            console.log("popup got response", response);
            name.value = response.name;
            address1.value = response.address1;
            address2.value = response.address2;
            city.value = response.city;
            state.value = response.state;
            zipcode.value = response.zipcode;
            country.value = response.country;
            phone.value = response.phone;
        });

        for (i=0; i<inputFields.length; i++){
            inputFields[i].addEventListener('change', function(){
                chrome.runtime.sendMessage({fn: "setAddress", 
                                                        address: {
                                                            name: name.value,
                                                            address1: address1.value,
                                                            address2: address2.value,
                                                            city: city.value,
                                                            state: state.value,
                                                            zipcode: zipcode.value,
                                                            country: country.value, 
                                                            phone: phone.value
                                                        } 
                            });
            });
        }


        importButton.addEventListener("click", function(){
            chrome.tabs.executeScript({
                code: '(' + app["importDOM"] + ')();'
            }, function(results){
                //Here we have just the innerHTML and not DOM structure
                console.log('Popup script:')
                console.log(results);

                document.getElementById("name").value = results[0][0];
                document.getElementById("address1").value = results[0][1];
                document.getElementById("address2").value = results[0][7];
                document.getElementById("city").value = results[0][2];
                document.getElementById("state").value = results[0][3];
                document.getElementById("zipcode").value = results[0][4];
                document.getElementById("country").value = results[0][5];
                document.getElementById("phone").value = results[0][6];

                chrome.runtime.sendMessage({fn: "setAddress", 
                                            address: {
                                                name: name.value,
                                                address1: address1.value,
                                                address2: address2.value,
                                                city: city.value,
                                                state: state.value,
                                                zipcode: zipcode.value,
                                                country: country.value,
                                                phone: phone.value
                                            } 
                                        });
            });
        });

        clearButton.addEventListener("click", function(){
            for (i=0; i<inputFields.length; i++){
                inputFields[i].value = "";
            }
        });

        exportButton.addEventListener("click", function() {
            chrome.runtime.sendMessage({fn: "setAddress", 
                                        address: {
                                            name: name.value,
                                            address1: address1.value,
                                            address2: address2.value,
                                            city: city.value,
                                            state: state.value,
                                            zipcode: zipcode.value,
                                            country: country.value, 
                                            phone: phone.value
                                        } 
            }, function(){
                chrome.runtime.sendMessage({fn: "changeTab"});
            });
        });

        fillButton.addEventListener("click", function(){
            var shipTo = {
                name: document.getElementById("name").value,
                address1: document.getElementById("address1").value,
                address2: document.getElementById("address2").value,
                city: document.getElementById("city").value,
                state:document.getElementById("state").value,
                zipcode: document.getElementById("zipcode").value,
                country: document.getElementById("country").value,
                phone: document.getElementById("phone").value
            };

            chrome.tabs.executeScript({
                code: 'var shipTo = ' + JSON.stringify(shipTo)
            }, function(){
                chrome.tabs.executeScript({file: 'injector.js'}, function(){
                    console.log("Form filled!");
                });
            });
        });
    },


    importDOM: function(){
        var innertext = document.getElementById('shipTo').childNodes[1].innerText;

        var itemArray = innertext.split("\n");

        var firstFilter = itemArray.filter(element => element !== "");
        var secondFilter = firstFilter.filter(element => element !== "Eligible for seller protection");
        var thirdFilter = secondFilter.filter(element => element !== "This is a residence");


        if (thirdFilter[1].includes("Reference")){
            var reference = thirdFilter.splice(1, 1)[0];
            thirdFilter.push(reference);
        }

        var name = thirdFilter[0].split("[")[0],
            address1 = thirdFilter[1],
            address2 = thirdFilter[2],


            country = thirdFilter[3],
            phone = thirdFilter[4];

        var addSplit = address2.split(", ");
        var addSplit2 = addSplit[1].split(" ");

        var city = addSplit[0],
            state = addSplit2[0],
            zipcode = addSplit2[1];

        if (typeof reference !== "undefined"){
            var shipToInfo = [name, address1, city, state, zipcode, country, phone, reference];
        } else {
            var shipToInfo = [name, address1, city, state, zipcode, country, phone, ""];
        }
        
        console.log(shipToInfo);
        return shipToInfo;
    }


};

// app start
document.addEventListener("DOMContentLoaded", function(){
    app.init();
});

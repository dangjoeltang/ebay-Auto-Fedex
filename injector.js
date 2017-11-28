
document.getElementById("toData.contactName").value = shipTo['name'];
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
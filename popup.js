// Listen for click on the import button
$("#import").click(function(){
    chrome.runtime.sendMessage({message: 'import_clicked'});
});


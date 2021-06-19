/*chrome.commands.onCommand.addListener(function(command) {
    var len = 0;
    chrome.tabs.query({currentWindow: true},function(tab){
        len = tab.length;
    });
    chrome.tabs.query({highlighted: true, currentWindow: true},function(tabs){
        var index = tabs[0].index;
        switch(command){
            case "tab_left":
            chrome.tabs.highlight({tabs:(index-1+len)%len});
            break;
            case "tab_right":
            chrome.tabs.highlight({tabs:(index+1+len)%len});
            break;
            case "tab_first":
            chrome.tabs.highlight({tabs:len-1});
            break;
            case "tab_last":
            chrome.tabs.highlight({tabs:0});
            break;
        }
    })
});*/

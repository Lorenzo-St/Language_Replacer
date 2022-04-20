const Conversions = [];

chrome.runtime.onMessage.addListener(function(request, sender){
    if (request.method == "passData")
    {
            transfer();
    }
    if(request.method == "recieveNew")
    {
        var oG = request.original;
        var tR = request.translation;
        chrome.storage.sync.set({[oG]:tR});
        if(Conversions[0].Roots != "")
            var newRoot = oG + "," +  Conversions[0].Roots;
        else
            var newRoot = oG;
        // chrome.storage.sync.get(oG, (items) => console.log(items));
        chrome.storage.sync.set({"Roots":newRoot});
        const re2 = new Promise((resolve, reject) => {
            chrome.storage.sync.get(null, (items) => {
                if(chrome.runtime.lastError){
                    return reject(chrome.runtime.lastError);
                }
                resolve(items);
            })
        })
        Promise.all([re2]).then(convert => {
            // print(convert[0]); sanity check
            Object.assign(Conversions, convert);
        })
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            var curTab = tabs[0].id
            // console.log(curTab); Sanity check
        chrome.tabs.reload(curTab);
    });
    }
    if(request.method == "clear")
    {
        chrome.storage.sync.clear();
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            var curTab = tabs[0].id
            // console.log(curTab); Sanity check
        chrome.tabs.reload(curTab);
    })
}

});
async function transfer()
{

    const re = new Promise((resolve, reject) => {
        chrome.storage.sync.get(null, (items) => {
            if(chrome.runtime.lastError){
                return reject(chrome.runtime.lastError);
            }
            resolve(items);
        })
    })
    Promise.all([re]).then(convert => {
        // print(convert[0]); Checks to ensure that Promise is returning value
        Object.assign(Conversions, convert);
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            var curTab = tabs[0].id
            // console.log(curTab); Checks to ensure that tab id is being recieved
            chrome.tabs.sendMessage(curTab, {method: "response", Conversions})
        })
    });

}
function print(s)
{
    console.log(s);
}

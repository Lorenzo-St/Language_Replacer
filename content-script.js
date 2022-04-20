//// content-script.js /////

const targetNode = document.body;
const Convert = [];
const Roots = [];
function send()
{
    chrome.runtime.sendMessage({method: "passData"});
}
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "response")
    {
        var data = request.Conversions;
        Object.assign(Convert, data[0]);
        Object.assign(Roots, Convert.Roots.split(","));
    }
});

// Options for the observer (which mutations to observe)
// Set attributes to false if you do not care if existing nodes have changed,
//  otherwise set it true.
const config = { attributes: false, childList: true, subtree: true };

// Callback function to execute when mutations are observed
const callback = function(mutationsList, observer) {
    for(let mutation of mutationsList) {
        replaceTextInNode(mutation.target);
    }
};

// Create an observer instance linked to the callback function
const observer = new MutationObserver(callback);

// Start observing the target node for configured mutations
observer.observe(targetNode, config);print("loaded");

send();
var replaceTextInNode = function(parentNode){
    for(var i = parentNode.childNodes.length-1; i >= 0; i--){
        var node = parentNode.childNodes[i];

        //  Make sure this is a text node
        if(node.nodeType == Element.TEXT_NODE){
            Roots.forEach(Element => {
                var con = Convert[Element];
                node.textContent = node.textContent.replace(new RegExp(`\\b${Element}\\b`,"gi"), con);/* modify text here */
            })
        } else if(node.nodeType == Element.ELEMENT_NODE){
            //  Check this node's child nodes for text nodes to act on
            replaceTextInNode(node);
        }
    }
};
replaceTextInNode(document.body);

function print(s)
{
    console.log(s);
};

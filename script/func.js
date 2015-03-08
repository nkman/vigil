var shortName = 'VIGIL';
var version = '1.0';
var displayName = 'VIGIL Database';
var maxSize = 100000;

VIGIL = openDatabase(shortName, version, displayName, maxSize);
VIGIL.transaction(function (transaction) {
        var sqlCommand = 'CREATE TABLE IF NOT EXISTS vigil(id INTEGER NOT NULL PRIMARY KEY, url TEXT NOT NULL, count INTEGER);';
        transaction.executeSql(sqlCommand);
        console.log("Created Tables.");
        chrome.tabs.getSelected(null,function(tab) {
            var tablink = tab.url;
            console.log(tablink);
        });
});

function insertInDb(result, url){
    if(result.rows.length >= 1){
        id = parseInt(result.item(0).log);
        console.log(id);
        count = parseInt(result.item(1).log);
        count++;
        var query = "UPDATE vigil SET count="+count.toString()+" WHERE id="+id.toString();
        VIGIL.transaction(
            function(transaction){
                transaction.executeSql(query);
            }
        );
    }
    else{
        
        var query = "INSERT INTO vigil (url, count) VALUES (\""+url.toString()+"\", 1)";
        VIGIL.transaction(function(transaction){
            transaction.executeSql(query);
        });
    }

    // query = "SELECT * FROM vigil"
}

// chrome.tabs.onCreated.addListener(function(tab){
//     console.log('tab created !!');
// });

chrome.tabs.onUpdated.addListener(function(tabId, info, tab){
    console.log('tab updated with url '+tab.url+' !!');
});

// chrome.tabs.onSelectionChanged.addListener(function(tabId, info){
//     console.log('changed to '+tabId+' tab !!');
// });

// chrome.tabs.onActivated.addListener(function(info){
//     console.log('Activated '+info.tabId+' tab!!');
// });

chrome.webNavigation.onReferenceFragmentUpdated.addListener(function(info){
    console.log('url is '+info.url);
});

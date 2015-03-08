var shortName = 'VIGIL';
var version = '1.0';
var displayName = 'VIGIL Database';
var maxSize = 5*1024*1024;

VIGIL = openDatabase(shortName, version, displayName, maxSize);
VIGIL.transaction(function (transaction) {
        var sqlCommand = 'CREATE TABLE IF NOT EXISTS vigil(id INTEGER NOT NULL PRIMARY KEY, url TEXT NOT NULL, count INTEGER, UNIQUE(url));';
        transaction.executeSql(sqlCommand);
});

chrome.tabs.onUpdated.addListener(function(tabId, info, tab){
    VIGIL.transaction(function (transaction) {
        var url = tab.url;
        var sqlCommand = 'INSERT INTO vigil (url, count) VALUES ("'+url+'", 1);';
        transaction.executeSql(sqlCommand);
    }, function(err){
        VIGIL.transaction(function(transaction){
            var sqlCommand = 'UPDATE vigil SET count=count+1 WHERE url="'+url+'";';
            transaction.executeSql(sqlCommand);
        });
    });
});

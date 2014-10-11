var shortName = 'VIGIL';
var version = '1.0';
var displayName = 'VIGIL Database';
var maxSize = 100000;

try {
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
    } else {
        VIGIL = openDatabase(shortName, version, displayName, maxSize);
        createTables();
    }
} catch(e) {
    if (e == 2) {
        console.log("Invalid database version.");
    } else {
        console.log("Unknown error "+e.toString()+".");
    }
}

chrome.tabs.onCreated.addListener(function(tab){
	checkDb(tab.url);
    console.log("opened this : "+ tab.url.toString())
});

/*
function prepareDatabase(ready, error) {
    var dbName = 'vigil';
    var dbVersion = '1.0';
    var displayName = 'url counter';
    var dbSize = 5*1024*1024;
    return openDatabase(dbName, dbVersion, displayName, dbSize, function (db) {
        db.changeVersion('', '1.0', function (t) {
            t.executeSql('CREATE TABLE docids (id, name)');
        }, error);
    });
}
*/

function createTables(){
    VIGIL.transaction(
        function (transaction) {
            var sqlCommand = 'CREATE TABLE IF NOT EXISTS vigil(id INTEGER NOT NULL PRIMARY KEY, url TEXT NOT NULL, count INTEGER default 0);';
            transaction.executeSql(sqlCommand);

            sqlCommand = 'CREATE TABLE IF NOT EXISTS vigil_created(id INTEGER NOT NULL PRIMARY KEY, date INTEGER NOT NULL);';
            transaction.executeSql(sqlCommand);
            console.log("Created Tables.")
        }
    );
    prePopulate();
}

function prePopulate(){
    VIGIL.transaction(
        function (transaction) {
            var date = new Date();
            date = date.getDate();
            var id = 1;
        transaction.executeSql("INSERT INTO vigil_created(id, date) VALUES (?, ?)", [id, date]);
        }
    );
}

function selectAll(){
    VIGIL.transaction(
        function (transaction) {
            transaction.executeSql("SELECT * FROM vigil;", [],
                dataSelectHandler, errorHandler);
        }
    );
}

function checkDb(url){
    query = "SELECT id, count FROM vigil WHERE url = "+url.toString();
    VIGIL.transaction(function(transaction){
        transaction.executeSql(query, [], function(transaction, result){
            insertInDb(result, url);
        }, null);
    });
}

function insertInDb(result, url){
    if(result.length == 2){
        id = parseInt(result[0]);
        count = parseInt(result[1]);
        count++;
        var query = "UPDATE vigil SET count="+count.toString()+" WHERE id="+id.toString();
        VIGIL.transaction(
            function(transaction){
                transaction.executeSql(query);
            }
        );
    }
    else{
        var query = "INSERT INTO vigil(id, url, count) VALUES (1,"+url.toString()+", 1)";
        VIGIL.transaction(function(transaction){
            transaction.executeSql(query);
        });
    }

    query = "SELECT * FROM vigil"
}
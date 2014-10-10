chrome.tabs.onCreated.addListener(function(tab){
	alert(tab);
    initDatabase()
});


function initDatabase() {
    try {
        if (!window.openDatabase) {
            alert('Databases are not supported in this browser.');
        } else {
            var shortName = 'VIGIL';
            var version = '1.0';
            var displayName = 'VIGIL Database';
            var maxSize = 100000;
            VIGIL = openDatabase(shortName, version, displayName, maxSize);
            createTables();
            selectAll();
        }
    } catch(e) {
        if (e == 2) {
            console.log("Invalid database version.");
        } else {
            console.log("Unknown error "+e.toString()+".");
        }
        return;
    }
}

function createTables(){
    VIGIL.transaction(
        function (transaction) {
            var sqlCommand = 'CREATE TABLE IF NOT EXISTS vigil(id INTEGER NOT NULL PRIMARY KEY, url TEXT NOT NULL, count INTEGER default 0);';
            transaction.executeSql(sqlCommand, [], nullDataHandler, errorHandler);

            sqlCommand = 'CREATE TABLE IF NOT EXISTS vigil_created(id INTEGER NOT NULL PRIMARY KEY, date INTEGER NOT NULL);';
            transaction.executeSql(sqlCommand, [], nullDataHandler, errorHandler);
            console.log("Created Tables.")
        }
    );
    prePopulate();
}

function prePopulate(){
    VIGIL.transaction(
        function (transaction) {
        var data = [1, new Date.getDate()];
        transaction.executeSql("INSERT INTO vigil_created(id, date) VALUES (?, ?)", [data[0], data[1]]);
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
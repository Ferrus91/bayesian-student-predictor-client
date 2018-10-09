// Basic init from https://github.com/pastahito/electron-react-webpack
const electron = require('electron');
const fs = require('fs');
const sql = require('sql.js');

const { app, ipcMain, BrowserWindow } = electron;
const databaseFile = './Database/results.sqlite';
const filebuffer = fs.readFileSync(databaseFile);
const saveDatabaseToFile = () => {
  const data = db.export();
  const buffer = new Buffer(data);
  fs.writeFileSync(databaseFile, buffer);
}

const db = new sql.Database(filebuffer);
const createTable = db.run(`CREATE TABLE IF NOT EXISTS prediction_results 
  (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    success INTEGER,
    successProbability REAL,
    studentCode TEXT,
    MatSciEng_d TEXT,
    CompSkill_d TEXT,
    SecEduMark_d TEXT,
    PriEduMark_d TEXT,
    module1_Group_d TEXT,
    module2_Group_d TEXT,
    module3_Group_d TEXT,
    module4_Group_d TEXT,
    module5_Group_d TEXT
  );`);

saveDatabaseToFile();

// Let electron reloads by itself when webpack watches changes in ./app/
require('electron-reload')(__dirname)

// To avoid being garbage collected
let mainWindow

app.on('ready', () => {

    mainWindow = new BrowserWindow({width: 800, height: 600})

    mainWindow.loadURL(`file://${__dirname}/app/index.html`)

});

ipcMain.on('success-data', (event, arg) => {
  event.preventDefault();
  const nullValue = 'null';
  const query = `INSERT INTO prediction_results (success, successProbability, studentCode, MatSciEng_d, CompSkill_d, SecEduMark_d, PriEduMark_d, module1_Group_d, module2_Group_d, module3_Group_d, module4_Group_d, module5_Group_d)
   VALUES (
     ${arg.success === true ? 2 : 4}, 
     ${arg.successProbability},
     '${arg.studentCode}',
     '${arg.query['MatSciEng_d'] ? arg.query['MatSciEng_d'] : nullValue}',
     '${arg.query['CompSkill_d'] ? arg.query['CompSkill_d'] : nullValue}',
     '${arg.query['SecEduMark_d'] ? arg.query['SecEduMark_d'] : nullValue}',
     '${arg.query['PriEduMark_d'] ? arg.query['PriEduMark_d'] : nullValue}',
     '${arg.query['module1_Group_d'] ? arg.query['module1_Group_d'] : nullValue}',
     '${arg.query['module2_Group_d'] ? arg.query['module2_Group_d'] : nullValue}',
     '${arg.query['module3_Group_d'] ? arg.query['module3_Group_d'] : nullValue}',
     '${arg.query['module4_Group_d'] ? arg.query['module4_Group_d'] : nullValue}',
     '${arg.query['module5_Group_d'] ? arg.query['module5_Group_d'] : nullValue}'
   );`;
   db.exec(query);
   saveDatabaseToFile();
});

ipcMain.on('request-database-entries', () => {
  const result = db.exec("SELECT * FROM prediction_results");
  const entries = result ? ((result[0] || {}).values || []).map((value) => {
    const [
      id,
      success,
      successProbability,
      studentCode,
      mathsSciEng,
      compSkill,
      secEduMark,
      priEduMark,
      module1,
      module2,
      module3,
      module4,
      module5 
    ] = value;
    return {
      id,
      success,
      successProbability,
      studentCode,
      'MatSciEng_d': mathsSciEng,
      'CompSkill_d': compSkill,
      'SecEduMark_d': secEduMark,
      'PriEduMark_d': priEduMark,
      'module1_Group_d': module1,
      'module2_Group_d': module2,
      'module3_Group_d': module3,
      'module4_Group_d': module4,
      'module5_Group_d': module5,
    }
  }) : [];
  mainWindow.send('receive-database-entries', { entries });
})
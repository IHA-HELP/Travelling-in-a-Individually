# Travelling-in-a-Individuallyvar SPREADSHEET = '1j2xLQ8Z1sa0ny2mp77Ipu1-LEDgyuubUWFhZalQ9Dqk';
var INFO_FLYER_YES = 'ja';
var SHEET_INDIVIDUALLY = 'Fragebogen - Individuell';
var INFO_FLYER = 'Info Fyler';
var EMAIL_ADDRESS_FIELD = 'E-Mail address';

var EMAIL_ADDRESS = 'E-Mail address';
var EMAIL_REPLY_TO_ADDRESS = 'info@iha.help';
var EMAIL_DISPLAY_NAME = 'Inter-­European Aid Association';

var SUBJECT_DE_CAR = 'Einzeln - Fahrzeug verfügbar';
var SUBJECT_EN_CAR = 'Individual - car available';
var SUBJECT_DE_LIFT = 'Einzeln - Mitfahrgelegenheit benötigt';
var SUBJECT_EN_LIFT = 'Individual - lift needed';

var BODY_DE_CAR = '167CZfaRvLbNlPh6XioZuXxx9efwgUMQnLM0htLBP7ZQ';
var BODY_EN_CAR = '1qTUlm4lI184tbzOVItIrye3FrcT6WfqVjIbCeEMqeig';
var BODY_DE_LIFT = '10ap2iHd6DVLAEteobPBlurAcr1YQBVBvW3hV8moFgBg';
var BODY_EN_LIFT = '1eKDMAtkG-ZW7WdBh59-GrrsquP2v_NANRCbYT1NYqFw';

var ATTACHMENTS_PACKAGING = '0By52Ty8g_M6JVDBCc24wUk5Ra1k';
var ATTACHMENTS_VOLUNTEER_INFO = '0By52Ty8g_M6JYXRsMUZLUGdRVm8';
var ATTACHMENTS_LABELS = '0By52Ty8g_M6JUHZQdW4wclhqVGs';

var INDIVIDUAL_TRANSPORTATION = 'Transportation';
var INDIVIDUAL_CAR = 'I have a car';
var INDIVIDUAL_LIFT = 'I need a lift';

var LANGUAGE = 'Preferred communication language';
var LANGUAGE_ENGLISH = 'English';
var LANGUAGE_GERMAN = 'German';

var FORM_EMAIL = 1.820831114E9;
var FORM_LANGUAGE = 1.805670388E9;
var FORM_TRANSPORTATION = 1.087847696E9;

function test() {
  var range = SpreadsheetApp.openById('1j2xLQ8Z1sa0ny2mp77Ipu1-LEDgyuubUWFhZalQ9Dqk').getSheetByName(SHEET_TEAMS).getRange('a1');
  var values = {
    'E-Mail address': ['kugelmann.dennis@gmail.com'],
    'Transportation': [INDIVIDUAL_CAR],
    'Free seats': ['0'],
    'Preferred communication language': [LANGUAGE_ENGLISH]
  }
  var e = {
    range: range,
    namedValues: values
  }
  onFormSubmit(e);
}

function onFormSubmit(e) {
  var form = FormApp.getActiveForm();
  var emailItem = form.getItemById(FORM_EMAIL);
  var languageItem = form.getItemById(FORM_LANGUAGE);
  var transportationItem = form.getItemById(FORM_TRANSPORTATION);
  
  var emailResponse = e.response.getResponseForItem(emailItem);
  var languageResponse = e.response.getResponseForItem(languageItem);
  var transportationResponse = e.response.getResponseForItem(transportationItem);
  
  var email = emailResponse.getResponse();
  var language = languageResponse.getResponse();
  var transportation = transportationResponse.getResponse();
  
  var packaging = DriveApp.getFileById(ATTACHMENTS_PACKAGING);
  var volunteerInfo = DriveApp.getFileById(ATTACHMENTS_VOLUNTEER_INFO);
  var labels = DriveApp.getFileById(ATTACHMENTS_LABELS);
  
  var attachments = [packaging.getAs(MimeType.PDF), 
                     volunteerInfo.getAs(MimeType.PDF), 
                     labels.getAs(MimeType.PDF)];
  
  //Send individual files
  if (transportation == INDIVIDUAL_CAR) {
    //Send have a car
    if (language == LANGUAGE_GERMAN) {
      //Send german version
      sendEmail(email, SUBJECT_DE_CAR, BODY_DE_CAR, attachments);
      Logger.log('individual > car > german');
    } else {
      //Send english version
      sendEmail(email, SUBJECT_EN_CAR, BODY_EN_CAR, attachments);
      Logger.log('individual > car > english');
    }
  } else if (transportation == INDIVIDUAL_LIFT) {
    //Send need a lift
    if (language == LANGUAGE_GERMAN) {
      //Send german version
      sendEmail(email, SUBJECT_DE_LIFT, BODY_DE_LIFT, attachments);
      Logger.log('individual > lift > german');
    } else {
      //Send english version
      sendEmail(email, SUBJECT_EN_LIFT, BODY_EN_LIFT, attachments);
      Logger.log('individual > lift > english');
    }
  }
}

function sendEmail(email, subject, contentID, attachments) {
  var content = DocumentApp.openById(contentID)
                                 .getBody()
                                 .editAsText()
                                 .getText();
  MailApp.sendEmail(email, subject, content, {
    attachments: attachments,
    name: EMAIL_DISPLAY_NAME,
    replyTo: EMAIL_REPLY_TO_ADDRESS
  });
  
  var ss = SpreadsheetApp.openById(SPREADSHEET);
  var sheet = ss.getSheetByName(SHEET_INDIVIDUALLY);
  var emailColumn = findColumn(sheet, EMAIL_ADDRESS_FIELD);
  var row = findEmailRow(sheet, emailColumn, email);
  var column = findColumn(sheet, INFO_FLYER);
  sheet.getRange(row, column).setValue(INFO_FLYER_YES);
}

function findColumn(sheet, type) {
  var range = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues();
  for(i=0; i<range[0].length; i++) {
    if (range[0][i] === type) {
      return i+1;
    }
  }
  return -1;
}

function findEmailRow(sheet, column, email) {
  var range = sheet.getRange(2, column, sheet.getLastRow()-1).getValues();
  for(n=range.length-1; n>=0; n--) {
    if(range[n][0] === email) {
      return n+2
    }
  }
}

function log() {
  var form = FormApp.getActiveForm();
  var items = form.getItems();
  for(i=0; i<items.length; i++) {
    var title = items[i].getTitle();
    var id = items[i].getId();
    Logger.log(title);
    Logger.log(id);
  }
}

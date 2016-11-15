// This script let's you send a mail to everybody who fills out your form.
// What you need:
// a) A Google Form with an E-Mail field
// b) A Google Spreadsheet where all the answers are stored (created out of the form)
// c) A Google Doc where you can enter the body of the mail
// d) Upload your PDF-Attachments in GDrive


var SPREADSHEET = '[your Spreadsheet ID (take it form the URL)]'; //TODO Add the SpreadsheetID (created in b)
//var INFO_FLYER_YES = 'ja';
var SHEET_INDIVIDUALLY = '[sheet name]'; //TODO use the name of the Spreadsheet name
//var INFO_FLYER = 'Info Fyler';
var EMAIL_ADDRESS_FIELD = 'E-Mail address'; //TODO use the name of the mail field in the FORM

var EMAIL_ADDRESS = 'E-Mail address';  //TODO use the name of the column
var EMAIL_REPLY_TO_ADDRESS = 'volunteer@keshaniya.org'; //TODO use the address where replys to your mail should end up
var EMAIL_DISPLAY_NAME = 'Keschaniya Kitchen'; //TODO the displayed name of sender

var SUBJECT = '[Autoresponse] ...'; //TODO edit as you desire

var BODY = '10Cb6U3xEmMQjUIm123KAQ3p5QlNe6Z1NJim3Wpb6_Jw'; //TODO use the ID of the document created in c)


// TODO  Use the ID of the PDF and insert it here:
var ATTACHMENT1 = '[ID]';
var ATTACHMENT2 = '[ID]';
var ATTACHMENT3 = '[ID]';

var FORM_EMAIL = '[ID]'; // TODO: get ID via the `test` function

 //this section is for testing your script.
 function test() {
     //the ID is the same as before
    var range = SpreadsheetApp.openById(SPREADSHEET).getSheetByName(SHEET_INDIVIDUALLY).getRange('a1');
    var values = {
        'E-Mail address': ['/* use your mail address */'],

    }
    var e = {
        range: range,
        namedValues: values
    }
    onFormSubmit(e);
}

// this part starts the script on form submition
function onFormSubmit(e) {
    var form = FormApp.getActiveForm();
    var emailItem = form.getItemById(FORM_EMAIL);

    var emailResponse = e.response.getResponseForItem(emailItem);

    var email = emailResponse.getResponse();
    var language = languageResponse.getResponse();
    var transportation = transportationResponse.getResponse();

    //
    var packaging = DriveApp.getFileById(ATTACHMENT1);
    var volunteerInfo = DriveApp.getFileById(ATTACHMENT2);
    var labels = DriveApp.getFileById(ATTACHMENT3);


    // TODO edit attachment names if needed (see ln 16)
    var attachments = [packaging.getAs(MimeType.PDF),
        volunteerInfo.getAs(MimeType.PDF),
        labels.getAs(MimeType.PDF)];

/*
 not needed when only one language!

 Send individual files
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
 */

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
}

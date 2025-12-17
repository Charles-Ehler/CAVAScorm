/*******************************************************************************
 **
 ** This function is used to tell the LMS to initiate the communication session
 ** using the APIWrapper.js file as a pass through.
 **
 ** Inputs:  None
 **
 ** Return:  String - "true" if the initialization was successful, or
 **          "false" if the initialization failed.
 **
 *******************************************************************************/
function initialize() {
  // make initialize call
  var init = initializeCommunication();
  var errorCode;
  if (init) {
    // set completion status to incomplete
    setIncomplete();
    // set exit to suspended
    storeDataValue("cmi.core.exit", "suspend");
    return true;
  } else {
    return false;
  }
}
/*******************************************************************************
 **
 ** Makes the appropriate calls for a normal exit calling Terminate
 **
 ** Inputs:  None
 **
 ** Return:  None
 **
 *******************************************************************************/
function terminate() {
  var status = retrieveDataValue("cmi.core.lesson_status");
  if (status == "completed") {
    storeDataValue("cmi.core.exit", "logout");
  }
  terminateCommunication();
  // try to close the window (some lms's don't close the popup window)
  try { window.close(); }
  catch(e) {}
}
/*******************************************************************************
 **
 ** Sets the SCO completion status to incomplete.
 **
 ** Inputs:  None
 **
 ** Return:  None
 **
 *******************************************************************************/
function setIncomplete() {
  var status = retrieveDataValue("cmi.core.lesson_status");
  if (status != "completed") {
    return storeDataValue("cmi.core.lesson_status", "incomplete");
  } else {
    return true;
  }
}
/*******************************************************************************
 **
 ** Sets the SCO completion status to complete.
 **
 ** Inputs:  None
 **
 ** Return:  None
 **
 *******************************************************************************/
function setComplete() {
  storeDataValue("cmi.core.score.min", "0");
  storeDataValue("cmi.core.score.max", "100");
  storeDataValue("cmi.core.score.raw", "100");
  storeDataValue("cmi.success_status", "passed");
  return storeDataValue("cmi.core.lesson_status", "completed");
}

function parseQS(pQS, pID) {
  var intPos = pQS.indexOf('?');
  if (intPos >= 0) {
    pQS = pQS.substr(intPos + 1, pQS.length);
  }
  var rootArr = pQS.split("&");
  var strOut = "";
  for (i = 0; i < rootArr.length; i++) {
    var tempArr = rootArr[i].split("=");
    if (tempArr.length == 2) {
      if (tempArr[0] == pID) {
        strOut = tempArr[1];
        break;
      }
    }
  }
  return strOut;
}

function setProgress(key, value) {
  if (key === "status") {
    if (value === "completed") {
      return setComplete();
    } else {
      return setIncomplete();
    }
  } else if (key === "location") {
    return storeDataValue("cmi.core.lesson_location", value);
  }
}

function receiveMessage(event) {
  if (event.origin !== complianceUrl) return;
  switch (event.data.event_type) {
    case "integrated-content-init":
      //displayMessage(0);
      break;
    case "integrated-content-progress":
      if (!event.key && !event.value) {
        break;
      }
      let isSuccess = storeProgress(event.key, event.value);
      if (isSuccess.toString() === "true") {
        persistData();
      } else {
        displayMessage(110);
      }
      break;
    case "integrated-content-complete":
      setComplete();
      persistData();
      break;
    case "integrated-content-close":
      persistData();
      terminate();
      break;
  }
}

function displayMessage(id) {
  switch (id) {
    case 0:
      alert(EFCommunicationMessage.Message_0);
      break;
    case 10:
      alert(EFCommunicationMessage.Message_10);
      break;
    case 100:
      alert(EFCommunicationMessage.Message_100);
      break;
    case 110:
      alert(EFCommunicationMessage.Message_110);
      break;
  }
  return true;
}
var EFCommunicationMessage = {
  Message_0: "Course is in session. Please don't close this window.",
  Message_10: "Course session is closed. Thank you.",
  Message_100: "Error occurred.<br/> ID: 100" + " <br/> Message: Cannot establish communication with LMS to get student information. Please contact your LMS administrator.",
  Message_110: "Error occurred.<br/> ID: 110" + " <br/> Message: Cannot establish communication with LMS to update course status. Please contact your LMS administrator."
};

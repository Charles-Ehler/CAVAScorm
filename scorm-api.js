{\rtf1\ansi\ansicpg1252\cocoartf2867
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww11520\viewh8400\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 // Minimal SCORM 1.2 API stub for GitHub Pages preview.\
// Enables Storyline / SCORM content to run without an LMS.\
\
(function () \{\
  if (window.API) return;\
\
  const storeKey = "scorm12_preview_store_v1";\
  const loadStore = () => \{\
    try \{ return JSON.parse(localStorage.getItem(storeKey) || "\{\}"); \}\
    catch \{ return \{\}; \}\
  \};\
  const saveStore = (s) => localStorage.setItem(storeKey, JSON.stringify(s));\
\
  let store = loadStore();\
  store["cmi.core.student_id"] ??= "preview-user";\
  store["cmi.core.student_name"] ??= "Preview User";\
  store["cmi.core.lesson_status"] ??= "not attempted";\
  store["cmi.core.entry"] ??= "";\
  store["cmi.core.exit"] ??= "";\
  store["cmi.core.score.raw"] ??= "";\
  store["cmi.suspend_data"] ??= "";\
  store["cmi.core.lesson_location"] ??= "";\
  saveStore(store);\
\
  let lastError = "0";\
\
  const ok = () => "true";\
  const fail = (code) => \{ lastError = String(code); return "false"; \};\
\
  window.API = \{\
    LMSInitialize: function () \{ lastError = "0"; return ok(); \},\
    LMSFinish: function () \{ lastError = "0"; store = loadStore(); saveStore(store); return ok(); \},\
\
    LMSGetValue: function (k) \{\
      lastError = "0";\
      store = loadStore();\
      return (store[k] ?? "");\
    \},\
\
    LMSSetValue: function (k, v) \{\
      lastError = "0";\
      store = loadStore();\
      store[k] = String(v);\
      saveStore(store);\
      return ok();\
    \},\
\
    LMSCommit: function () \{ lastError = "0"; store = loadStore(); saveStore(store); return ok(); \},\
\
    LMSGetLastError: function () \{ return lastError; \},\
    LMSGetErrorString: function (c) \{ return String(c) === "0" ? "No error" : "SCORM API stub error"; \},\
    LMSGetDiagnostic: function () \{ return "Running in GitHub Pages SCORM preview stub."; \}\
  \};\
\})();}
// direct Google Workspace integration REST functions using the in-memory cached OAuth token

/**
 * Google Drive API: Creates a file in Google Drive.
 */
export async function driveCreateFile(
  token: string, 
  name: string, 
  mimeType: string, 
  content: string
): Promise<{ id: string; webViewLink?: string }> {
  const boundary = "boundary_capability_pro_sa";
  const metadata = {
    name: name,
    mimeType: mimeType
  };

  const multipartBody = 
    `\r\n--${boundary}\r\n` +
    `Content-Type: application/json; charset=UTF-8\r\n\r\n` +
    `${JSON.stringify(metadata)}\r\n` +
    `--${boundary}\r\n` +
    `Content-Type: ${mimeType}\r\n\r\n` +
    `${content}\r\n` +
    `--${boundary}--`;

  const res = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,webViewLink", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": `multipart/related; boundary=${boundary}`
    },
    body: multipartBody
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Google Drive upload failed: ${errorText}`);
  }

  return await res.json();
}

/**
 * Google Sheets API: Creates a Google Spreadsheet populated with headers and rows.
 */
export async function sheetsCreateSpreadsheet(
  token: string,
  title: string,
  headers: string[],
  rows: any[][]
): Promise<{ id: string; spreadsheetUrl?: string }> {
  // 1. Create Spreadsheet
  const createRes = await fetch("https://sheets.googleapis.com/v4/spreadsheets", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      properties: {
        title: title
      }
    })
  });

  if (!createRes.ok) {
    const errorText = await createRes.text();
    throw new Error(`Failed to create spreadsheet: ${errorText}`);
  }

  const spreadsheet = await createRes.json();
  const spreadsheetId = spreadsheet.spreadsheetId;

  // 2. Insert values (headers + rows)
  const values = [headers, ...rows];
  const updateRes = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A1:Z${values.length}?valueInputOption=USER_ENTERED`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      range: `Sheet1!A1:Z${values.length}`,
      majorDimension: "ROWS",
      values: values
    })
  });

  if (!updateRes.ok) {
    const errorText = await updateRes.text();
    throw new Error(`Failed to insert data into spreadsheet: ${errorText}`);
  }

  return { id: spreadsheetId, spreadsheetUrl: spreadsheet.spreadsheetUrl };
}

/**
 * Google Forms API: Creates a Google Form for collecting company profiles or tenders.
 */
export async function formsCreateForm(
  token: string,
  title: string,
  description: string
): Promise<{ formId: string; responderUri: string }> {
  // 1. Create form metadata
  const createRes = await fetch("https://forms.googleapis.com/v1/forms", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      info: {
        title: title,
        documentTitle: title,
        description: description
      }
    })
  });

  if (!createRes.ok) {
    const errorText = await createRes.text();
    throw new Error(`Failed to create Google Form: ${errorText}`);
  }

  const form = await createRes.json();
  const formId = form.formId;

  // 2. Add sample items (questions) to retrieve basic bid info
  const updateRes = await fetch(`https://forms.googleapis.com/v1/forms/${formId}:batchUpdate`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      requests: [
        {
          createItem: {
            item: {
              title: "What is your registered CIPC registered company name?",
              questionItem: {
                question: {
                  required: true,
                  textQuestion: {}
                }
              }
            },
            location: { index: 0 }
          }
        },
        {
          createItem: {
            item: {
              title: "What is your Central Supplier Database (CSD) MAAA Number?",
              questionItem: {
                question: {
                  required: true,
                  textQuestion: {}
                }
              }
            },
            location: { index: 1 }
          }
        },
        {
          createItem: {
            item: {
              title: "Briefly explain the primary scope of your services.",
              questionItem: {
                question: {
                  required: false,
                  textQuestion: { paragraph: true }
                }
              }
            },
            location: { index: 2 }
          }
        }
      ]
    })
  });

  if (!updateRes.ok) {
    const errorText = await updateRes.text();
    throw new Error(`Failed to configure items in Google Form: ${errorText}`);
  }

  return { formId: formId, responderUri: form.responderUri };
}

/**
 * Google Calendar & Google Meet API: Creates a calendar event with a Google Meet conference link configured.
 */
export async function calendarCreateMeetEvent(
  token: string,
  summary: string,
  description: string,
  startIso: string,
  endIso: string
): Promise<{ eventLink: string; meetLink?: string }> {
  const eventData = {
    summary: summary,
    description: description,
    start: {
      dateTime: startIso,
      timeZone: "Africa/Johannesburg"
    },
    end: {
      dateTime: endIso,
      timeZone: "Africa/Johannesburg"
    },
    conferenceData: {
      createRequest: {
        requestId: `meet-${Date.now()}`,
        conferenceSolutionKey: {
          type: "hangoutsMeet"
        }
      }
    }
  };

  const res = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events?conferenceDataVersion=1", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(eventData)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to create Google Calendar event: ${errorText}`);
  }

  const event = await res.json();
  const meetLink = event.conferenceData?.entryPoints?.find(
    (ep: any) => ep.entryPointType === "video"
  )?.uri;

  return {
    eventLink: event.htmlLink,
    meetLink: meetLink
  };
}

/**
 * Google Chat API: Sends a status update message to Google Chat spaces.
 */
export async function chatPostMessage(
  token: string,
  spaceName: string, // format: "spaces/SPACE_ID"
  text: string
): Promise<any> {
  const res = await fetch(`https://chat.googleapis.com/v1/${spaceName}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      text: text
    })
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to send message to Google Chat space: ${errorText}`);
  }

  return await res.json();
}

/**
 * Google Chat API: Lists all accessible user Google Chat Spaces.
 */
export async function chatListSpaces(token: string): Promise<{ name: string; displayName: string }[]> {
  const res = await fetch("https://chat.googleapis.com/v1/spaces", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error listing Google Chat Spaces: ${errorText}`);
  }

  const data = await res.json();
  return data.spaces || [];
}

/**
 * Gmail API: Sends a standard text email.
 */
export async function gmailSendEmail(
  token: string,
  to: string,
  subject: string,
  bodyText: string
): Promise<void> {
  const utf8Subject = `=?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`;
  const emailLines = [
    `To: ${to}`,
    `Subject: ${utf8Subject}`,
    "Content-Type: text/html; charset=utf-8",
    "MIME-Version: 1.0",
    "",
    `<div>${bodyText.replace(/\n/g, '<br/>')}</div>`
  ];

  const emailRaw = emailLines.join("\r\n").trim();
  const safeBase64Encoded = btoa(unescape(encodeURIComponent(emailRaw)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  const res = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      raw: safeBase64Encoded
    })
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Failed to send email via Gmail API: ${errorText}`);
  }
}

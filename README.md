# Electron React Express MySQL App

This is a desktop application built with Electron, featuring a React front-end, Express back-end, and MySQL database integration.

## Setup

1. Ensure Node.js and npm are installed.
2. Install dependencies: `npm install`
3. Build the React app: `npm run build`
4. Start the Express server: `npm run server` (runs on port 3001)
5. Start the Electron app: `npm start`

For development: `npm run dev` (runs server and electron concurrently)

## Database

Connects to MySQL database 'esddms' on localhost with user root, password 1234.

Table: tblverification2

Columns displayed: lastname, firstname, mi, authCOEImage, authIDImage

## Features

- Displays data from MySQL in a table on the homepage.

- List Certification and Authentication of Eligibilities requests
- View Eligibility details
- Create Filter:
    * by date
    * by doc status
- Show/Upload/Update COE image/photo
- Show/Upload/Update ID image/photo
    * Selects image to upload
    * Copies image to the filepath configured, renamed to 'yyyy-mm-dd_' + lastname + <'-COE' or '-ID'> . fileextension
- Generate / link QR code
- Select Signatory for the authenticated copy
- Print Authenticated copy

## Under contstruction
- Create/print CoE in SecPa
- Store/Set filepath for COE and ID upload
    

## Build the app
- For 64-bit application
npm run make
- For 32-bit application
npx electron-forge package --platform=win32 --arch=ia32
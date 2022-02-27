const { GoogleSpreadsheet } = require('google-spreadsheet');
import { pageIds } from '../../lookup';

const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL;
const PRIVATE_KEY = process.env.GOOGLE_SERVICE_PRIVATE_KEY;
const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

export default async function handler(req, res) {
  let availableComponents = [];
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    private_key: process.env.GOOGLE_SERVICE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  });
  await doc.loadInfo(); // loads document properties and worksheets
  const sheet = doc.sheetsById[pageIds.total];
  const row = await sheet.getRows();
  row.forEach((item) => {
    if (item['Available Stock'] > 0) {
      availableComponents.push({
        component: item['Component'],
        available: item['Available Stock'],
      });
    }
  });
  res.status(200).json({ data: availableComponents });
}

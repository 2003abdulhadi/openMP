import { parseStringPromise } from "xml2js";

export function GET() {
  return fetch("https://www.ourcommons.ca/Members/en/party-standings/XML")
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.body);
      }
      return response.text();
    })
    .then((xml) => parseStringPromise(xml))
    .then((json) => {
      // Extract relevant data
      const standings = json.ArrayOfPartyStanding.PartyStanding.map(
        (s) => ({
          provinceTerritory: s.ProvinceTerritoryName[0],
          party: s.CaucusShortName[0],
          seats: s.SeatCount[0],
        })
      );

      return Response.json(standings);
    })
    .catch((err) => {
      return new Response(err, { status: 500 });
    });
}

import { parseStringPromise } from "xml2js";

export function GET() {
  return fetch("https://www.ourcommons.ca/Members/en/chair-occupants/XML")
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.body);
      }
      return response.text();
    })
    .then((xml) => parseStringPromise(xml))
    .then((json) => {
      // Extract relevant data
      const standings = json.ArrayOfChairOccupant.ChairOccupant.map((o) => ({
        honorificTitle: o.PersonShortHonorific[0],
        firstName: o.PersonOfficialFirstName[0],
        lastName: o.PersonOfficialLastName[0],
        title: o.Title[0],
        constituency: o.ConstituencyName[0],
        provinceTerritory: o.ProvinceTerritoryName[0],
        party: o.CaucusShortName[0],
        fromDateTime: o.FromDateTime[0],
        toDate:
          o.ToDateTime[0]?.$?.["xsi:nil"] === "true" ? null : mp.ToDateTime[0],
      }));

      return Response.json(standings);
    })
    .catch((err) => {
      return new Response(err, { status: 500 });
    });
}

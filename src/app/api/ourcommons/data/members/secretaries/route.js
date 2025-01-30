import { parseStringPromise } from "xml2js";

export function GET() {
  return fetch("https://www.ourcommons.ca/Members/en/parliamentary-secretaries/XML")
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.body);
      }
      return response.text();
    })
    .then((xml) => parseStringPromise(xml))
    .then((json) => {
      // Extract relevant data
      const secretaries = json.ArrayOfParliamentarySecretary.ParliamentarySecretary.map(
        (ps) => ({
          firstName: ps.PersonOfficialFirstName[0],
          lastName: ps.PersonOfficialLastName[0],
          title: ps.Title[0],
          constituency: ps.ConstituencyName[0],
          provinceTerritory: ps.ProvinceTerritoryName[0],
          party: ps.CaucusShortName[0],
        })
      );

      return Response.json(secretaries);
    })
    .catch((err) => {
      return new Response(err, { status: 500 });
    });
}

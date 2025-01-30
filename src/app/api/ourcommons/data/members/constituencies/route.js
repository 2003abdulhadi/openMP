import { parseStringPromise } from "xml2js";

export function GET() {
  return fetch("https://www.ourcommons.ca/Members/en/constituencies/XML")
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.body);
      }
      return response.text();
    })
    .then((xml) => parseStringPromise(xml))
    .then((json) => {
      // Extract relevant data
      const secretaries = json.ArrayOfConstituency.Constituency.map(
        (c) => ({
          name: c.Name[0],
          provinceTerritory: c.ProvinceTerritoryName[0],
          honorificTitle: c.CurrentPersonShortHonorific ? c.CurrentPersonShortHonorific[0] : null,
          firstName: c.CurrentPersonOfficialFirstName[0],
          lastName: c.CurrentPersonOfficialLastName[0],
          party: c.CurrentCaucusShortName[0],
        })
      );

      return Response.json(secretaries);
    })
    .catch((err) => {
      return new Response(err, { status: 500 });
    });
}

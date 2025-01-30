import { parseStringPromise } from "xml2js";

export async function GET() {
  return fetch("https://www.ourcommons.ca/Members/en/search/XML")
    .then((response) => {
      if (!response.ok) {
        throw new Error(response.body);
      }
      return response.text();
    })
    .then((xml) => parseStringPromise(xml))
    .then((json) => {
      // Extract relevant data
      const members = json.ArrayOfMemberOfParliament.MemberOfParliament.map(
        (mp) => ({
          firstName: mp.PersonOfficialFirstName[0],
          lastName: mp.PersonOfficialLastName[0],
          constituency: mp.ConstituencyName[0],
          provinceTerritory: mp.ConstituencyProvinceTerritoryName[0],
          party: mp.CaucusShortName[0],
          fromDate: mp.FromDateTime[0],
          toDate:
            mp.ToDateTime[0]?.$?.["xsi:nil"] === "true"
              ? null
              : mp.ToDateTime[0],
        })
      );

      return Response.json(members);
    })
    .catch((err) => {
      return new Response(err, { status: 500 });
    });
}

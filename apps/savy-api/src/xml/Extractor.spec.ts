import { expect } from "chai";

import Extractor from "./Extractor";

import TEST_LIST_USERS from "./test-data/fleet-users/list";
import TEST_ERROR_LIST_USERS from "./test-data/fleet-users/error";

describe("XML Extractor", () => {
  it("Should extract an array of mapped objects from an XML document", () => {
    const xmlDocument = TEST_LIST_USERS;

    const extractor = new Extractor(xmlDocument, ["ListUsers"]);

    const result = extractor.extract(
      ["AllianceService", "ListUsers", "Users", "User"],
      { id: "Id", name: "Name", trophy: "Trophy" }
    );

    expect(result).to.be.an("array");
    expect(result).to.have.lengthOf(2);
    expect(result[0]).to.have.property("id", "1000001");
    expect(result[0]).to.have.property("name", "PlayerOne");
    expect(result[0]).to.have.property("trophy", "5000");
    expect(result[1]).to.have.property("id", "1000002");
    expect(result[1]).to.have.property("name", "PlayerTwo");
    expect(result[1]).to.have.property("trophy", "4500");
  });

  it("Should return null if there is an error in the XML document", () => {
    const xmlDocument = TEST_ERROR_LIST_USERS;

    const extractor = new Extractor(xmlDocument, ["ListUsers"]);

    const result = extractor.extract(
      ["AllianceService", "ListUsers", "Users", "User"],
      { id: "Id", name: "Name", trophy: "Trophy" }
    );

    expect(result).to.be.null;
  });
});

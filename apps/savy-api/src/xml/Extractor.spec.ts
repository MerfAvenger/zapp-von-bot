import { expect } from "chai";

import Extractor from "./Extractor";

import TEST_LIST_USERS from "./test-data/fleet-users/list-users/list";
import TEST_ERROR_LIST_USERS from "./test-data/fleet-users/list-users/error";

import TEST_SEARCH_SINGLE_FLEET from "./test-data/fleets/search-fleets/single";
import TEST_SEARCH_LIST_FLEETS from "./test-data/fleets/search-fleets/list";

import { Fleet, User } from "../../../../packages/model/types";

describe("XML Extractor", () => {
  it("Should extract an array of mapped objects from an XML document", () => {
    const xmlDocument = TEST_LIST_USERS;

    const extractor = new Extractor(xmlDocument, ["ListUsers"]);

    const result = extractor.extract<User>(
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

  it("Should extract a single mapped object from an XML document", () => {
    const xmlDocument = TEST_SEARCH_SINGLE_FLEET;

    const extractor = new Extractor(xmlDocument, ["SearchAlliances"]);

    const result = extractor.extract<Fleet>(
      ["AllianceService", "SearchAlliances", "Alliances", "Alliance"],
      { id: "AllianceId", name: "AllianceName" }
    );

    expect(result).to.be.an("array");
    expect(result).to.have.lengthOf(1);
  });

  it("Should extract a list of objects with no closing tag", () => {
    const xmlDocument = TEST_SEARCH_LIST_FLEETS;

    const extractor = new Extractor(xmlDocument, ["SearchAlliances"]);

    const result = extractor.extract<Fleet>(
      ["AllianceService", "SearchAlliances", "Alliances", "Alliance"],
      { id: "AllianceId", name: "AllianceName" }
    );

    expect(result).to.be.an("array");
    expect(result).to.have.lengthOf(2);
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

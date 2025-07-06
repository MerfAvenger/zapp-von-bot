import { XMLParser } from "fast-xml-parser";
import mapXMLProperties, { PropertyMap } from "../utils/map/mapXMLProperties";

export default class Extractor {
  #dom: Object;

  constructor(xmlDocument: string, errorNodePath: string[]) {
    this.#dom = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "",
    }).parse(xmlDocument);
  }

  extract<TMappedObject>(
    pathNodes: string[],
    propertyMap?: PropertyMap
  ): TMappedObject | TMappedObject[] | null {
    const error = this.#getErrorFromDocument();

    if (error) {
      console.error(`Error in XML document: ${error}`);
      return null;
    }

    let object = this.#dom;

    pathNodes.forEach((pathProperty) => {
      if (object[pathProperty] !== undefined) {
        object = object[pathProperty];
      } else {
        console.error(`Path "${pathProperty}" not found in XML document.`);
        return null;
      }
    });

    if (!object) {
      console.warn("No object found at the specified path.");
      return null;
    }

    if (Array.isArray(object)) {
      return propertyMap
        ? ((object as any[]).map((child) =>
            mapXMLProperties(child, propertyMap)
          ) as TMappedObject[])
        : (object as TMappedObject[]);
    }

    return propertyMap
      ? mapXMLProperties(object, propertyMap)
      : (object as TMappedObject);
  }

  #getErrorFromDocument(): string | null {
    const error = this.#dom["ListUsers"]?.errorMessage;
    return error !== undefined ? error : null;
  }
}

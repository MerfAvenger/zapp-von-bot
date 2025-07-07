import { XMLParser } from "fast-xml-parser";
import { mapXMLProperties, PropertyMap } from "../utils/map/xml";
import Logger from "../logger/Logger";

export type NodePath = string[];

const logger = Logger.createWrapper("Extractor");

/**
 * An extractor class for parsing XML documents and extracting objects from them
 * using node paths.
 */
export default class Extractor {
  #dom: Object;
  #errorNodePath: NodePath;

  constructor(xmlDocument: string, errorNodePath: NodePath = []) {
    this.#dom = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "",
    }).parse(xmlDocument);
    this.#errorNodePath = errorNodePath;
  }

  /**
   * Extract an object from the XML document used to create this extractor,
   * optionally remapping its properties using a provided structure.
   *
   * @param pathNodes An array of path strings to traverse, in order, to find the target object.
   * @param propertyMap
   * @returns Either a singular or array of (optionally remapped) objects from the XML document, or null if an error occurs.
   */
  extract<TMappedObject>(
    pathNodes: NodePath,
    propertyMap?: PropertyMap
  ): TMappedObject | null {
    const error = this.#getErrorFromDocument();

    if (error) {
      logger.error(`Error in XML document: ${error}`);
      return null;
    }

    let object = this.#dom;

    pathNodes.forEach((pathProperty) => {
      if (object[pathProperty] !== undefined) {
        object = object[pathProperty];
      } else {
        logger.error(`Path "${pathProperty}" not found in XML document.`);
        return null;
      }
    });

    if (!object) {
      logger.warn("No object found at the specified path.");
      return null;
    }

    if (Array.isArray(object)) {
      return propertyMap
        ? ((object as any[]).map((child) =>
            mapXMLProperties(child, propertyMap)
          ) as TMappedObject)
        : (object as TMappedObject);
    }

    return propertyMap
      ? mapXMLProperties(object, propertyMap)
      : (object as TMappedObject);
  }

  /**
   * Check the XML document for an error message.
   *
   * @todo **Warning!** Currently only checks the first node in the errorNodePath.
   *
   * @returns The error message from the XML document if it exists, or null if no error is present.
   */
  #getErrorFromDocument(): string | null {
    const error = this.#dom[this.#errorNodePath[0]]?.errorMessage;
    return error !== undefined ? error : null;
  }
}

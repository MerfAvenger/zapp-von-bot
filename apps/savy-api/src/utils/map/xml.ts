export type PropertyMap = Record<string, string>;

/**
 * Maps properties from an XML object to the requested object structure based on the provided property map.
 *
 * @param object - The JSON parsed XMLobject to map properties from.
 * @param propertyMap - A mapping of parsed keys to unparsed keys.
 * @returns A new object with mapped properties.
 */
export function mapXMLProperties<TMappedObject>(
  object: any,
  propertyMap: PropertyMap
): TMappedObject {
  const mappedObject = {};

  Object.entries(propertyMap).forEach(([parsedKey, unparsedKey]) => {
    if (object[unparsedKey] !== undefined) {
      mappedObject[parsedKey] = object[unparsedKey];
    } else {
      console.warn(`Property "${unparsedKey}" not found in object.`);
    }
  });

  return mappedObject as TMappedObject;
}

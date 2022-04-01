import Fuse from "fuse.js";
import {
  createSearchEntries,
  createSearchIndex,
  getStringSlices,
} from "../app/utilities/search";

const json = {
  records: [
    {
      id: "1",
      createdAt: "2020-01-01T00:00:00.000Z",
      updatedAt: "2020-12-02T11:34:00.000Z",
      name: "John Doe",
      email: "john@doe.com",
      website: "https://john.doe.com",
      orders: [
        {
          id: "1",
          productName: "Product 1",
          quantity: 1,
          price: 10.0,
          currency: "USD",
        },
        {
          id: "2",
          productName: "Product 2",
          quantity: 100,
          price: 999.0,
          currency: "USD",
        },
      ],
    },
    {
      id: "2",
      createdAt: "2020-01-02T00:00:00.000Z",
      updatedAt: "2020-12-03T07:55:32.000Z",
      name: "Jane Doe",
      email: "jane@icloud.com",
      website: "https://jane.doe.co.uk",
      orders: [
        {
          id: "3",
          productName: "Product 3",
          quantity: 1,
          price: 10.0,
          currency: "GBP",
        },
        {
          id: "4",
          productName: "Product 1",
          quantity: 2,
          price: 76.45,
          currency: "GBP",
        },
      ],
    },
  ],
};

describe("getStringSlices", () => {
  it("returns a slice for each part of the string based on the matches", () => {
    const slices = getStringSlices(
      "This is a really great (short) string",
      [[9, 16]],
      60
    );

    expect(slices).toMatchInlineSnapshot(`
Array [
  Object {
    "end": 9,
    "isMatch": false,
    "slice": "This is a",
    "start": 0,
  },
  Object {
    "end": 17,
    "isMatch": true,
    "slice": " really ",
    "start": 9,
  },
  Object {
    "end": 37,
    "isMatch": false,
    "slice": "great (short) string",
    "start": 17,
  },
]
`);
  });
});

describe("createSearchIndex", () => {
  it("creates a search index that can search keys, raw values, and formatted values", () => {
    const [index, entries] = createSearchIndex(json);

    const fuse = new Fuse(
      entries,
      {
        includeScore: true,
        includeMatches: true,
        minMatchCharLength: 1,
        isCaseSensitive: false,
        threshold: 0.6,
        distance: 200,
      },
      index
    );

    const searchResults = fuse.search("john doe");

    expect(searchResults[0].item.path).toBe("$.records.0.name");
    expect(searchResults[1].item.path).toBe("$.records.0.email");
    expect(searchResults[2].item.path).toBe("$.records.0.website");
    expect(searchResults[3].item.path).toBe("$.records.1.name");

    const searchResultsPaths = fuse.search("currency");

    expect(searchResultsPaths[0].item.path).toBe(
      "$.records.0.orders.0.currency"
    );
    expect(searchResultsPaths[1].item.path).toBe(
      "$.records.0.orders.1.currency"
    );

    expect(searchResultsPaths[2].item.path).toBe(
      "$.records.1.orders.0.currency"
    );

    expect(searchResultsPaths[3].item.path).toBe(
      "$.records.1.orders.1.currency"
    );

    const searchResultsFormattedValues = fuse.search("dec 2");

    expect(searchResultsFormattedValues[0].item.path).toBe(
      "$.records.0.updatedAt"
    );
  });
});

describe("createSearchEntries", () => {
  it("creates searchable entries for the passed in json", () => {
    expect(createSearchEntries(json)).toMatchInlineSnapshot(`
Array [
  Object {
    "formattedValue": undefined,
    "path": "$.records",
    "rawValue": undefined,
  },
  Object {
    "formattedValue": undefined,
    "path": "$.records.0",
    "rawValue": undefined,
  },
  Object {
    "formattedValue": "1",
    "path": "$.records.0.id",
    "rawValue": "1",
  },
  Object {
    "formattedValue": "Jan 1, 2020, 12:00:00 AM GMT",
    "path": "$.records.0.createdAt",
    "rawValue": "2020-01-01T00:00:00.000Z",
  },
  Object {
    "formattedValue": "Dec 2, 2020, 11:34:00 AM GMT",
    "path": "$.records.0.updatedAt",
    "rawValue": "2020-12-02T11:34:00.000Z",
  },
  Object {
    "formattedValue": "John Doe",
    "path": "$.records.0.name",
    "rawValue": "John Doe",
  },
  Object {
    "formattedValue": "john@doe.com",
    "path": "$.records.0.email",
    "rawValue": "john@doe.com",
  },
  Object {
    "formattedValue": "https://john.doe.com",
    "path": "$.records.0.website",
    "rawValue": "https://john.doe.com",
  },
  Object {
    "formattedValue": undefined,
    "path": "$.records.0.orders",
    "rawValue": undefined,
  },
  Object {
    "formattedValue": undefined,
    "path": "$.records.0.orders.0",
    "rawValue": undefined,
  },
  Object {
    "formattedValue": "1",
    "path": "$.records.0.orders.0.id",
    "rawValue": "1",
  },
  Object {
    "formattedValue": "Product 1",
    "path": "$.records.0.orders.0.productName",
    "rawValue": "Product 1",
  },
  Object {
    "formattedValue": "1",
    "path": "$.records.0.orders.0.quantity",
    "rawValue": "1",
  },
  Object {
    "formattedValue": "10",
    "path": "$.records.0.orders.0.price",
    "rawValue": "10",
  },
  Object {
    "formattedValue": "USD",
    "path": "$.records.0.orders.0.currency",
    "rawValue": "USD",
  },
  Object {
    "formattedValue": undefined,
    "path": "$.records.0.orders.1",
    "rawValue": undefined,
  },
  Object {
    "formattedValue": "2",
    "path": "$.records.0.orders.1.id",
    "rawValue": "2",
  },
  Object {
    "formattedValue": "Product 2",
    "path": "$.records.0.orders.1.productName",
    "rawValue": "Product 2",
  },
  Object {
    "formattedValue": "100",
    "path": "$.records.0.orders.1.quantity",
    "rawValue": "100",
  },
  Object {
    "formattedValue": "999",
    "path": "$.records.0.orders.1.price",
    "rawValue": "999",
  },
  Object {
    "formattedValue": "USD",
    "path": "$.records.0.orders.1.currency",
    "rawValue": "USD",
  },
  Object {
    "formattedValue": undefined,
    "path": "$.records.1",
    "rawValue": undefined,
  },
  Object {
    "formattedValue": "2",
    "path": "$.records.1.id",
    "rawValue": "2",
  },
  Object {
    "formattedValue": "Jan 2, 2020, 12:00:00 AM GMT",
    "path": "$.records.1.createdAt",
    "rawValue": "2020-01-02T00:00:00.000Z",
  },
  Object {
    "formattedValue": "Dec 3, 2020, 7:55:32 AM GMT",
    "path": "$.records.1.updatedAt",
    "rawValue": "2020-12-03T07:55:32.000Z",
  },
  Object {
    "formattedValue": "Jane Doe",
    "path": "$.records.1.name",
    "rawValue": "Jane Doe",
  },
  Object {
    "formattedValue": "jane@icloud.com",
    "path": "$.records.1.email",
    "rawValue": "jane@icloud.com",
  },
  Object {
    "formattedValue": "https://jane.doe.co.uk",
    "path": "$.records.1.website",
    "rawValue": "https://jane.doe.co.uk",
  },
  Object {
    "formattedValue": undefined,
    "path": "$.records.1.orders",
    "rawValue": undefined,
  },
  Object {
    "formattedValue": undefined,
    "path": "$.records.1.orders.0",
    "rawValue": undefined,
  },
  Object {
    "formattedValue": "3",
    "path": "$.records.1.orders.0.id",
    "rawValue": "3",
  },
  Object {
    "formattedValue": "Product 3",
    "path": "$.records.1.orders.0.productName",
    "rawValue": "Product 3",
  },
  Object {
    "formattedValue": "1",
    "path": "$.records.1.orders.0.quantity",
    "rawValue": "1",
  },
  Object {
    "formattedValue": "10",
    "path": "$.records.1.orders.0.price",
    "rawValue": "10",
  },
  Object {
    "formattedValue": "GBP",
    "path": "$.records.1.orders.0.currency",
    "rawValue": "GBP",
  },
  Object {
    "formattedValue": undefined,
    "path": "$.records.1.orders.1",
    "rawValue": undefined,
  },
  Object {
    "formattedValue": "4",
    "path": "$.records.1.orders.1.id",
    "rawValue": "4",
  },
  Object {
    "formattedValue": "Product 1",
    "path": "$.records.1.orders.1.productName",
    "rawValue": "Product 1",
  },
  Object {
    "formattedValue": "2",
    "path": "$.records.1.orders.1.quantity",
    "rawValue": "2",
  },
  Object {
    "formattedValue": "76.45",
    "path": "$.records.1.orders.1.price",
    "rawValue": "76.45",
  },
  Object {
    "formattedValue": "GBP",
    "path": "$.records.1.orders.1.currency",
    "rawValue": "GBP",
  },
]
`);
  });
});

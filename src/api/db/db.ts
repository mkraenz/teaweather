import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { randomBytes } from "crypto";
import { Entity, OneSchema, Table } from "dynamodb-onetable";
import { Dynamo } from "dynamodb-onetable/Dynamo";
import { Env } from "../env";

export const getRandomId = (length: number) =>
  randomBytes(length * 6) // base64url encoding is 6 bits per character
    .toString("base64url")
    .replace("-", "")
    .replace("_", "")
    .substring(0, length);

const ISODateString = String; // Only for more expressive code
const ISODateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;

/**
 * @see Schema https://doc.onetable.io/api/table/schemas/attributes/
 * @see https://www.sensedeep.com/blog/posts/2021/dynamodb-onetable-tour.html
 * @see TS demo: https://github.com/sensedeep/dynamodb-onetable/blob/main/samples/typescript/src/index.ts
 * @see OneTable releases https://github.com/sensedeep/dynamodb-onetable/releases
 */
const snshubioOneSchema = {
  format: "onetable:1.1.0",
  version: "0.0.1",
  indexes: {
    primary: { hash: "pk", sort: "sk" },
  },
  models: {
    User: {
      pk: { type: String, value: "user#${id}" },
      sk: { type: String, value: "user#" }, // static value, i.e. only using the partition key
      id: {
        type: String,
        generate: "uid",
        required: true,
        encode: ["pk", "#", "1"],
      },
      locations: {
        type: Array,
        required: true,
        default: [],
        items: {
          type: Object,
          schema: {
            id: { type: String, generate: "uid", required: true },
            lat: { type: Number, required: true },
            lon: { type: Number, required: true },
            customName: { type: String },
            city: { type: String },
            countryCode: { type: String },
          },
        },
      },
      created: { type: ISODateString }, // autogen by OneTable
      updated: { type: ISODateString }, // autogen by OneTable
    },
  } as const,
  params: {
    isoDates: true,
    timestamps: true,
  },
};
const satisfiessnshubioOneSchema: OneSchema = snshubioOneSchema;

export type UserEntity = Entity<typeof snshubioOneSchema.models.User>;

const client = new Dynamo({
  client: new DynamoDBClient({
    region: Env.awsRegion,
    credentials: {
      accessKeyId: Env.awsAccessKeyId,
      secretAccessKey: Env.awsSecretAccessKey,
    },
  }),
});

export const myonetable = new Table({
  client: client,
  name: Env.awsDynamoDbTableName,
  schema: snshubioOneSchema,
  isoDates: true,
  partial: true,
});

export const UsersDb = myonetable.getModel("User");

/** Workaround for bug when a property contains curlies https://github.com/sensedeep/dynamodb-onetable/issues/352 */
export const escapeForOneTableUpdates = (
  unescapedSetParams: Record<string, unknown>
) => {
  const substitutions: Record<string, unknown> = {};
  const setParams: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(unescapedSetParams)) {
    if (typeof value === "string" && value.match(/\${.*?}|@{.*?}|{.*?}/)) {
      const idKey = getRandomId(4);
      substitutions[idKey] = value;
      setParams[key] = `@{${idKey}}`;
    } else {
      setParams[key] = value;
    }
  }

  return { set: setParams, substitutions };
};

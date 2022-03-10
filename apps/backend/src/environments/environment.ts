import { Environment } from "@finapp/common";

export const environment = {
  production: false,
  ...Environment.development,
};

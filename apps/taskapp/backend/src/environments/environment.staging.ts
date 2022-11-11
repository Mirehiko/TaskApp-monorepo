import { Environment } from "@taskapp/common";

export const environment = {
  production: false,
  ...Environment.staging,
};

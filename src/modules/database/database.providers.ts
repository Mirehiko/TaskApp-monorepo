import { createConnection } from 'typeorm';
import {Constants} from "../../shared/enums/constants";

export const databaseProviders = [
  {
    provide: Constants.DATABASE_CONNECTION,
    useFactory: async () => await createConnection({
      type: 'mongodb',
      host: 'mongodb+srv://mirehiko:587514483mongodb@cluster0.dr62h.mongodb.net/finances?retryWrites=true&w=majority',
      // port: 3306,
      // username: 'root',
      // password: 'root',
      // database: 'test',
      entities: [
          __dirname + '/../**/*.entity{.ts,.js}',
      ],
        // synchronize: true,
        synchronize: false,
    }),
  },
];

export class Environment {
  public static production = {
    // passport: {
    //   frontend: { url: "http://passport.kinetix.com", },
    //   backend: { url: "http://passport.kinetix.com", },
    // },
    taskapp: {
      frontend: { url: "http://kinetix.com", },
      backend: { url: "http://kinetix.com", },
    }
  };

  public static development = {
    // passport: {
    //   frontend: { url: "http://localhost:4210", },
    //   backend: { url: "http://localhost:4211", },
    // },
    taskapp: {
      frontend: { url: "http://localhost:4200", },
      backend: { url: "http://localhost:4500/api", },
    }
  };

  public static staging = {
    // passport: {
    //   frontend: { url: "http://localhost:4210", },
    //   backend: { url: "http://localhost:4211", },
    // },
    taskapp: {
      frontend: { url: "", },
      backend: { url: "/api", },
    }
  };
}

export type InstanceEnvironment = {
  // passport: {
  //   frontend: {
  //     url: string;
  //   };
  //   backend: {
  //     url: string;
  //   };
  // },
  taskapp: {
    frontend: {
      url: string;
    };
    backend: {
      url: string;
    };
  }
}

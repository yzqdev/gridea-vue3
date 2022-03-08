import macaddress from "macaddress";
import pkg from "../../package.json";

const isDevelopment = process.env.NODE_ENV !== "production";

interface EvOptions {
  evLabel?: any;
  evValue?: any;
}

const hostname = "http://client.gridea.dev";

class Analytics {
  private readonly ga: any;

  private clientId: any;

  constructor() {
    // this.ga = new GA("UA-113307620-4", { debug: isDevelopment });
    //
    // this.ga.set("version", (pkg as any).version);
  }

  public getClientId(callback: any) {
    // if (this.clientId) {
    //   callback(this.clientId);
    // }
    // macaddress.one((err: any, mac: string) => {
    //   this.clientId = mac;
    //   callback(mac);
    // });
      console.log('hhhh')
  }

  public async pageView(url: string, title?: string) {
    // this.getClientId(async (clientId: any) => {
    //   try {
    //     await this.ga.pageview(hostname, url, title, 1, clientId);
    //   } catch (e) {
    //     console.error(e);
    //   }
    // });
    await  console.log('hhhh')
  }

  public async event(evCategory: string, evAction: string, options: EvOptions) {
    await  console.log('hhhh')
    // this.getClientId(async (clientId: any) => {
    //   try {
    //     await this.ga.event(evCategory, evAction, {
    //       ...options,
    //       clientID: clientId,
    //     });
    //   } catch (e) {
    //     console.error(e);
    //   }
    // });
  }

  public async exception(exDesc: string, exFatal: any) {
    // this.getClientId(async (clientId: any) => {
    //   try {
    //     await this.ga.exception(exDesc, exFatal);
    //   } catch (e) {
    //     console.error(e);
    //   }
    // });
    await  console.log('hhhh')
  }
}

export default new Analytics();

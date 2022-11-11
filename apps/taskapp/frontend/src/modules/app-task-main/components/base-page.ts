import { Injector } from "@angular/core";
import { ActivatedRoute, Data, Params } from '@angular/router';
import { BehaviorSubject, combineLatest, Subscription } from "rxjs";
import { CoreService } from '../services/core.service';


export interface PageInitParams {
  routeParams: Params;
  queryParams: Params;
  routeData: Data;
  routeLink: string;
}

export abstract class BasePage {
  public componentReady: boolean = false;
  protected sub = new Subscription();
  protected params: PageInitParams;
  public core: CoreService;

  dataLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  protected constructor(
    protected injector: Injector,
  ) {
    this.init();
  }

  protected abstract initData(): Promise<void>;

  protected init(): void {
    const activatedRoute = this.injector.get(ActivatedRoute);
    this.sub.add(
      combineLatest([
        activatedRoute.params,
        activatedRoute.queryParams,
        activatedRoute.data,
      ]).subscribe(async (params) => {
        this.params = {
          routeParams: params[0],
          queryParams: params[1],
          routeData: params[2],
          routeLink: ''
        };

        setTimeout(async () => {
          await this.beforeInitData();
          await this.initData();
          this.componentReady = true;
          this.dataLoaded.next(true);
          this.dataLoaded.complete();
        });
      })
    );
  }

  abstract beforeInitData(): void;

  protected destroy(): void {
    this.sub.unsubscribe();
  }

  public beforeQuery(): void {
    this.core.loading = true;
  }

  public afterQuery(): void {
    this.core.loading = false;
  }

  public async remove(action: () => Promise<any>, message: string): Promise<any> {
    try {
      if (!this.core.loading) {
        this.beforeQuery();
        const result = await action();
        if (result) {
          console.log(message);
          // this.core.showSecondaryMessage(message);
        }
        return result;
      }
    }
    finally {
      this.afterQuery();
    }
  }
}

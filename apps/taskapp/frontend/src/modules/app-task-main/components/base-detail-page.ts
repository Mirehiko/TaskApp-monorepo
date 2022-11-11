import { Injector } from "@angular/core";
import { BasePage } from "./base-page";
import { FormGroup } from "@angular/forms";


export abstract class BaseDetailPage extends BasePage {
  public isNew: boolean;
  public abstract form: FormGroup;

  public entityId: string | number;

  protected constructor(
    injector: Injector,
  ) {
    super(injector);
  }

  async beforeInitData(): Promise<void> {
    const keys = Object.keys(this.params.routeParams);
    // this.isNew = this.isNew || this.params.routeParams[keys[keys.length - 1]] === "new";
    this.entityId = this.params.routeParams[keys[keys.length - 1]];
    this.isNew = this.entityId === "new";

    if (!this.isNew) {
      this.entityId = Number(this.entityId);
    }
  }

  public override beforeQuery(): void {
    super.beforeQuery();
  }

  public override afterQuery(): void {
    super.afterQuery();
  }

  public abstract save(): Promise<void>;

  public async saveHandler(callback: () => Promise<void>): Promise<void> {
    try {
      if (!this.core.loading) {
        this.beforeQuery();
        await callback();
      }
    }
    finally {
      this.afterQuery();
    }
  }
}

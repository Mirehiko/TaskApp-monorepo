import {
  Injectable,
  Injector,
  ComponentFactoryResolver,
  ApplicationRef,
  Inject, EmbeddedViewRef, TemplateRef, ViewContainerRef
} from '@angular/core';
import {
  ComponentType,
  ComponentPortal,
  DomPortalOutlet, TemplatePortal
} from '@angular/cdk/portal';
import { DOCUMENT } from '@angular/common';


@Injectable({
  providedIn: 'root',
})
export class DomService {
  /** ref to window document slot */
  private bodyPortalOutlet: DomPortalOutlet;
  private templatePortalContent: TemplateRef<unknown>;

  constructor(
    @Inject(DOCUMENT) document: any,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private applicationRef: ApplicationRef,
  ) {
    this.bodyPortalOutlet = new DomPortalOutlet(
      document.body,
      componentFactoryResolver,
      applicationRef,
      injector
    );
  }

  attachComponent<T>(
    componentType: ComponentType<T>,
    component?: T,
  ): T {

    if (this.bodyPortalOutlet.hasAttached()) {
      this.removeComponent();
    }
    const componentPortal = new ComponentPortal<T>(componentType);
    // this.templatePortal = new TemplatePortal(this.templatePortalContent, component.);
    const componentRef = this.bodyPortalOutlet.attach<T>(componentPortal);
    // console.log(componentRef)
    // if (componentProps !== undefined && typeof componentRef.instance === 'object') {
    //   Object.assign(componentRef.instance, componentProps);
    // }
    return componentRef.instance;
  }

  public attachTemplate(templatePortal: TemplateRef<unknown>, viewContainerRef: ViewContainerRef): EmbeddedViewRef<unknown> {
    if (this.bodyPortalOutlet.hasAttached()) {
      this.removeComponent();
    }
    const template = new TemplatePortal(templatePortal, viewContainerRef);
    return this.bodyPortalOutlet.attach(template);
  }

  /**
   * Destroy component
   */
  removeComponent(): void {
    this.bodyPortalOutlet.detach();
  }
}

export interface ComponentProps {
  type: string
}

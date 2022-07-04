import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { DomSanitizer, SafeHtml, Title } from "@angular/platform-browser";


@Injectable({ providedIn: "root" })
export class CoreService {
  public ready$ = new BehaviorSubject<boolean>(false);
  public loading: boolean = false;

  constructor(
    public titleService: Title,
    public sanitizer: DomSanitizer,
  ) {

  }

  public setTitle(title: string): void {
    this.titleService.setTitle(`FinApp - ${title}`);
  }

  public sanitize(text: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(text);
  }
}

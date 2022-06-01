import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TokenInterceptor } from './shared/classes/token.intercaptor';
import { CabinetModule } from './cabinet/cabinet.module';
import { AdminModule } from './admin/admin.module';

export function tokenGetter() {
  // return localStorage.getItem("nestjs_chat_app");
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Im1pcmVoaWtvQHRlc3RlZC5ydSIsImlkIjoyLCJpYXQiOjE2NTQwNjQzMDEsImV4cCI6MTY1NDE1MDcwMX0.9o0FK6IGwAVHDfmYauvGSnP1AAlKJyrf_xXoc_4Yb8Q'
}


@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CabinetModule,
    AdminModule
  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    multi: true,
    useClass: TokenInterceptor
  }],
  bootstrap: [AppComponent]
})
export class AppModule { }

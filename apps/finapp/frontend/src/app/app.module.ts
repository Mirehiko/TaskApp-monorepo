import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { TokenInterceptor } from './shared/classes/token.intercaptor';
import { CabinetModule } from './cabinet/cabinet.module';
import { AdminModule } from './admin/admin.module';
import { JwtModule } from '@auth0/angular-jwt';
import { CommonModule } from '@angular/common';
import { CustomElementsModule } from '../modules/app-task-main/components/custom-elements.module';


export function tokenGetter() {
  return localStorage.getItem("auth-token");
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
    AdminModule,
    CommonModule,
    CustomElementsModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:5000']
      }
    })
  ],
  exports: [
    CustomElementsModule,
  ],
  // providers: [{
  //   provide: HTTP_INTERCEPTORS,
  //   multi: true,
  //   useClass: TokenInterceptor
  // }],
  bootstrap: [AppComponent]
})
export class AppModule { }

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
import { CustomModulesModule } from '../modules/app-task-main/components/custom-modules.module';


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
    CustomModulesModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:5002']
      }
    }),

  ],
  exports: [
    CustomModulesModule,
  ],
  // providers: [{
  //   provide: HTTP_INTERCEPTORS,
  //   multi: true,
  //   useClass: TokenInterceptor
  // }],
  bootstrap: [AppComponent]
})
export class AppModule { }

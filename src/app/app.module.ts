/*
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { DataService } from './data.service';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import {HttpClientModule } from '@angular/common/http';

import { CertificadoComponent } from './Certificado/Certificado.component';

import { InstitucionComponent } from './Institucion/Institucion.component';
import { CarreraComponent } from './Carrera/Carrera.component';
import { EstudianteComponent } from './Estudiante/Estudiante.component';
import { NavbarAdminComponent } from './navbar-admin/navbar-admin.component';
import { NavbarUserComponent } from './navbar-user/navbar-user.component';
import { CertificationComponent } from './certification/certification.component';
import { ContactComponent } from './contact/contact.component';
import { FooterComponent } from './footer/footer.component';
import { InformationComponent } from './information/information.component';
import { OlvideComponent } from './olvide/olvide.component';


  @NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CertificadoComponent,
    InstitucionComponent,
    CarreraComponent,
    EstudianteComponent,
    NavbarAdminComponent,
    NavbarUserComponent,
    CertificationComponent,
    ContactComponent,
    FooterComponent,
    InformationComponent,
    OlvideComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [
    DataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

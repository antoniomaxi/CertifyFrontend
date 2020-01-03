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

import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CertificadoService } from './Certificado.service';
import 'rxjs/add/operator/toPromise';
import { InstitucionService } from '../Institucion/Institucion.service';
import { CarreraService } from '../Carrera/Carrera.service';
import { EstudianteService } from '../Estudiante/Estudiante.service';
import {DataService} from '../data.service';
import Swal from 'sweetalert2'
import { resolveRendererType2 } from '@angular/core/src/view/util';


@Component({
  selector: 'app-certificado',
  templateUrl: './Certificado.component.html',
  styleUrls: ['./Certificado.component.css'],
  providers: [CertificadoService,InstitucionService, CarreraService, EstudianteService,DataService]
})
export class CertificadoComponent implements OnInit {

  myForm: FormGroup;

  private id;
  private student;
  private participantE;
  private allParticipantsI;
  private participantI;
  private participantC;
  private allParticipantsC;
  private allAssets;
  private asset;
  private currentId;
  private errorMessage;

  codCert = new FormControl('', Validators.required);
  institucion = new FormControl('', Validators.required);
  carrera = new FormControl('', Validators.required);
  estud = new FormControl('', Validators.required);
  fechaGradu = new FormControl('',Validators.required);

  constructor(public serviceCertificado: CertificadoService, fb: FormBuilder,public serviceInstitucion: InstitucionService,
    public serviceCarrera:CarreraService,public serviceEstudiante:EstudianteService) {
    this.myForm = fb.group({
      codCert: this.codCert,
      institucion: this.institucion,
      carrera: this.carrera,
      fechaGradu: this.fechaGradu.value,
      estud: this.estud
    });
  };

  ngOnInit(): void {
    this.loadAll();
    this.loadAllInst();
    this.loadAllCarr();
    
  }



  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceCertificado.getAll()
    .toPromise()
    .then((result) => {
      console.log('result'+result[0].codCert)
      this.errorMessage = null;
      result.forEach(asset => {
        tempList.push(asset);
      });
      this.allAssets = tempList;
      
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  async loadAllInst(): Promise<any> {
    const tempList = [];
    try {
      const result = await this.serviceInstitucion.getAll()
        .toPromise();
      this.errorMessage = null;
      result.forEach(participantI => {
        tempList.push(participantI);
      });
      this.allParticipantsI = tempList;
    }
    catch (error) {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      }
      else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        this.errorMessage = error;
      }
    }
  }

  loadAllCarr(): Promise<any> {
    const tempList = [];
    return this.serviceCarrera.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(participantC => {
        tempList.push(participantC);
      });
      this.allParticipantsC = tempList;
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
        this.errorMessage = error;
      }
    });
  }

	/**
   * Event handler for changing the checked state of a checkbox (handles array enumeration values)
   * @param {String} name - the name of the asset field to update
   * @param {any} value - the enumeration value for which to toggle the checked state
   */
  changeArrayValue(name: string, value: any): void {
    const index = this[name].value.indexOf(value);
    if (index === -1) {
      this[name].value.push(value);
    } else {
      this[name].value.splice(index, 1);
    }
  }

	/**
	 * Checkbox helper, determining whether an enumeration value should be selected or not (for array enumeration values
   * only). This is used for checkboxes in the asset updateDialog.
   * @param {String} name - the name of the asset field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified asset field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addAsset(form: any){

    this.serviceCarrera.GetUnaCarrera(this.myForm.value.carrera)
    .subscribe((data2)=>{

      const res2=data2.json()
      const carrera2=res2[0].institucion.split("#")[1]

      if(carrera2 === this.myForm.value.institucion){
        
        this.serviceEstudiante.GetUnEstudiante(this.estud.value)
      .subscribe((data)=>{ 
        
      const res=data.json()
         
        if (res.length !== 0){

          const univEstud= res[0].institucion.split("#")[1]

          if(univEstud === this.myForm.value.institucion){
            this.id =this.estud.value;
    this.participantE = "resource:org.certify.titulos.Estudiante#"+this.estud.value;
    this.participantI = "resource:org.certify.titulos.Institucion#"+this.myForm.value.institucion;
    this.participantC = "resource:org.certify.titulos.Carrera#"+this.myForm.value.carrera;
    console.log(this.id);
   
    
    this.asset = {
      $class: 'org.certify.titulos.Certificado',
      'codCert': this.codCert.value,
      'institucion': this.participantI,
      'carrera': this.participantC,
      'fechaGradu': this.myForm.value.fechaGradu,
      'estud': this.participantE
    };
      
    this.myForm.setValue({
      'codCert': null,
      'institucion': null,
      'carrera': null,
      'estud': null,
      'fechaGradu':null
    });

    return this.serviceCertificado.addAsset(this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'codCert': null,
        'institucion': null,
        'carrera': null,
        'estud': null,
        'fechaGradu':null
      });
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
          this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else {
          this.errorMessage = error;
      }
    });



          }

          else{
            Swal.fire({
              title:'Error!\n\n El estudiante no pertenece a la Universidad seleccionada',
              type:'error',
            })

          }
          
    
  
  }
  else{

    Swal.fire({
      title:'Error!\n\n El estudiante no existe',
      type:'error',
  })
  }

      })


      }
  
      else{
  
        Swal.fire({
          title:'Error!\n\n La carrera  no pertenece a\n la Universidad seleccionada',
          type:'error',
      })
         
      }

    })

    
    
  }


  updateAsset(form: any): Promise<any> {
    
    this.id =this.estud.value;
    this.participantE = "resource:org.certify.titulos.Estudiante#"+this.estud.value;
    this.participantI = "resource:org.certify.titulos.Institucion#"+this.myForm.value.institucion;
    this.participantC = "resource:org.certify.titulos.Carrera#"+this.myForm.value.carrera;
    console.log(this.id);
   
    
    this.asset = {
      $class: 'org.certify.titulos.Certificado',
      'institucion': this.participantI,
      'carrera': this.participantC,
      'fechaGradu': this.myForm.value.fechaGradu,
      'estud': this.participantE
    };

    return this.serviceCertificado.updateAsset(form.get('codCert').value, this.asset)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }


  deleteAsset(): Promise<any> {

    return this.serviceCertificado.deleteAsset(this.currentId)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.loadAll();
    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  setId(id: any): void {
    this.currentId = id;
  }

  getForm(id: any): Promise<any> {

    return this.serviceCertificado.getAsset(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'codCert': null,
        'institucion': null,
        'carrera': null,
        'estud': null,
        'fechaGradu':null
      };

      if (result.codCert) {
        formObject.codCert = result.codCert;
      } else {
        formObject.codCert = null;
      }

      if (result.institucion) {
        formObject.institucion = result.institucion;
      } else {
        formObject.institucion = null;
      }

      if (result.carrera) {
        formObject.carrera = result.carrera;
      } else {
        formObject.carrera = null;
      }

      if (result.estud) {
        formObject.estud = result.estud;
      } else {
        formObject.estud = null;
      }

      this.myForm.setValue(formObject);

    })
    .catch((error) => {
      if (error === 'Server error') {
        this.errorMessage = 'Could not connect to REST server. Please check your configuration details';
      } else if (error === '404 - Not Found') {
        this.errorMessage = '404 - Could not find API route. Please check your available APIs.';
      } else {
        this.errorMessage = error;
      }
    });
  }

  resetForm(): void {
    this.myForm.setValue({
      'codCert': null,
      'institucion': null,
      'carrera': null,
      'estud': null,
      'fechaGradu':null
      });
  }  

}

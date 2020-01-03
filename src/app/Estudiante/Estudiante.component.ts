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
import { EstudianteService } from './Estudiante.service';
import 'rxjs/add/operator/toPromise';
import { InstitucionService } from '../Institucion/Institucion.service';

@Component({
  selector: 'app-estudiante',
  templateUrl: './Estudiante.component.html',
  styleUrls: ['./Estudiante.component.css'],
  providers: [EstudianteService,InstitucionService]
})
export class EstudianteComponent implements OnInit {

  myForm: FormGroup;

  private allParticipantsI;
  private participantI;
  private allParticipants;
  private participant;
  private currentId;
  private errorMessage;

  Nombre = new FormControl('', Validators.required);
  Apellido = new FormControl('', Validators.required);
  carnet = new FormControl('', Validators.required);
  cedula = new FormControl('', Validators.required);
  institucion = new FormControl('', Validators.required);


  constructor(public serviceEstudiante: EstudianteService, fb: FormBuilder,public serviceInstitucion: InstitucionService) {
    this.myForm = fb.group({
      Nombre: this.Nombre,
      Apellido: this.Apellido,
      carnet: this.carnet,
      cedula: this.cedula,
      institucion: this.institucion
    });
  };

  ngOnInit(): void {
    this.loadAll();
    this.loadAllInst();
  }

  loadAll(): Promise<any> {
    const tempList = [];
    return this.serviceEstudiante.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(participant => {
        tempList.push(participant);
      });
      this.allParticipants = tempList;
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


  loadAllInst(): Promise<any> {
    const tempList = [];
    return this.serviceInstitucion.getAll()
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      result.forEach(participantI => {
        tempList.push(participantI);
      });
      this.allParticipantsI = tempList;
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
   * @param {String} name - the name of the participant field to update
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
   * only). This is used for checkboxes in the participant updateDialog.
   * @param {String} name - the name of the participant field to check
   * @param {any} value - the enumeration value to check for
   * @return {Boolean} whether the specified participant field contains the provided value
   */
  hasArrayValue(name: string, value: any): boolean {
    return this[name].value.indexOf(value) !== -1;
  }

  addParticipant(form: any): Promise<any> {
    this.participantI = "resource:org.certify.titulos.Institucion#"+this.myForm.value.institucion;
    this.participant = {
      $class: 'org.certify.titulos.Estudiante',
      'Nombre': this.Nombre.value,
      'Apellido': this.Apellido.value,
      'carnet': this.carnet.value,
      'cedula': this.cedula.value,
      'institucion': this.participantI
    };

    this.myForm.setValue({
      'Nombre': null,
      'Apellido': null,
      'carnet': null,
      'cedula': null,
      'institucion': null
    });

    return this.serviceEstudiante.addParticipant(this.participant)
    .toPromise()
    .then(() => {
      this.errorMessage = null;
      this.myForm.setValue({
        'Nombre': null,
        'Apellido': null,
        'carnet': null,
        'cedula': null,
        'institucion': null
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


   updateParticipant(form: any): Promise<any> {
    this.participant = {
      $class: 'org.certify.titulos.Estudiante',
      'Nombre': this.Nombre.value,
      'Apellido': this.Apellido.value,
      'cedula': this.cedula.value,
      'institucion': "resource:org.certify.titulos.Institucion#"+this.myForm.value.institucion
    };

    return this.serviceEstudiante.updateParticipant(form.get('carnet').value, this.participant)
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


  deleteParticipant(): Promise<any> {

    return this.serviceEstudiante.deleteParticipant(this.currentId)
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

    return this.serviceEstudiante.getparticipant(id)
    .toPromise()
    .then((result) => {
      this.errorMessage = null;
      const formObject = {
        'Nombre': null,
        'Apellido': null,
        'carnet': null,
        'cedula': null,
        'institucion': null
      };

      if (result.Nombre) {
        formObject.Nombre = result.Nombre;
      } else {
        formObject.Nombre = null;
      }

      if (result.Apellido) {
        formObject.Apellido = result.Apellido;
      } else {
        formObject.Apellido = null;
      }

      if (result.carnet) {
        formObject.carnet = result.carnet;
      } else {
        formObject.carnet = null;
      }

      if (result.cedula) {
        formObject.cedula = result.cedula;
      } else {
        formObject.cedula = null;
      }

      if (result.institucion) {
        formObject.institucion = result.institucion;
      } else {
        formObject.institucion = null;
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
      'Nombre': null,
      'Apellido': null,
      'carnet': null,
      'cedula': null,
      'institucion': null
    });
  }
}

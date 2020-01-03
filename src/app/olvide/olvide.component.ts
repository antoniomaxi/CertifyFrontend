import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { CertificadoService } from '../Certificado/Certificado.service';
import 'rxjs/add/operator/toPromise';
import Swal from 'sweetalert2'
import 'rxjs/add/operator/toPromise';
import { DataService } from '../data.service';
import { Certificado, Estudiante } from 'app/org.certify.titulos';
import { Observable } from 'rxjs';
import { async } from 'q';
import * as jsPDF from 'jspdf'
import { CarreraService } from 'app/Carrera/Carrera.service';
import { EstudianteService } from 'app/Estudiante/Estudiante.service';
import { InstitucionService } from 'app/Institucion/Institucion.service';
import { assertNotNull } from '@angular/compiler/src/output/output_ast';
import { Asset, AssetRegistry } from '../org.hyperledger.composer.system';
@Component({
  selector: 'app-olvide',
  templateUrl: './olvide.component.html',
  styleUrls: ['./olvide.component.css'],
  providers: [CertificadoService,DataService, CarreraService,EstudianteService,InstitucionService]
})
export class OlvideComponent implements OnInit {

  constructor(public serviceCertificado: CertificadoService,public serviceData: DataService<Certificado>,public serviceCarrera: CarreraService,
    public serviceInstitucion: InstitucionService, public serviceEstudiante: EstudianteService) { }

  private nombre;
  private apellido;
  private cedula;
  ///////////
  private id;
  private fecha;
  private certificado;
  private univ;
  private carrera;
  private allParticipants;
  private errorMessage;
  private estudiante;
  private codigo;
  private allAssets;

  ngOnInit() {
  }

  olvide(){
    let confirm=false;
    Swal.mixin({
      progressSteps: ['1', '2'],
      allowOutsideClick: true,
    }).queue([
      {
        title: 'Paso 1 - Busqueda',
        input: 'text',
        inputPlaceholder: 'Ingrese su Carnet',
        confirmButtonText: 'Continuar &rarr;',
        showCancelButton: true,
        inputValidator: (value) => {
        return !value && 'Por favor ingrese su Carnet!'
        },   
      },
      
    ]).then((result) => {


      if(true){
      let timerInterval
      Swal.fire({
        title: 'Buscando...',

        timer: 10000,
        onBeforeOpen: () => {
          const content = Swal.getContent()
          const $ = content.querySelector.bind(content)
    
          Swal.showLoading()
      
          timerInterval = setInterval(() => {
            Swal.getContent().querySelector('strong')
              .textContent = (Swal.getTimerLeft() / 1000)
                .toFixed(0)
          }, 100)
        },
        onClose: () => {
          clearInterval(timerInterval)
        }
      })
    }
      console.log(result.value)
      this.serviceCertificado.getAll()
      .subscribe((data)=>{ 
        data.forEach(asset=>{
	  
	  const carnet=asset.estud.toString().split("#")[1]
	  const resultado = "resource:org.certify.titulos.Estudiante#"+result.value
          console.log("Carnet ", carnet +" Result.value ",result.value[0])
	  

            if(carnet  === result.value[0]){
                console.log("ADENTRO DEL IF", asset.codCert)
                this.id = asset.codCert
      
            }

        })

        console.log("FUERA DEEEEEL IF ", this.id)
    
        if (this.id !== undefined){

          console.log("EN EEEEEL IF ", this.id)
          
    
          Swal.fire({
      
           allowOutsideClick: false,
            progressSteps: ['1', '2'],
            title: 'Paso 2 - Conseguido',
            imageUrl: 'https://firebasestorage.googleapis.com/v0/b/certify-tesis.appspot.com/o/logo2.png?alt=media&token=900fb570-5640-40bc-9bd0-45783bf6852f',
            html:
              'Se encontró su código: <pre><code>' +
                JSON.stringify(this.id) +
              '</code></pre>',
            confirmButtonText: 'Aceptar &rarr;',
          showCancelButton: true,
      
         })
        }
        else{
          Swal.fire({
              title:'No se encontro el Estudiante',
              type:'error',
          })
      
        } 
      })

    });
    
  }


}

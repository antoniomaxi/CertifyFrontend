import {Asset} from './org.hyperledger.composer.system';
import {Participant} from './org.hyperledger.composer.system';
import {Transaction} from './org.hyperledger.composer.system';
import {Event} from './org.hyperledger.composer.system';
// export namespace org.certify.titulos{
   export class Institucion extends Participant {
      ID: string;
      nombre: string;
   }
   export class Carrera extends Participant {
      ID: string;
      nombreCarrera: string;
      institucion: Institucion;
   }
   export class Estudiante extends Participant {
      Nombre: string;
      Apellido: string;
      carnet: string;
      cedula: number;
      institucion: Institucion;
   }
   export class Certificado extends Asset {
      codCert: string;
      institucion: Institucion;
      carrera: Carrera;
      estud: Estudiante;
      fechaGradu: Date;
   }
// }

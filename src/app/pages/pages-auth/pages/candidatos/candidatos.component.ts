import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import {
  ButtonCloseDirective,
  ButtonDirective,
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ThemeDirective,
  FormModule,
  FormSelectDirective
} from '@coreui/angular';

import { DatePipe, NgIf } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthServicesService } from '../../../../services/auth-services.service';
import { FirebaseService } from '../../../../services/firebase.service';
import { ToastrService } from 'ngx-toastr';
import { MatButtonModule } from '@angular/material/button';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-candidatos',
  standalone: true,
  imports: [MatCardModule, ButtonDirective, MatIconModule, MatTableModule, MatPaginatorModule, DatePipe, NgIf, ButtonCloseDirective, ModalBodyComponent, ModalComponent, ModalFooterComponent,
    ModalHeaderComponent, ModalTitleDirective, ThemeDirective, FormModule, FormSelectDirective, ReactiveFormsModule, FormsModule, MatButtonModule, MatIconModule],
  templateUrl: './candidatos.component.html',
  styleUrl: './candidatos.component.css'
})
export class CandidatosComponent {
  _authSrv = inject(AuthServicesService)
  _fireSrv = inject(FirebaseService)
  toastSvc = inject(ToastrService)
  Vote = new FormGroup ({
    titulo: new FormControl('', Validators.required),
  })
  candidato = new FormGroup ({
    numDoc: new FormControl(null, Validators.required),
    nombre: new FormControl('', Validators.required),
    mensaje: new FormControl('', Validators.required),
    estado: new FormControl('', Validators.required),
  })
  titulo: string = ''
  data: any
  visibleForm = false
  visibleFormUpdate = false
  preImg: any = '../../../../../assets/avatar.png';
  imgUpload: boolean = false
  imgFirebase: boolean = false
  archivo: any
  blobarchivo: any = undefined
  candidatos: any = []
  candidatoUpdate: any
  consulta: any
 // candidatosSource: any = []

 async ConsultarCandidato() {
  try {
    this.consulta = await this._fireSrv.searchByQueryCandidatoNumDoc(this.candidato.value.numDoc)
    if (this.consulta.length == 0) {
      return
    } else {
      this.candidato.setValue({
        numDoc: this.consulta[0].numDoc,
        nombre: this.consulta[0].nombre,
        mensaje: '',
        estado: ''
      })
      this.preImg = this.consulta[0].fotoPath
    }
  } catch (error) {
    console.log(error)
  }
 }

  async obtenerCandidatos() {
    if (this.Vote.invalid) {
      this.toastSvc.error('Es necesario que selecciones una votación', 'Error')
      return 
    }
     try {
      this.data = await this._fireSrv.searchByQuery(this.Vote.value.titulo)
      this.dataSource.data = this.data[0].candidatos
      this.titulo = this.data[0].titulo
      this.candidatos = this.data[0].candidatos
     } catch (error) {
      console.log(error)
      this.toastSvc.error('No se pudo obtener la votación', 'Error')
     }
  }

  async captureImg(event: any){
    let inputImg: any
    inputImg = event.target.files[0]

    this.archivo = inputImg
      if (inputImg) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.preImg = reader.result
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const maxWidth = 720
            const maxHeight = 720
            let width = img.width;
            let height = img.height

            if (width > height) {
              if (width > maxWidth) {
                height *= maxHeight / width;
                width = maxWidth;
              } 
            } else {
              if (height > maxHeight) {
                width *= maxHeight / height
                height = maxHeight;
              }
            }

            canvas.width = width
            canvas.height = height
            ctx?.drawImage(img, 0, 0, width, height);
            canvas.toBlob((blob) => {
              this.blobarchivo = blob
              //console.log(inputImg)
              //console.log(this.blobarchivo)
            }, 'image/jpeg', 0.7)
          }
          img.src = e.target?.result as string
        }
        reader.readAsDataURL(inputImg)
        this.imgUpload = true
      } else {
        this.preImg = '../../../../../assets/avatar.png'
      }
  }

  async guardarImg() {
    let noImg = false
    if (this.consulta[0].fotoPath == "https://firebasestorage.googleapis.com/v0/b/votaciones-d568c.appspot.com/o/candidatos%2Favatar.png?alt=media&token=a7a9ece5-b31d-4dd4-a605-69310c8998ca"){
      noImg = true
    }
    if (this.consulta.length == 0 || noImg) {
      if (this.candidato.value.numDoc) {
        const ruta: number = this.candidato.value.numDoc
        try {
          if (this.blobarchivo) {
            let resImg: any
            resImg = await this._fireSrv.uploadImg(ruta.toString(), this.blobarchivo)
            //console.log(resImg)
            this.toastSvc.success('Se guardo la imagen correctamente', 'Imagen Guardada')
            //this.imgFirebase = true
            this.crearCandidato(resImg.metadata.fullPath)
          } else {
            this.crearCandidato('NoImg')
          }
        } catch (error) {
          console.log(error)
          this.toastSvc.error('La imagen no se pudo guardar!', 'Imagen No guardada')
        }
      }
    } else {
      this.crearCandidato(this.consulta[0].fotoPath)
    }
  }

  async crearCandidato(imgUrl: string){
    //console.log(imgUrl)
    if (this.candidato.invalid) {
      this.toastSvc.error('No se pudo guardar el candidato correctamente!', 'Error')
      return 
    }
    for (let index = 0; index < this.candidatos.length; index++) {
      if (this.candidatos[index].numDoc == this.candidato.value.numDoc) {
        this.toastSvc.info('El candidato ya esta agregado en la Votación', 'Candidato Agregado')
        return
      }
    }
      try {
        let imgUrlWeb: any = ''
        if (this.consulta.length != 0) {
          if (this.consulta[0].fotoPath == "https://firebasestorage.googleapis.com/v0/b/votaciones-d568c.appspot.com/o/candidatos%2Favatar.png?alt=media&token=a7a9ece5-b31d-4dd4-a605-69310c8998ca"){
            imgUrlWeb = await this._fireSrv.getImg(imgUrl)
          } else {
            imgUrlWeb = imgUrl
          }
        } else {
          if (imgUrl == 'NoImg') {
            imgUrlWeb = 'https://firebasestorage.googleapis.com/v0/b/votaciones-d568c.appspot.com/o/candidatos%2Favatar.png?alt=media&token=a7a9ece5-b31d-4dd4-a605-69310c8998ca'
          } else {
            imgUrlWeb = await this._fireSrv.getImg(imgUrl)
          }
        }
              const newCandidato = {
                numDoc: this.candidato.value.numDoc,
                nombre: this.candidato.value.nombre,
                registradoPor: this._authSrv.correo,
                fotoPath: imgUrlWeb
              }
              const addCandidato = {
                numDoc: this.candidato.value.numDoc,
                nombre: this.candidato.value.nombre,
                mensaje: this.candidato.value.mensaje,
                estado: this.candidato.value.estado,   
                registradoPor: this._authSrv.correo,
                fotoPath: imgUrlWeb
              }
            //console.log(newCandidato)
            this.candidatos.push(addCandidato)
            //console.log(this.candidatos, this.data[0].id)
            if (this.consulta.length == 0) {
              await this._fireSrv.crearCandidato(newCandidato)
            } else {
              await this._fireSrv.updateCandidato(this.consulta[0].id, newCandidato, this._authSrv.correo)
            }
            await this._fireSrv.updateEleccion(this.data[0].id, {candidatos: this.candidatos})
            this.dataSource.data = this.candidatos
            this.toastSvc.success('Añadido el candidato correctamente', 'Nuevo candidato')
            this.candidato.reset()
            this.blobarchivo = undefined
            this.preImg = '../../../../../assets/avatar.png'
          } catch (error) {
            console.log(error)
            this.toastSvc.error('No se pudo crear el nuevo candidato', 'Error')
          }

  }

  async actualizarCandidato(){
    if (this.candidato.invalid) {
      this.toastSvc.error('No se pudo guardar el candidato correctamente!', 'Error')
      return 
    }
    try {
        const updateEleccionCandidato = {
              numDoc: this.candidato.value.numDoc,
              nombre: this.candidato.value.nombre,
              mensaje: this.candidato.value.mensaje,
              estado: this.candidato.value.estado,   
              registradoPor: this.candidatoUpdate.registradoPor,
              fotoPath: this.candidatoUpdate.fotoPath
            }

            for (let index = 0; index < this.candidatos.length; index++) {
              if (this.candidatos[index].numDoc == this.candidatoUpdate.numDoc) {
                this.candidatos[index] = updateEleccionCandidato
              }           
            }
            console.log(this.candidatos)
            await this._fireSrv.updateEleccion(this.data[0].id, {candidatos: this.candidatos})
            this.toastSvc.success('Actualizado el candidato correctamente', 'Candidato Actualizado')
            this.dataSource.data = this.candidatos
            this.candidatoUpdate = undefined
            this.candidato.reset()
            this.blobarchivo = undefined
            this.preImg = '../../../../../assets/avatar.png'
            this.visibleFormUpdate = false
    } catch (error) {
      console.log(error)
          this.toastSvc.error('No se pudo crear el nuevo candidato', 'Error')
    }
  }

  viewForm(data: any) {
    this.visibleForm = false
    this.visibleFormUpdate = true
    console.log(data)
    this.preImg = data.fotoPath
    this.candidato.setValue({
      numDoc: data.numDoc,
      nombre: data.nombre,
      mensaje: data.mensaje,
      estado: data.estado
    })
    this.candidatoUpdate = data
  }

//Tables
displayedColumns: string[] = [
  'Foto',
  'NombreCompleto',
  'Mensaje',
  'Estado',
  'RegistradoPor',
  'Editar',
];

dataSource = new MatTableDataSource<any[]>([]);
applyFilter(event: Event) {
  const filterValue = (event.target as HTMLInputElement).value;
  this.dataSource.filter = filterValue.trim().toLowerCase();
}

}

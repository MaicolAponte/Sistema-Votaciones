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

import Swal from 'sweetalert2'
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-elecciones',
  standalone: true,
  imports: [MatCardModule, ButtonDirective, MatIconModule, MatTableModule, MatPaginatorModule, DatePipe, NgIf, ButtonCloseDirective, ModalBodyComponent, ModalComponent, ModalFooterComponent,
            ModalHeaderComponent, ModalTitleDirective, ThemeDirective, FormModule, FormSelectDirective, ReactiveFormsModule, FormsModule
  ],
  templateUrl: './elecciones.component.html',
  styleUrl: './elecciones.component.css'
})
export class EleccionesComponent implements OnInit {
  _authSrv = inject(AuthServicesService)
  _fireSrv = inject(FirebaseService)
  toastSvc = inject(ToastrService)
  visibleForm = false
  visibleFormUpdate = false
  idEleccion = ''
  dataEleccion: any
  newVote = new FormGroup ({
    titulo: new FormControl('', Validators.required),
    descripcion: new FormControl('', Validators.required),
    estado: new FormControl('', Validators.required),
    formato: new FormControl('', Validators.required)
  })

  async createVote() {
    if (this.newVote.invalid) return
      try {
        const data = {
          ...this.newVote.value,
          creador: this._authSrv.correo,
          candidatos: []
        }
        //console.log(data)
        const res = await this._fireSrv.createNewVote(data)
        console.log(res.id)
        this._fireSrv.Options.push({
          titulo: this.newVote.value.titulo,
          id: res.id
        })
        //console.log(this._fireSrv.Options)
        await this._fireSrv.updateOptions({listaElecciones: this._fireSrv.Options})
        this.toastSvc.success('Se ha creado una nueva elecciones!', 'Registro Correcto...')
      } catch (error) {
        console.log(error)
        this.toastSvc.error('No se ha podido crear unas nuevas elecciones!', 'Registro Incorrecto...')
      }
    this.visibleForm = false
  }

  viewForm(data: any) {
    this.visibleForm = false
    this.visibleFormUpdate = true
    this.dataEleccion = data
    this.idEleccion = data.id
    if (data) {
      this.newVote.setValue({
        titulo: data.titulo,
        descripcion: data.descripcion,
        estado: data.estado,
        formato: data.formato
      })
    }
  }

  async updateVote(){
    try {
      console.log(this.idEleccion)
      this.dataEleccion.titulo = this.newVote.value.titulo
      this.dataEleccion.descripcion = this.newVote.value.descripcion
      this.dataEleccion.estado = this.newVote.value.estado
      await this._fireSrv.updateEleccion(this.idEleccion, this.dataEleccion)
      this.toastSvc.success('Se ha actualizado una elecciones!', 'Registro Correcto...')
    } catch (error) {
      console.log(error)
      this.toastSvc.error('No se ha podido actualizar estas elecciones!', 'Registro Incorrecto...')
    }
  }
  //Tables
  displayedColumns: string[] = [
    'TituloEleccion',
    'Descripcion',
    'FechaCreacion',
    'Estado',
    'Formato',
    'Creador',
    'Editar',
    'VerLink'
  ];

  dataSource = new MatTableDataSource<any[]>([]);
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  ngOnInit(): void {
      this._fireSrv.getElecciones().subscribe( (vote) => {
          for (let index = 0; index < vote.length; index++) {
            vote[index].fechaCreacion = new Date(vote[index].fechaCreacion.toDate())
          }
          this.dataSource.data = vote
      })
  }
}

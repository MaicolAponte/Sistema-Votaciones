import { Injectable, inject } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, doc, updateDoc, serverTimestamp, query, where, getDocs, deleteDoc, orderBy, startAt, endAt, or, and } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { getDoc } from 'firebase/firestore';
import {Storage, ref, uploadBytes, getDownloadURL, deleteObject} from '@angular/fire/storage'

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private path =  'Elecciones'
  private pathOptions =  'Options'
  private pathCandidato = 'Candidatos'
  private _firestore = inject(Firestore);
  private _storage = inject(Storage)
  private  _colletion = collection(this._firestore, this.path)
  private _colletionCandidato = collection(this._firestore, this.pathCandidato)
  private  _colletionOptions = collection(this._firestore, this.pathOptions)
  
  public Options: any = []
  getOptions() {
    return collectionData(this._colletionOptions, { idField: 'id'}) as Observable<any[]>;
  }

  getElecciones() {
    return collectionData(this._colletion, { idField: 'id'}) as Observable<any[]>;
  }

  async getOneEleccion (id: string) {
    try {
      const document = doc(this._firestore, this.path, id);
      const snapshot = await getDoc(document);
      return snapshot.data() as Observable<any>
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async createNewVote (eleccion: any) {
    eleccion.fechaCreacion = serverTimestamp()
    return await addDoc(this._colletion, eleccion) 
  }

  async crearCandidato(candidato: any) {
    candidato.fechaRegistro = serverTimestamp()
    return await addDoc(this._colletionCandidato, candidato)
  }
  updateEleccion (id: string, eleccion: any) {
    const document = doc(this._firestore, this.path, id);

    return updateDoc(document, { ...eleccion})
  }

  updateCandidato (id: string, candidato: any, correo: string) {
    const document = doc(this._firestore, this.pathCandidato, id);
    candidato.UltimaActualizacion = {
      actualizadoPor: correo,
      fechaActualizacion: serverTimestamp()
    }

    return updateDoc(document, { ...candidato})
  }

  updateOptions (options: any) {
    const document = doc(this._firestore, this.pathOptions, 'options');
    return updateDoc(document, { ...options})
  }

  async searchByQuery(titulo: string | null | undefined){
    if (titulo) {
      const q = query(this._colletion, where('titulo', '==', titulo))
      const querySnapshot = await getDocs(q);
      let Data: any[] = [];
  
      querySnapshot.forEach((doc) => {
        const data: any = doc.data()
        //console.log(data)
        data.fechaCreacion = new Date(data.fechaCreacion.toDate())
   /*     for (let index = 0; index < data.candidatos.length; index++) {
          data.candidatos[index].fechaRegistro = new Date(data.candidatos[index].fechaRegistro.toDate())      
        }*/
        Data = [...Data, {id: doc.id, ...data} as  any]
      })
      return Data
    }
    return null
  }

  async searchByQueryCandidatoNumDoc(numDoc: number | null | undefined){

    if (numDoc) {
      const q = query(this._colletionCandidato, where('numDoc', '==', numDoc))

      const querySnapshot = await getDocs(q);
      let Data: any[] = [];

      querySnapshot.forEach((doc) => {
        const data: any = doc.data()
        //console.log(data)
        //data.fechaCreacion = new Date(data.fechaCreacion.toDate())
        Data = [...Data, {id: doc.id, ...data} as  any]
      })
      return Data
    }
    return null
  }

  async uploadImg(ruta: string, img: any){
    const refImg = ref(this._storage, `candidatos/candidato${ruta}`)
    return uploadBytes(refImg, img)
  }

  async getImg(path: string) {
    if (path != 'NoImg') {
      const reference = ref(this._storage, path)
     // const img = await list(reference)
      const res = await getDownloadURL(reference)
      return res
    }
    return null
  }

  async deleteImg(path: string) {
    const refImg = ref(this._storage, path)
    const res = await deleteObject(refImg)
    
    return res
  }
  //Tal vez no se usan

  /*
  
  updateStateReport (id: string, state: any) {
    const document = doc(this._firestore, this.pathOptions, id);

    return updateDoc(document, { ...state})
  }
  updateDocumentReport (id: string, imgUrl: any) {
    const document = doc(this._firestore, this.pathOptions, id);

    return updateDoc(document, { ...imgUrl})
  }

  deleteReport (id: string) {
    const document = doc(this._firestore, this.pathOptions, id);
    return deleteDoc(document)
  }
  async createNewReport (report: any) {
    report.fechaRegistro = serverTimestamp()
    return await addDoc(this._colletionReporte, report ) 
  }

  getReportes () {
    return collectionData(this._colletionReporte, { idField: 'id'}) as Observable<any[]>;
  }

/*  updateOptions () {
    const update = {
      Colegios: Colegios,
      Municipios: Municipios,
      TipoReportes: TipoReportes
    }
    const document = doc(this._firestore, 'Opciones', 'KufGM3Tgp47cEiTZQBqi');

    return updateDoc(document, { ...update})
  }*/

  /*

  async getOneDocument (id: string) {
    try {
      const document = doc(this._firestore, this.path, id);
      const snapshot = await getDoc(document);
      return snapshot.data() as Observable<any>
    } catch (error) {
      console.log(error)
      return null
    }
  }

  async searchByQuery(cedula: number | null | undefined){
    if (cedula) {
      const q = query(this._colletionReporte, where('numDoc', '==', cedula))
      const querySnapshot = await getDocs(q);
      let Data: any[] = [];
  
      querySnapshot.forEach((doc) => {
        const data: any = doc.data()
        data.fechaRegistro = new Date(data.fechaRegistro.toDate())
        Data = [...Data, {id: doc.id, ...data} as  any]
      })
      return Data
    }
    return null
  }
  
  async searchByQueryLog(cedula: number | null | undefined){
    if (cedula) {
      const q = query(this._colletion, where('numDocUser', '==', cedula))
      const querySnapshot = await getDocs(q);
      let Data: any[] = [];
  
      querySnapshot.forEach((doc) => {
        const data: any = doc.data()
        data.fechaRegistro = new Date(data.fechaRegistro.toDate())
        Data = [...Data, {id: doc.id, ...data} as  any]
      })
      return Data
    }
    return null
  }

  async searchByQueryReports(data: any){
    if (data) {
      let q: any
      if (!data.fechaFinal) {
        if (!data.estado) {
          q = query(this._colletionReporte,where('fechaRegistro', '>=', data.fechaInicio))
        } else {
          q = query(this._colletionReporte,where('fechaRegistro', '>=', data.fechaInicio),where('estado', "==", data.estado))
        }
      } else if (!data.estado) {
        if (!data.FechaFinal) {
          q = query(this._colletionReporte,where('fechaRegistro', '>=', data.fechaInicio))
        } else {
          q = query(this._colletionReporte,where('fechaRegistro', '>=', data.fechaInicio),where('fechaRegistro', '<=', data.fechaFinal))
        }
      } else {
        q = query(this._colletionReporte,where('fechaRegistro', '>=', data.fechaInicio),
                                        where('fechaRegistro', '<=', data.fechaFinal), 
                                        where('estado', "==", data.estado))                               
      }
      const querySnapshot = await getDocs(q);
      let Data: any[] = [];
  
      querySnapshot.forEach((doc) => {
        const data: any = doc.data()
        data.fechaRegistro = new Date(data.fechaRegistro.toDate())
        Data = [...Data, {id: doc.id, ...data} as  any]
      })
      return Data
    }
    return null
  }

  async searchByQueryEncuestas(data: any){
    if (data) {
      let q: any
      if (!data.fechaFinal) {
          q = query(this._colletion,where('fechaRegistro', '>=', data.fechaInicio))
      } else {
        q = query(this._colletion,where('fechaRegistro', '>=', data.fechaInicio),
                                        where('fechaRegistro', '<=', data.fechaFinal))                            
      }
      const querySnapshot = await getDocs(q);
      let Data: any[] = [];
  
      querySnapshot.forEach((doc) => {
        const data: any = doc.data()
        data.fechaRegistro = new Date(data.fechaRegistro.toDate())
        Data = [...Data, {id: doc.id, ...data} as  any]
      })
      return Data
    }
    return null
  }

  updateDocument (id: string, vehiculoInfo: any) {
    const document = doc(this._firestore, this.path, id);

    return updateDoc(document, { ...vehiculoInfo})
  }

  deleteDocument (id: string) {
    const document = doc(this._firestore, this.path, id);
    return deleteDoc(document)
  }
*/
}

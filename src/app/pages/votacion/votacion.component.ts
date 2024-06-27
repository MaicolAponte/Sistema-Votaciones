import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-votacion',
  standalone: true,
  imports: [],
  templateUrl: './votacion.component.html',
  styleUrl: './votacion.component.css'
})
export class VotacionComponent {

  constructor(private route: ActivatedRoute) {
    this.route.params.subscribe( params => {
      console.log(params['id'])
    })
    route.url.subscribe( url => {
      console.log(url)
    })
  }
}

import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  register(): void{
    console.log("Trying to register new user.");
    console.log("Teodor has not implemented functionality for adding new users yet. Sawry:(")
  }

}

import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

import { UserModel } from '../../models/user.model';
import { COUNTRIES } from 'src/app/data/countries';
import { JsonPipe, NgClass, NgForOf, NgIf } from '@angular/common';

@Component({
  selector: 'app-signup-form',
  standalone: true,
  imports: [FormsModule, NgIf, NgForOf, NgClass, JsonPipe],
  templateUrl: './signup-form.component.html',
  styleUrls: ['./signup-form.component.css']
})
export class SignupFormComponent implements OnInit {
  countries: Array<string> = COUNTRIES;
  user: UserModel = new UserModel();

  constructor() {
  }

  ngOnInit() {

  }


  onSave(signupForm: NgForm): void {
    // Form model
    console.log(signupForm.form);
    // Form value
    console.log(`Saved: ${JSON.stringify(signupForm.value)}`);
  }

}



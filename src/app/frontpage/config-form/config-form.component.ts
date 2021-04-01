import { formatCurrency } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommandsService } from '../../services/commands.service';

@Component({
  selector: 'app-config-form',
  templateUrl: './config-form.component.html',
  styleUrls: ['./config-form.component.sass']
})
export class ConfigFormComponent implements OnInit {

  constructor(private commandsService: CommandsService, private router: Router) { }

  configForm: FormGroup;
  initialOrientation: FormControl;
  numberOfSquares: FormControl;
  initialCoordinates: FormControl;
  xCoordinate: FormControl;
  yCoordinate: FormControl;
  obstacles: FormControl;
  
  ngOnInit(): void {
    this.generateForm();
  }

  generateForm() {
    this.numberOfSquares = new FormControl('', [Validators.required, this.numberOfSquaresValidator()]);
    this.initialOrientation = new FormControl('', [Validators.required]);
    this.xCoordinate= new FormControl('', [Validators.required, this.coordinatesValidator()])
    this.yCoordinate = new FormControl('',[Validators.required, this.coordinatesValidator()])
    this.obstacles = new FormControl('', [Validators.required, this.obstaclesValidator()])
    
    this.configForm = new FormGroup({
      initialOrientation: this.initialOrientation,
      numberOfSquares: this.numberOfSquares,
      yCoordinate: this.yCoordinate,
      xCoordinate: this.xCoordinate,
      obstacles: this.obstacles
    })
  }

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode >= 48 && charCode <= 57) {
      return true;
    }
    return false;

  }

  orientationValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      
      let result;
      if (control.value > 0) {
        result = 'Please select an initial orientation';
      }
      return result ? {incorrectOrientation: result} : null;
    };
  }

  numberOfSquaresValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      
      let result;
      if (control.value > 50) {
        result = `The planet is too big! Please chose a number between 4 and 50`
      } else if (control.value < 4){
        result = 'The planet is too small! Please chose a number between 4 and 50'
      }
      this.xCoordinate?.updateValueAndValidity();
      this.yCoordinate?.updateValueAndValidity();
      this.obstacles?.updateValueAndValidity();  
      return result ? {incorrectNumberOfSquares: result} : null;
    };
  }
  
  coordinatesValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      let result;
      if (control.value <= 0) {
        result = 'You are trying to land outside of the planet! Check your coordinates (they start at square 1)'
      }        
      if (this.numberOfSquares.dirty) {
        if (control.value >= this.numberOfSquares.value) {
          result = 'You are trying to land outside of the planet! Check your coordinates'
        }   
      }
      return result ? {incorrectCoordinates: result} : null;
    };
  }

  obstaclesValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
      let result;
      if (this.numberOfSquares.dirty) {
        if (control.value >= (this.numberOfSquares.value * this.numberOfSquares.value) -1 ) {
          result = 'There are too many obstacles for the size of the planet!'
        }        
      }
      return result ? {incorrectObstacles: result} : null;
    };
  }

  submit() {
    if (this.configForm.valid){
      this.commandsService.setConfig(this.configForm.value)
      this.router.navigate(['/world'])
    }
  }
}

import { ContactUs } from '@client/models/contact-us.model';
import { Injectable } from '@angular/core';
import swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  toast;

  constructor() {
    this.toast = swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
  }

  fieldRequiredError() {
    return this.toast({
      type: 'error',
      title: 'One or more required criterias is empty! Complete required details before subitting the form'
    });
  }

  contactUs() {
    return swal({
      title: 'Contact Us! Are you sure of proceeding with this operation?',
      text: 'You won\'t be able to revert this!',
      type: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm!'
    });
  }

  contactUsSuccess(contact: ContactUs) {
    return this.toast({
      type: 'success',
      title: 'Hello ' + contact.name + '! We\'ve recieved your message! And will get back to you as soon as possible',
      timer: 5000
    });
  }

  addToCart() {
    return swal({
      title: 'Cart! Are you sure of proceeding with this operation?',
      text: 'You won\'t be able to revert this!',
      type: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm!'
    });
  }

  addToCartSuccess() {
    return this.toast({
      type: 'success',
      title: 'Order successfully placed'
    });
  }

  confirmUpdate() {
    return swal({
      title: 'Record Update!',
      text: 'Are you sure of the record supplied?',
      type: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm!'
    });
  }

  afterUpdateSuccess() {
    return this.toast({
      type: 'success',
      title: 'Record saved successfully'
    });
  }

  confirmDelete() {
    return swal({
      title: 'Record Delete!',
      text: 'You won\'t be able to revert this!',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm!'
    });
  }

  afterDeleteSuccess() {
    return this.toast({
      type: 'success',
      title: 'Record deleted successfully'
    });
  }

  loginSuccess() {
    return this.toast({
      type: 'success',
      title: 'Login Sucessfull'
    });
  }
}

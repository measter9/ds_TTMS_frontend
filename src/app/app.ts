import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Contact } from './models/contacts.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AsyncPipe, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  http = inject(HttpClient);
  contacts$ = this.getContacts();

  contactName = '';
  contactNumber = '';
  isEditing = false;
  editingContactId = '';


  private getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>('https://localhost:7097/api/Contacts')
  }

  protected removeContact(id:string){
this.http.delete(`https://localhost:7097/api/Contacts/${id}`).subscribe({
      next: (res) => {
        console.log('usunięto kontakt', res);
        this.contacts$ = this.getContacts();
        this.contactName = '';
        this.contactNumber = '';
      },
      error: (err) => {
        console.error('Błąd przy usuwaniu kontaktu:', err);
      },
    });
    
  
  }
  protected addContact(){
    const newContact = { name: this.contactName, number: this.contactNumber };
    this.http.post('https://localhost:7097/api/Contacts', newContact).subscribe({
      next: (res) => {
        console.log('Dodano kontakt', res);
        this.contacts$ = this.getContacts();
        this.contactName = ''; 
        this.contactNumber = '';
      },
      error: (err) => {
        console.error('Błąd przy dodawaniu kontaktu:', err);
      },
    });
  }

  protected editBtn(id:string){
    this.isEditing = true;
    this.editingContactId = id;

    
  }


  protected editContact() {
    if (!this.editingContactId) return;

    const updatedContact = {
      id: this.editingContactId,
      name: this.contactName,
      number: this.contactNumber,
    };

    this.http.put(`https://localhost:7097/api/Contacts/${this.editingContactId}`, updatedContact).subscribe({
      next: () => {
        this.contacts$ = this.getContacts();
        this.contactName = ''; 
        this.contactNumber = '';      },
        
      error: (err) => console.error('Błąd przy edycji kontaktu:', err),
    });
  }
  
}

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientOrderBookingSuccessComponent } from './client-order-booking-success.component';

describe('ClientOrderBookingSuccessComponent', () => {
  let component: ClientOrderBookingSuccessComponent;
  let fixture: ComponentFixture<ClientOrderBookingSuccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClientOrderBookingSuccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClientOrderBookingSuccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

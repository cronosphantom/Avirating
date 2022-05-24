import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyAirportsComponent } from './my-airports.component';

describe('MyAirportsComponent', () => {
  let component: MyAirportsComponent;
  let fixture: ComponentFixture<MyAirportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyAirportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyAirportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

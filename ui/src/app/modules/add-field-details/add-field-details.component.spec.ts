import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFieldDetailsComponent } from './add-field-details.component';

describe('AddFieldDetailsComponent', () => {
  let component: AddFieldDetailsComponent;
  let fixture: ComponentFixture<AddFieldDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddFieldDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFieldDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

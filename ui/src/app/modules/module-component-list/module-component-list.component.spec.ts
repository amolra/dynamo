import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModuleComponentListComponent } from './module-component-list.component';

describe('ModuleComponentListComponent', () => {
  let component: ModuleComponentListComponent;
  let fixture: ComponentFixture<ModuleComponentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModuleComponentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleComponentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

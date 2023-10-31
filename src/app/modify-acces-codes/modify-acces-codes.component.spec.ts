import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifyAccesCodesComponent } from './modify-acces-codes.component';

describe('ModifyAccesCodesComponent', () => {
  let component: ModifyAccesCodesComponent;
  let fixture: ComponentFixture<ModifyAccesCodesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ModifyAccesCodesComponent]
    });
    fixture = TestBed.createComponent(ModifyAccesCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

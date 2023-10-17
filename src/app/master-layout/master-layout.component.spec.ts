import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MasterLayoutComponent } from './master-layout.component';

describe('MasterLayoutComponent', () => {
  let component: MasterLayoutComponent;
  let fixture: ComponentFixture<MasterLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MasterLayoutComponent]
    });
    fixture = TestBed.createComponent(MasterLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

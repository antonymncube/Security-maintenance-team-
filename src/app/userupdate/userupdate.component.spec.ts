import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserupdateComponent } from './userupdate.component';

describe('UserupdateComponent', () => {
  let component: UserupdateComponent;
  let fixture: ComponentFixture<UserupdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserupdateComponent]
    });
    fixture = TestBed.createComponent(UserupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

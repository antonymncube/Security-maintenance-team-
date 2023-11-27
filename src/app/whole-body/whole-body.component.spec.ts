import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WholeBodyComponent } from './whole-body.component';

describe('WholeBodyComponent', () => {
  let component: WholeBodyComponent;
  let fixture: ComponentFixture<WholeBodyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WholeBodyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(WholeBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

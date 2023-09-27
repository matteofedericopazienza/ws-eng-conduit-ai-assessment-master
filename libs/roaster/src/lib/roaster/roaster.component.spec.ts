import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoasterComponent } from './roaster.component';

describe('RoasterComponent', () => {
  let component: RoasterComponent;
  let fixture: ComponentFixture<RoasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RoasterComponent]
    });
    fixture = TestBed.createComponent(RoasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

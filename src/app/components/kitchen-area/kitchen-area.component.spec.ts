import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { KitchenAreaComponent } from './kitchen-area.component';

describe('KitchenAreaComponent', () => {
  let component: KitchenAreaComponent;
  let fixture: ComponentFixture<KitchenAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ KitchenAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KitchenAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

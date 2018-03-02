import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaitAreaComponent } from './wait-area.component';

describe('WaitAreaComponent', () => {
  let component: WaitAreaComponent;
  let fixture: ComponentFixture<WaitAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

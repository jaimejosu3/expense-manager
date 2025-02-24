import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryDistributionComponent } from './category-distribution.component';

describe('CategoryDistributionComponent', () => {
  let component: CategoryDistributionComponent;
  let fixture: ComponentFixture<CategoryDistributionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryDistributionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CategoryDistributionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

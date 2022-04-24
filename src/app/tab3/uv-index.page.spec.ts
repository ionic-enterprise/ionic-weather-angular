import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';
import { UVIndexPage } from './uv-index.page';

describe('UVIndexPage', () => {
  let component: UVIndexPage;
  let fixture: ComponentFixture<UVIndexPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [UVIndexPage],
      imports: [IonicModule.forRoot(), ExploreContainerComponentModule],
    }).compileComponents();

    fixture = TestBed.createComponent(UVIndexPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

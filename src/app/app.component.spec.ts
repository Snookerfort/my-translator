import { MockBuilder, MockedComponentFixture, MockRender, ngMocks } from 'ng-mocks';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { TranslatorComponent } from './components/translator/translator.component';


describe('AppComponent', () => {
  let fixture: MockedComponentFixture<AppComponent>;

  beforeEach(() => MockBuilder(AppComponent, AppModule));

  beforeEach(() => {
    fixture = MockRender(AppComponent);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(fixture.point.componentInstance).toBeDefined();
  });

  it('should contain TranslatorComponent', () => {
    const translatorComponent = ngMocks.findInstance(TranslatorComponent);
    expect(translatorComponent).toEqual(jasmine.any(TranslatorComponent));
  });

});

import { EMPTY } from 'rxjs';
import { cold } from 'jasmine-marbles';
import createSpy = jasmine.createSpy;

export class AlertingStubService {
  open = createSpy('open').and.returnValue(EMPTY)
}

export class TranslateApiStubService {

  static languages = [{code: 'en', name: 'English'}];

  listLanguages = createSpy('listLanguages')
    .and
    .returnValue(cold('-x|', {x: TranslateApiStubService.languages}))
}

export class ClipBoardStub implements Partial<Clipboard> {

  readText(): Promise<string> {
    return Promise.resolve('');
  }

  writeText(data: string): Promise<void> {
    return Promise.resolve(undefined);
  }
}

export class NavigatorStub {
  clipboard = new ClipBoardStub()
}

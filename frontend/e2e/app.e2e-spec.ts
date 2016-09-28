import { SeclabPage } from './app.po';

describe('seclab App', function() {
  let page: SeclabPage;

  beforeEach(() => {
    page = new SeclabPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

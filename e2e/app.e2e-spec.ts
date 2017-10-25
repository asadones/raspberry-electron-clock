import { RbpclockPage } from './app.po';

describe('rbpclock App', function() {
  let page: RbpclockPage;

  beforeEach(() => {
    page = new RbpclockPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

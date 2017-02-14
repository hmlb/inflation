import { InflationPage } from './app.po';

describe('inflation App', function() {
  let page: InflationPage;

  beforeEach(() => {
    page = new InflationPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});

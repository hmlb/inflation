import { TestBed, async, inject } from '@angular/core/testing';
import { WorldbankDataProvider } from './worldbank.data.provider';
import { HttpModule } from '@angular/http';

describe('WorldBankDataProvider', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpModule ],
      providers: [
        WorldbankDataProvider,
      ]
    });
    TestBed.compileComponents();
  });
  it('should fetch data', async(() => {
    inject([ WorldbankDataProvider ], (provider: WorldbankDataProvider) => {

      expect(provider.heho).toBe('yoea');

      provider.inflationData().subscribe((data) => {

        expect(typeof data[0]).toBe('array');

        expect(data[0]).toBe('youpi');

      });
    });
  }));

});

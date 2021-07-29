import ApiService from '../GetWeather'

describe('unit test for axios', () => {
    it('checks if axios is created', () => {
        expect(ApiService.get('')).toStrictEqual(Promise.resolve({}));
    })
})

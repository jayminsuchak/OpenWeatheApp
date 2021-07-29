import { getNested, isWifiConnected, scheduleNotification } from '../Utils'


jest.mock('synch-plugin');

describe('test cases for Utils', () => {


    it('tests for isWifi Not Connected', async () => {
        expect(isWifiConnected()).toStrictEqual(Promise.resolve({}))
    });

    it('tests for setUpNotification', async () => {
        expect(scheduleNotification()).toStrictEqual(Promise.resolve({}))
    });

    it('tests for geteNested', async () => {
        expect(getNested({
            "data": {

            }
        }, "data")).toStrictEqual({})
    });
})


const diMock = {
    schedule : jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    addListener: jest.fn().mockReturnValue('localNotificationReceived'),
}

module.exports = diMock;
const uuid = jest.genMockFromModule('uuid');
uuid.v4 = jest.fn(() => 1001);

module.exports = uuid;

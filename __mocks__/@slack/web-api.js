const postMessage = jest.fn();
const mockClient = jest.fn().mockImplementation(() => {
  return mClient = {
    chat: {
        postMessage: postMessage
    },
    paginate: jest.fn(() => {
      const values = [{value: {channels: [{name: 'my-channel', id: 5}]}}]
      return {
        [Symbol.asyncIterator]() {
          return {
            next() {
              if (values.length > 0) {
                return Promise.resolve(values.shift())
              }
              else {
                return Promise.resolve({done: true})
              }
            }
          }
        }
      }
    })
  };
});

module.exports.WebClient = mockClient;
module.exports.postMessage = postMessage;

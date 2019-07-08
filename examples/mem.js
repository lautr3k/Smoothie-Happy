import sh from '../src'

export default function ({ address }) {
  sh.commands.mem({
    address, // @esdoc address: '192.168.1.121',
    timeout: 0,
    verbose: true
  })
    .then(response => {
      console.log('response:', response)
      console.log('>>>', JSON.stringify(response.data.memoryPool, null, 2))
      // >>> {
      //   "unusedHeap": 9696,
      //   "usedHeap": 16640,
      //   "allocated": 14536,
      //   "free": 936,
      //   "freeRAM": 10632,
      //   "freeAHB0": 11068,
      //   "freeAHB1": 10440,
      //   "blockSize": 84,
      //   "tickInfoSize": 224,
      //   "chunks": [
      //     {
      //       "num": "1",
      //       "address": "0x10000D08",
      //       "size": 32,
      //       "free": false
      //     },
      //     ...
      //   ],
      //   "memoryPool": [
      //     {
      //       "address": "0x2007c4b0",
      //       "start": 15184,
      //       "chunks": [
      //         {
      //           "address": "0x2007c4b0",
      //           "offset": 0,
      //           "free": false,
      //           "size": 268
      //         },
      //         ...
      //       ],
      //       "total": 15184,
      //       "free": 11068
      //     },
      //     {
      //       "address": "0x20081738",
      //       "start": 10440,
      //       "chunks": [
      //         {
      //           "address": "0x20081738",
      //           "offset": 0,
      //           "free": true,
      //           "size": 10440
      //         },
      //         ...
      //       ],
      //       "total": 10440,
      //       "free": 10440
      //     }
      //   ],
      //   "text": ""
      // }
    })
    .catch(error => {
      console.log(`${error.type}: ${error.message}`, error)
    })
}

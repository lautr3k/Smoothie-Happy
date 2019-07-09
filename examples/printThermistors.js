import sh from '../src'

export default function ({ address }) {
  sh.commands.printThermistors({
    address, // @esdoc address: '192.168.1.121',
    timeout: 2000
  })
    .then(response => {
      console.log('response:', response)
      console.log('>>>', JSON.stringify(response.data, null, 2))
      // >>> {
      //   "table": [
      //     {
      //       "id": 1,
      //       "name": "EPCOS100K"
      //     },
      //     {
      //       "id": 2,
      //       "name": "Vishay100K"
      //     },
      //     {
      //       "id": 3,
      //       "name": "Honeywell100K"
      //     },
      //     {
      //       "id": 4,
      //       "name": "Semitec"
      //     },
      //     {
      //       "id": 5,
      //       "name": "Honeywell"
      //     },
      //     {
      //       "id": 6,
      //       "name": "Semitec"
      //     }
      //   ],
      //   "beta": [
      //     {
      //       "id": 129,
      //       "name": "EPCOS100K"
      //     },
      //     {
      //       "id": 130,
      //       "name": "RRRF100K"
      //     },
      //     {
      //       "id": 131,
      //       "name": "RRRF10K"
      //     },
      //     {
      //       "id": 132,
      //       "name": "Honeywell100K"
      //     },
      //     {
      //       "id": 133,
      //       "name": "Semitec"
      //     },
      //     {
      //       "id": 134,
      //       "name": "HT100K"
      //     }
      //   ]
      // }
    })
    .catch(error => {
      console.log(`${error.type}: ${error.message}`, error.response)
    })
}

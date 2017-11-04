const utils = require('../utils'),
      assert = require('assert');

/*
| Payload       | Sequence #| Type         | From User Id | To User Id |
|---------------|-----------|--------------|--------------|------------|
|666\|F\|60\|50 | 666       | Follow       | 60           | 50         |
|1\|U\|12\|9    | 1         | Unfollow     | 12           | 9          |
|542532\|B      | 542532    | Broadcast    | -            | -          |
|43\|P\|32\|56  | 43        | Private Msg  | 32           | 56         |
|634\|S\|32     | 634       | Status Update| 32           | -          |
*/
describe('Utils', function() {
  describe('utils.parsePayload()', function() {

    let testServicePayloadParsing = {
      'follow':  { 'input': '666\|F\|60\|50','output': { 'message': '666\|F\|60\|50', 'seqNum': '666' , 'type': 'F', 'from': '60', 'to': '50'}},
      'unfollow': { 'input': '1\|U\|12\|9', 'output': { 'message':  '1\|U\|12\|9', 'seqNum': '1' , 'type': 'U', 'from': '12', 'to': '9'}},
      'broadcast': { 'input': '542532\|B', 'output': { 'message':  '542532\|B', 'seqNum': '542532' , 'type': 'B' }},
      'privateMsg': { 'input': '43\|P\|32\|56', 'output': { 'message':  '43\|P\|32\|56', 'seqNum': '43' , 'type': 'P', 'from': '32', 'to': '56'}},
      'statusUpdate': { 'input': '634\|S\|32', 'output': { 'message':  '634\|S\|32', 'seqNum': '634'  , 'type': 'S', 'from': '32'}}
    };

    Object.keys(testServicePayloadParsing).map((key) => {
      it('Testing ' + key + ' parsing', () => {
        const parsed = utils.parseSingleServicePayload(testServicePayloadParsing[key].input);
        assert.deepEqual(parsed, testServicePayloadParsing[key].output);
      });
    });

    it('Testing string parsing', () => {
      const parsed = utils.parseServicePayload(
        '59254|F|288|245\n59290|S|788\n59233|F|242|79\n59280|F|698|551\n59293|S|814\n59230|S|953\n59227|S|235\n59273|P|223|992\n59235|P|953|70\n'
        );
    })
  });
});

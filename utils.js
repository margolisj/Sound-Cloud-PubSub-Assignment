const parseSingleServicePayload = (message) => {
  const splitMessage = message.split('\|');
  if (!splitMessage || splitMessage.length < 2) {
    throw 'Parsing error, not enough info in message' + message;
  }

  let parsed = {
    'message': message,
    'seqNum': splitMessage[0],
    'type': splitMessage[1],
  };

  if (splitMessage.length >= 3) {
    parsed['from'] = splitMessage[2];
  }
  if (splitMessage.length == 4){
    parsed['to'] = splitMessage[3];
  }
  
  return parsed;
};

const parseServicePayload = (message) => {
  // Remove trailing newline char, split on \n and then
  // parse them individually
  if (message) {
    return message.substring(0, message.length - 1)
                  .split('\n')
                  .map(parseSingleServicePayload);
  }
  return [];
}

module.exports = {
  parseSingleServicePayload,
  parseServicePayload
};


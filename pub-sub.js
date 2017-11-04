const utils = require('./utils');

class PubSub {
  constructor() {
    // Maps from userId string to socket
    this.listeners = new Map();
    this.handlers = {
      'F' : this.follow,
      'U' : this.unfollow,
      'B' : this.broadcast,
      'P' : this.privateMessage,
      'S' : this.statusUpdate
    };
    // Maps from userId to list of userIds which follow the key
    this.followerMap = new Map();
  }

  //
  // PubSub functions
  //
  subscribe(clientId, sock) {
    console.log('Adding user ' + clientId);
    this.listeners.set(clientId, sock);
  }

  publish(messages) {
    utils.parseServicePayload(messages).map((message) => {
      if(message.type in this.handlers)
        // Use call changes scope otherwise due to function being
        // define in the object above
        this.handlers[message.type].call(this, message);
    });
  }

  //
  // Socket messengers
  //
  singleRecipient(message, userId) {
    const recipient = this.listeners.get(userId);
    if (recipient) {
      recipient.write(message.message);
      console.log('Sent ' + message.message + ' to ' + userId);
    } else {
      // Wasn't given specifics if this could occur
      console.log('Unable to find user ' + userId);
    }
  }

  sendToAll(message) {
    console.log('Broadcasted: ' + message.message);
    this.listeners.forEach((v) => { v.write(message.message); });
  }

  //
  // Handlers
  //
  // Send message to 'To User Id'
  follow(message) {
    let followers = this.followerMap.get(message.to);
    if (!followers) {
      this.followerMap.set(message.to, [message.from]);
    } else {
      console.log(followers);
      followers.push(message.from);
      // TODO: Not sure if the following line is needed
      // as I'm pretty sure its pointing to it
      this.followerMap.set(message.to, followers);
    }
    this.singleRecipient(message, message.to);
  }

  unfollow(message) {
    // Send nothing to user after unfollow
    let followers = this.followerMap.get(message.to);
    if (followers) {
      const loc = followers.indexOf(message.from);
      followers.splice(loc, loc + 1);
      this.followerMap.set(message.to, followers);
    }
  }

  // Send the message to all connected clients
  broadcast(message) {
    this.sendToAll(message);
  }

  // Send message to 'To User Id'
  privateMessage(message) {
    this.singleRecipient(message, message.to);
  }

  // Update the status
  statusUpdate(message) {
    const followers = this.followerMap.get(message.to);
    if (followers) {
        followers.forEach((v) => { v.write(message.message); });
    }
  }

}

module.exports = PubSub;

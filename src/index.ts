import groupMsgHandler from './handler/GroupMsgHandler.js'

import { napcat } from './napcat/napcat.js'
napcat.on('message.group', groupMsgHandler)
napcat.connect()
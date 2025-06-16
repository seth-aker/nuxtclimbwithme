import { IMessageGroup } from "../models/MessageGroup";
import { IUserPrivate } from "../models/User";

export default function(user: IUserPrivate, chatGroup: IMessageGroup) {
  let containsUser = false;
  for (let index = 0; index < chatGroup.members.length; index++) {
      const member = chatGroup.members[index];
      if(member._id.equals(user._id)){
          containsUser = true;
          break;
      }
  }
  return containsUser;
}

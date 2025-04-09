import { IChatGroup } from "../models/ChatGroup";
import { IUser } from "../models/User";

export default function(user: IUser, chatGroup: IChatGroup) {
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

import { useAppDispatch, useAppSelector } from "@app/hooks";
import {
  selectChats,
  selectCurrentUser,
  selectOnlineFriends,
} from "@app/slices/auth.slice";
import { useEffect, useState } from "react";

const useHomeModel = () => {
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useAppDispatch();

  const currentUser = useAppSelector(selectCurrentUser);
  const chats = useAppSelector(selectChats);
  const onlineFriends = useAppSelector(selectOnlineFriends);

  return {
    currentUser,
    onlineFriends,
    chats,
    isLoading,
  };
};

export default useHomeModel;

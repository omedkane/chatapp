import { useAppDispatch, useAppSelector } from "@app/hooks";
import {
  selectChats,
  selectCurrentUser,
  selectOnlineFriends,
} from "@app/slices/auth.slice";
import auth from "@app/thunks/auth.thunks";
import { useEffect, useState } from "react";

const useHomeModel = () => {
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(auth.login()).then(() => {
      setIsLoading(false);
    });
  }, [dispatch]);

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

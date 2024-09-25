import { Device } from "app/ui/device.ui";
import { useEffect, useState } from "react";
import { EmitterSubscription, Keyboard } from "react-native";

function useDismissKeyboard(isHide: boolean) {
  useEffect(() => {
    if (isHide) {
      Keyboard.dismiss();
    }
  }, [isHide]);
}

function useIsKeyboardShown() {
  const [isKeyboardShown, setIsKeyboardShown] = useState(false);

  useEffect(() => {
    const handleKeyboardShow = () => setIsKeyboardShown(true);
    const handleKeyboardHide = () => setIsKeyboardShown(false);
    let keyboardWillShow: EmitterSubscription;
    let keyboardWillHide: EmitterSubscription;
    let keyboardDidShow: EmitterSubscription;
    let keyboardDidHide: EmitterSubscription;
    if (Device.isIos) {
      keyboardWillShow = Keyboard.addListener(
        'keyboardWillShow',
        handleKeyboardShow,
      );
      keyboardWillHide = Keyboard.addListener(
        'keyboardWillHide',
        handleKeyboardHide,
      );
    } else {
      keyboardDidShow = Keyboard.addListener(
        'keyboardDidShow',
        handleKeyboardShow,
      );
      keyboardDidHide = Keyboard.addListener(
        'keyboardDidHide',
        handleKeyboardHide,
      );
    }

    return () => {
      if (Device.isIos) {
        keyboardWillShow.remove();
        keyboardWillHide.remove();
      } else {
        keyboardDidShow.remove();
        keyboardDidHide.remove();
      }
    };
  }, []);

  return isKeyboardShown;
}

export {
  useDismissKeyboard,
  useIsKeyboardShown
}
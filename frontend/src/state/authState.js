import { atom } from "recoil";

export const loggedInState = atom({
  key: "loggedInState",
  default: false, // Set this based on your needs
});

export const userDetailsCompletedState = atom({
  key: "userDetailsCompletedState",
  default: false,
});

import api from "./axios";

export const runImbibing = () =>
  api.post("/imbibing/run");

export const getImbibingStatus = () =>
  api.get("/imbibing/status");
